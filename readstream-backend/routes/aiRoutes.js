import express from 'express';
import {
  getRecommendations,
  getDailyBrief,
  getPreferences,
  updatePreferences,
  extractContentTopics,
  summarizeContent,
  translateContent
} from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/recommendations', protect, getRecommendations);
router.get('/daily-brief', protect, getDailyBrief);
router.get('/preferences', protect, getPreferences);
router.put('/preferences', protect, updatePreferences);
router.post('/extract-topics', protect, extractContentTopics);
router.post('/summarize', summarizeContent);
router.post('/translate', translateContent);

export default router;
