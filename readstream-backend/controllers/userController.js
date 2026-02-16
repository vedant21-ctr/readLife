import User from '../models/User.js';
import SavedItem from '../models/SavedItem.js';

// @desc    Get user dashboard data (history, preferences, bookmarks)
// @route   GET /api/user/dashboard
// @access  Private
export const getUserDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .populate({
                path: 'bookmarks',
                populate: { path: 'content' }
            })
            .select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user preferences (language, categories)
// @route   PUT /api/user/preferences
// @access  Private
export const updatePreferences = async (req, res) => {
    const { language, categories } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (user) {
            if (language) user.language = language;
            if (categories) user.preferences.categories = categories;

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                language: updatedUser.language,
                preferences: updatedUser.preferences
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add article to history
// @route   POST /api/user/history
// @access  Private
export const addToHistory = async (req, res) => {
    const { articleId, title, url } = req.body;

    try {
        const user = await User.findById(req.user._id);

        if (user) {
            // Remove if already exists to push to top
            user.history = user.history.filter(item => item.articleId !== articleId);

            user.history.unshift({ articleId, title, url });

            // Limit history to 50 items
            if (user.history.length > 50) {
                user.history.length = 50;
            }

            await user.save();
            res.json(user.history);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
