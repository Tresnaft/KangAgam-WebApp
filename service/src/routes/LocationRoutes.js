import express from 'express';
import { getAllCities } from '../controllers/LocationController.js';

const router = express.Router();

// Rute ini akan menangani request ke /api/locations/cities
router.route('/cities').get(getAllCities);

export default router;