import express from 'express';
import { getSavedItems, saveContent, removeSavedItem, removeSavedItemByContent } from '../controllers/savedController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getSavedItems);
router.post('/', protect, saveContent);
router.delete('/:id', protect, removeSavedItem);
router.delete('/content/:contentId', protect, removeSavedItemByContent);

export default router;
