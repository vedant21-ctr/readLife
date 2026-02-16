import express from 'express';
import { getUserDashboard, updatePreferences, addToHistory } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/dashboard', protect, getUserDashboard);
router.put('/preferences', protect, updatePreferences);
router.post('/history', protect, addToHistory);

export default router;
