import express from 'express';
import {
  getNews,
  getJournals,
  getBooks,
  getContentById,
  getContentSummary
} from '../controllers/contentController.js';
import { getComments, addComment, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// router.get('/news', getNews);
router.get('/journals', getJournals);
router.get('/books', getBooks);
router.get('/content/:id', getContentById);
router.get('/content/:id/summary', getContentSummary);

// Comment routes
router.get('/content/:id/comments', getComments);
router.post('/content/:id/comments', protect, addComment);
router.delete('/content/:id/comments/:commentId', protect, deleteComment);

export default router;
