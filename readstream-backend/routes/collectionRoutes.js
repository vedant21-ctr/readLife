import express from 'express';
import {
  getCollections,
  createCollection,
  updateCollection,
  deleteCollection
} from '../controllers/collectionController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getCollections);
router.post('/', protect, createCollection);
router.put('/:id', protect, updateCollection);
router.delete('/:id', protect, deleteCollection);

export default router;
