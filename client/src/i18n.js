import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// 1. Mengimpor file-file terjemahan dari folder `locales`
import translationID from './locales/id.json';
import translationEN from './locales/en.json';
import translationSU from './locales/su.json';

// 2. Menyiapkan "sumber daya" atau kamus untuk setiap bahasa
const resources = {
  id: {
    translation: translationID.translation
  },
  en: {
    translation: translationEN.translation
  },
  su: {
    translation: translationSU.translation
  }
};

// 3. Menginisialisasi library i18next
i18n
  .use(initReactI18next) // Menghubungkan i18next dengan React
  .init({
    resources,          // Memberikan kamus terjemahan
    lng: 'id',          // Menetapkan bahasa default saat aplikasi dibuka
    fallbackLng: 'id',  // Bahasa yang digunakan jika bahasa pilihan tidak ada terjemahannya
    interpolation: {
      escapeValue: false // Fitur keamanan yang tidak diperlukan untuk React
    }
  });

export default i18n;