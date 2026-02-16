import express from 'express';
import { updateSubscription } from '../controllers/subscriptionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, updateSubscription);

export default router;
