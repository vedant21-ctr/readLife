import mongoose from 'mongoose';

const savedItemSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content',
    required: true
  },
  savedAt: {
    type: Date,
    default: Date.now
  }
});

savedItemSchema.index({ user: 1, content: 1 }, { unique: true });

const SavedItem = mongoose.model('SavedItem', savedItemSchema);

export default SavedItem;
