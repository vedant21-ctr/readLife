import express from 'express';
import { getAllUsers, addContent, getAnalytics } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.get('/users', protect, admin, getAllUsers);
router.post('/content', protect, admin, addContent);
router.get('/analytics', protect, admin, getAnalytics);

export default router;
