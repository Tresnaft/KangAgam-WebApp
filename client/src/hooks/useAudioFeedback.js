import { useMemo } from 'react';

// Daftar path file audio, relatif terhadap folder 'public'
const correctSoundPaths = [
    '/assets/audio/quiz/apresiasi-1.wav',
    '/assets/audio/quiz/apresiasi-2.wav',
];

const incorrectSoundPaths = [
    '/assets/audio/quiz/jawab-salah-1.wav',
    '/assets/audio/quiz/jawab-salah-2.wav',
];

/**
 * Custom Hook untuk memutar audio feedback pada kuis.
 * Hook ini mengelola pembuatan objek Audio dan menyediakan
 * fungsi untuk memutar suara 'benar' atau 'salah' secara acak.
 */
const useAudioFeedback = () => {
    // Memoize objek Audio agar tidak dibuat ulang pada setiap render
    const correctAudios = useMemo(() => correctSoundPaths.map(path => new Audio(path)), []);
    const incorrectAudios = useMemo(() => incorrectSoundPaths.map(path => new Audio(path)), []);

    /**
     * Memutar salah satu audio dan mengembalikan Promise yang resolve saat audio selesai.
     * @param {HTMLAudioElement[]} audioPool - Kumpulan audio yang akan diputar.
     * @returns {Promise<void>}
     */
    const playSound = (audioPool) => {
        return new Promise((resolve, reject) => {
            try {
                if (audioPool.length === 0) {
                    // Jika tidak ada audio, langsung resolve.
                    return resolve();
                }
                const randomIndex = Math.floor(Math.random() * audioPool.length);
                const audio = audioPool[randomIndex];

                // Hentikan audio lain yang mungkin sedang berjalan dari pool yang sama
                audioPool.forEach(a => {
                    if (!a.paused) {
                        a.pause();
                        a.currentTime = 0;
                    }
                });

                // Fungsi yang akan dijalankan saat audio selesai
                const onEnded = () => {
                    audio.removeEventListener('ended', onEnded);
                    resolve();
                };
                audio.addEventListener('ended', onEnded);
                
                audio.currentTime = 0;
                audio.play().catch(error => {
                    // Jika gagal memutar, hapus listener dan reject promise
                    audio.removeEventListener('ended', onEnded);
                    console.error("Gagal memutar audio:", error);
                    reject(error);
                });

            } catch (error) {
                console.error("Terjadi kesalahan pada fungsi playSound:", error);
                reject(error);
            }
        });
    };

    /**
     * Memutar salah satu audio 'benar' secara acak.
     */
    const playCorrectSound = () => playSound(correctAudios);

    /**
     * Memutar salah satu audio 'salah' secara acak.
     */
    const playIncorrectSound = () => playSound(incorrectAudios);

    // Kembalikan fungsi-fungsi yang bisa digunakan oleh komponen
    return { playCorrectSound, playIncorrectSound };
};

export default useAudioFeedback;