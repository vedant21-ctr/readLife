import Comment from '../models/Comment.js';

// @desc    Get comments for content
// @route   GET /api/content/:id/comments
// @access  Public
export const getComments = async (req, res) => {
  try {
    const { page = 1, limit = 25 } = req.query;
    const skip = (page - 1) * limit;

    const comments = await Comment.find({ content: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await Comment.countDocuments({ content: req.params.id });

    res.json({
      comments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment
// @route   POST /api/content/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const comment = await Comment.create({
      user: req.user._id,
      content: req.params.id,
      text
    });

    const populatedComment = await Comment.findById(comment._id).populate('user', 'name avatar');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete comment
// @route   DELETE /api/content/:id/comments/:commentId
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user owns the comment or is admin
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await comment.deleteOne();

    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
