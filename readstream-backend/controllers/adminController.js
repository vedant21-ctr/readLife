import User from '../models/User.js';
import Content from '../models/Content.js';
import Comment from '../models/Comment.js';
import SavedItem from '../models/SavedItem.js';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 25, search } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await User.countDocuments(query);

    res.json({
      users,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add content manually
// @route   POST /api/admin/content
// @access  Private/Admin
export const addContent = async (req, res) => {
  try {
    const { type, title, author, source, url, description, category, imageUrl } = req.body;

    const content = await Content.create({
      type,
      title,
      author,
      source,
      url,
      description,
      category,
      imageUrl,
      publishedAt: new Date()
    });

    res.status(201).json(content);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get platform statistics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalContent = await Content.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalSaves = await SavedItem.countDocuments();

    // Get content by type
    const newCount = await Content.countDocuments({ type: 'news' });
    const journalCount = await Content.countDocuments({ type: 'journal' });
    const bookCount = await Content.countDocuments({ type: 'book' });

    // Get recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });

    // Get most saved content
    const mostSaved = await SavedItem.aggregate([
      { $group: { _id: '$content', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
      { $lookup: { from: 'contents', localField: '_id', foreignField: '_id', as: 'content' } },
      { $unwind: '$content' }
    ]);

    res.json({
      totalUsers,
      totalContent,
      totalComments,
      totalSaves,
      contentByType: {
        news: newCount,
        journals: journalCount,
        books: bookCount
      },
      recentUsers,
      mostSavedContent: mostSaved
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
