import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['news', 'journal', 'book'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String
  },
  description: {
    type: String
  },
  summary: {
    type: String
  },
  category: {
    type: String
  },
  publishedAt: {
    type: Date
  },
  readingTime: {
    type: Number
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  topics: [{
    type: String
  }],
  metadata: {
    type: mongoose.Schema.Types.Mixed
  },
  externalId: {
    type: String,
    unique: true,
    sparse: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

contentSchema.index({ title: 'text', description: 'text' });
contentSchema.index({ type: 1, category: 1 });

const Content = mongoose.model('Content', contentSchema);

export default Content;
