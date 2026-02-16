import Content from '../models/Content.js';
import SavedItem from '../models/SavedItem.js';
import { generateRecommendations, generateDailyBrief, extractTopics } from '../services/aiService.js';

// @desc    Get personalized recommendations
// @route   GET /api/recommendations
// @access  Private
export const getRecommendations = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Get user's saved items to understand preferences
    const savedItems = await SavedItem.find({ user: req.user._id })
      .populate('content')
      .limit(50);

    // Extract categories and sources from saved items
    const categories = [...new Set(savedItems.map(item => item.content?.category).filter(Boolean))];
    const sources = [...new Set(savedItems.map(item => item.content?.source).filter(Boolean))];

    // Build recommendation query
    const query = {};
    if (categories.length > 0) {
      query.category = { $in: categories };
    }

    // Get recommendations
    const recommendations = await Content.find(query)
      .sort({ publishedAt: -1 })
      .limit(parseInt(limit));

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate daily briefing
// @route   GET /api/daily-brief
// @access  Private
export const getDailyBrief = async (req, res) => {
  try {
    const userPreferences = req.user.preferences || {};
    const categories = userPreferences.categories || [];

    const query = {};
    if (categories.length > 0) {
      query.category = { $in: categories };
    }

    // Get recent content (last 3 days)
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    query.publishedAt = { $gte: threeDaysAgo };

    const briefContent = await Content.find(query)
      .sort({ publishedAt: -1 })
      .limit(10);

    // Generate AI briefing
    const aiBriefing = await generateDailyBrief(briefContent);

    res.json({
      date: new Date().toISOString(),
      content: briefContent,
      briefing: aiBriefing,
      message: 'Your personalized daily briefing'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user preferences
// @route   GET /api/preferences
// @access  Private
export const getPreferences = async (req, res) => {
  try {
    res.json(req.user.preferences || {});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user preferences
// @route   PUT /api/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
  try {
    const { categories, sources, readingTime } = req.body;

    req.user.preferences = {
      categories: categories || req.user.preferences?.categories || [],
      sources: sources || req.user.preferences?.sources || [],
      readingTime: readingTime || req.user.preferences?.readingTime || 'any'
    };

    await req.user.save();

    res.json(req.user.preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Extract topics from content
// @route   POST /api/ai/extract-topics
// @access  Private
export const extractContentTopics = async (req, res) => {
  try {
    const { title, description } = req.body;
    const topics = await extractTopics({ title, description });
    res.json({ topics });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Summarize content
// @route   POST /api/summarize
// @access  Public
export const summarizeContent = async (req, res) => {
  try {
    const { text } = req.body;
    // In a real app, use the Gemini Service
    // const summary = await generateSummary(text);

    // Mock for now to ensure speed/reliability without API Key limits
    const summary = "This is an AI-generated summary of the content. It highlights the key points in a concise manner, using bullet points for readability. \n\n • Point 1: The main subject is introduced.\n • Point 2: Critical analysis provided.\n • Point 3: Future implications discussed.";

    res.json({ summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Translate content
// @route   POST /api/translate
// @access  Public
export const translateContent = async (req, res) => {
  try {
    const { text, targetLang } = req.body;
    // In a real app, use Gemini Service
    // const translated = await translateText(text, targetLang);

    res.json({ translatedText: `[Translated to ${targetLang}]: ${text.substring(0, 100)}...` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
