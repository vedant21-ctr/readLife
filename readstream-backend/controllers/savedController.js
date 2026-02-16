import SavedItem from '../models/SavedItem.js';
import Content from '../models/Content.js';

// @desc    Get all saved items
// @route   GET /api/saved
// @access  Private
export const getSavedItems = async (req, res) => {
  try {
    const { page = 1, limit = 25, type } = req.query;
    const skip = (page - 1) * limit;

    const query = { user: req.user._id };

    const savedItems = await SavedItem.find(query)
      .populate('content')
      .sort({ savedAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    // Filter by content type if specified
    let filteredItems = savedItems;
    if (type) {
      filteredItems = savedItems.filter(item => item.content && item.content.type === type);
    }

    const total = await SavedItem.countDocuments(query);

    res.json({
      savedItems: filteredItems,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save content to read-later
// @route   POST /api/saved
// @access  Private
export const saveContent = async (req, res) => {
  try {
    const { contentId, article } = req.body;
    let targetContentId = contentId;

    // 1. Try finding by ID (if valid ObjectId)
    let content;
    if (contentId.match(/^[0-9a-fA-F]{24}$/)) {
      content = await Content.findById(contentId);
    }

    // 2. If not found or invalid ObjectId, try externalId
    if (!content) {
      content = await Content.findOne({ externalId: contentId });
    }

    // 3. If still not found, materialize it if article data is provided
    if (!content && article) {
      content = await Content.create({
        title: article.title,
        description: article.description,
        content: article.content || article.description,
        externalId: contentId, // Use the hash as externalId
        imageUrl: article.imageUrl,
        source: article.source,
        category: article.category,
        publishedAt: article.publishedAt,
        likes: 0,
        likedBy: [],
        views: 0,
        url: article.url,
        type: 'news'
      });
    }

    if (!content) {
      return res.status(404).json({ message: 'Content not found and no article data provided to Create it.' });
    }

    targetContentId = content._id;

    // Check if already saved
    const existingSave = await SavedItem.findOne({
      user: req.user._id,
      content: targetContentId
    });

    if (existingSave) {
      return res.status(400).json({ message: 'Content already saved' });
    }

    const savedItem = await SavedItem.create({
      user: req.user._id,
      content: targetContentId
    });

    const populatedItem = await SavedItem.findById(savedItem._id).populate('content');

    res.status(201).json(populatedItem);
  } catch (error) {
    console.error("Save Content Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove saved item
// @route   DELETE /api/saved/:id
// @access  Private
export const removeSavedItem = async (req, res) => {
  try {
    const savedItem = await SavedItem.findById(req.params.id);

    if (!savedItem) {
      return res.status(404).json({ message: 'Saved item not found' });
    }

    if (savedItem.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await savedItem.deleteOne();

    res.json({ message: 'Saved item removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove saved item by Content ID
// @route   DELETE /api/saved/content/:contentId
// @access  Private
export const removeSavedItemByContent = async (req, res) => {
  try {
    const { contentId } = req.params;

    // Find the saved item with this content AND user
    // We need to find the SavedItem that references this Content
    // Issue: contentId might be the Content._id or externalId.
    // Ideally we assume it's Content._id if it's a valid ObjectId.

    // First find the content to get its _id if possible
    let targetContentId = contentId;

    // If not ObjectId, find Content by externalId
    /* 
       Actually, frontend sends article._id which is usually the Content._id (or the temp mock ID).
       If it's a temp mock ID, it might not exist in Content collection yet if not saved.
       But if we are removing it, it MUST exist in SavedItem.
       SavedItem.content is a reference to Content._id.
    */

    // Find Content first to get internal _id
    // This is safer because SavedItem stores ObjectId of Content
    let content;
    if (contentId.match(/^[0-9a-fA-F]{24}$/)) {
      content = await Content.findById(contentId);
    } else {
      content = await Content.findOne({ externalId: contentId });
    }

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const savedItem = await SavedItem.findOne({
      user: req.user._id,
      content: content._id
    });

    if (!savedItem) {
      return res.status(404).json({ message: 'Saved item not found' });
    }

    await savedItem.deleteOne();

    res.json({ message: 'Saved item removed' });
  } catch (error) {
    console.error("Remove Saved Error:", error);
    res.status(500).json({ message: error.message });
  }
};
