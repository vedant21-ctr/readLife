import User from '../models/User.js';

// @desc    Update user subscription plan
// @route   POST /api/subscription
// @access  Private
export const updateSubscription = async (req, res) => {
    try {
        const { plan } = req.body; // 'free', 'premium', 'supporter'

        if (!['free', 'premium', 'supporter'].includes(plan)) {
            return res.status(400).json({ message: 'Invalid plan selected' });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.subscription = {
            plan: plan,
            status: 'active',
            startDate: new Date(),
            // Mocking renewal date
            renewalDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        };

        await user.save();

        res.json({
            message: `Subscription updated to ${plan}`,
            subscription: user.subscription
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
