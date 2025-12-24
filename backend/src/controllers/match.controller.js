const User = require("../models/user");

// @desc    Get compatible matches for a user
// @route   GET /api/match/:userId
// @access  Public
const getMatches = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find current user
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Prepare lookingFor array (robust to string/empty values)
    const lookingFor = Array.isArray(currentUser.lookingFor)
      ? currentUser.lookingFor.filter(Boolean)
      : currentUser.lookingFor
      ? [currentUser.lookingFor]
      : [];

    // Build query (previous behavior): match others; if lookingFor set, require skills match.
    const baseQuery = { _id: { $ne: userId } };

    if (lookingFor.length) {
      baseQuery.skills = { $in: lookingFor };
    }

    const matches = await User.find(baseQuery).select("-__v");

    res.json(matches);
  } catch (error) {
    console.error("Match error:", error.message);
    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = { getMatches };
