const User = require('../models/User');

exports.getSettings = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      preferences: user.preferences || { theme: 'light', language: 'English' }
    });
  } catch (err) {
    console.error('[Get Settings Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to fetch settings.' });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const userId = req.user._id;
    const { theme, language } = req.body;

    const updates = {};
    if (theme && ['light', 'dark', 'system'].includes(theme)) {
      updates['preferences.theme'] = theme;
    }
    if (language) {
      updates['preferences.language'] = language;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      preferences: {
        theme: theme || req.user.preferences?.theme || 'light',
        language: language || req.user.preferences?.language || 'English'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Settings updated successfully.',
      preferences: updatedUser.preferences
    });
  } catch (err) {
    console.error('[Update Settings Error]', err);
    return res.status(500).json({ success: false, message: 'Failed to update settings.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin,
        preferences: user.preferences,
        createdAt: user.createdAt
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch profile.' });
  }
};
