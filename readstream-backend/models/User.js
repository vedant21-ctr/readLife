import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please add a valid email']
  },
  password: {
    type: String,
    required: function () {
      return !this.googleId;
    },
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: {
    type: String,
    default: ''
  },
  language: {
    type: String,
    enum: ['en', 'hi', 'es', 'fr', 'mr'], // English, Hindi, Spanish, French, Marathi
    default: 'en'
  },
  preferences: {
    categories: {
      type: [String],
      default: ['general']
    },
    sources: [String]
  },
  history: [{
    articleId: { type: String },
    title: String,
    url: String,
    viewedAt: { type: Date, default: Date.now }
  }],
  bookmarks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SavedItem'
  }],
  subscription: {
    plan: { type: String, enum: ['free', 'premium', 'supporter'], default: 'free' },
    status: { type: String, enum: ['active', 'inactive', 'canceled'], default: 'active' },
    startDate: { type: Date },
    renewalDate: { type: Date }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  if (this.password) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

// Compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
