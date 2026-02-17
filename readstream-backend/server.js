import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { fetchAndStoreNews, fetchArxivPapers, fetchBooks } from './services/newsService.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import savedRoutes from './routes/savedRoutes.js';
import collectionRoutes from './routes/collectionRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Seed initial data
setTimeout(async () => {
  try {
    await fetchAndStoreNews();
    await fetchArxivPapers();
    await fetchBooks();
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}, 2000);

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: true, // Allow any origin
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'ReadStream API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api', contentRoutes);
app.use('/api/saved', savedRoutes);
import newsRoutes from './routes/newsRoutes.js';

import subscriptionRoutes from './routes/subscriptionRoutes.js';

app.use('/api/collections', collectionRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api', aiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
