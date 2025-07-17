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

const router = express.Router();

router.post('/login', loginAdmin);

router.route('/')
    .post(createAdmin)
    .get(getAllAdmins);

router.route('/:id')
    .put(updateAdmin)
    .delete(deleteAdmin);

router.put('/:id/change-password', changePassword);

router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);
    

export default router;