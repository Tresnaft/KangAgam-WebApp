import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper untuk mendapatkan path direktori saat ini di ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @desc    Mengambil semua data kota/kabupaten
 * @route   GET /api/locations/cities
 * @access  Public
 */
export const getAllCities = async (req, res) => {
    try {
        // Tentukan path ke file JSON
        const filePath = path.resolve(__dirname, '..', 'data', 'indonesia_cities.json');
        
        // Baca file secara asynchronous
        const data = await fs.readFile(filePath, 'utf-8');
        
        // Parse data JSON dan kirim sebagai response
        const cities = JSON.parse(data);
        
        res.status(200).json(cities);

    } catch (error) {
        console.error("Error reading city data:", error);
        res.status(500).json({ message: 'Gagal memuat data domisili.' });
    }
};