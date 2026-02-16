import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  contents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Content'
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

collectionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
