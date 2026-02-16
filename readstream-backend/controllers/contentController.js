import Content from '../models/Content.js';
import axios from 'axios';
import { generateSummary } from '../services/aiService.js';

// @desc    Get news articles
// @route   GET /api/news
// @access  Public
export const getNews = async (req, res) => {
  try {
    const { page = 1, limit = 25, category, source, search, sort, startDate, endDate } = req.query;

    const query = { type: 'news' };
    if (category) query.category = category;
    if (source) query.source = source;
    if (search) query.$text = { $search: search };
    if (startDate && endDate) {
      query.publishedAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    let sortOption = { publishedAt: -1 };
    if (sort === 'popularity') sortOption = { views: -1 };
    if (sort === 'oldest') sortOption = { publishedAt: 1 };
    if (sort === 'readingTime') sortOption = { readingTime: 1 }; // Shortest first

    const skip = (page - 1) * limit;

    const news = await Content.find(query)
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Content.countDocuments(query);

    res.json({
      news,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get academic journals
// @route   GET /api/journals
// @access  Public
export const getJournals = async (req, res) => {
  try {
    const { page = 1, limit = 25, category, search } = req.query;

    const query = { type: 'journal' };
    if (category) query.category = category;
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;

    const journals = await Content.find(query)
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Content.countDocuments(query);

    res.json({
      journals,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search books
// @route   GET /api/books
// @access  Public
export const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 25, search } = req.query;

    const query = { type: 'book' };
    if (search) query.$text = { $search: search };

    const skip = (page - 1) * limit;

    const books = await Content.find(query)
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Content.countDocuments(query);

    res.json({
      books,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get specific content by ID
// @route   GET /api/content/:id
// @access  Public
export const getContentById = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get AI summary of content
// @route   GET /api/content/:id/summary
// @access  Public
export const getContentSummary = async (req, res) => {
  try {
    const content = await Content.findById(req.params.id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // If summary already exists, return it
    if (content.summary) {
      return res.json({ summary: content.summary });
    }

    // Generate AI summary using Google Gemini
    const summary = await generateSummary(content);

    // Save summary to database
    content.summary = summary;
    await content.save();

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
