import express from 'express';
import {
    loginAdmin,
    createAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin,
    changePassword,
    forgotPassword,
    resetPassword
} from '../controllers/AdminController.js';

import { protect, admin, superadmin } from '../middlewares/AuthMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);

router.route('/')
    .post(protect, admin, createAdmin)
    .get(protect, admin, getAllAdmins);

router.route('/:id')
    .put(protect, admin, updateAdmin)
    .delete(protect, superadmin, deleteAdmin);

router.put('/:id/change-password', protect, admin, changePassword);

router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
    

export default router;