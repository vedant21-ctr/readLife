import express from 'express';
import { getNews, getNewsById, incrementView, searchNews, getRecommendedNews, likeNews, getTrendingNews, getLatestNews } from '../controllers/newsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getNews);
router.get('/search', searchNews);
router.get('/recommendations', getRecommendedNews);
router.get('/trending', getTrendingNews);
router.get('/latest', getLatestNews);
router.post('/:id/view', incrementView);
router.post('/:id/like', protect, likeNews);
router.get('/:id', getNewsById);

export default router;
