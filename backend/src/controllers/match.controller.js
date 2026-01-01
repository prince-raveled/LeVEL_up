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

    // If user doesn't have availability set, return no matches (for old users)
    if (!currentUser.availability) {
      return res.json([]);
    }

    // Prepare lookingFor array (robust to string/empty values)
    const lookingFor = Array.isArray(currentUser.lookingFor)
      ? currentUser.lookingFor.filter(Boolean)
      : currentUser.lookingFor
      ? [currentUser.lookingFor]
      : [];

    // Build query: match others in the same availability cluster with mutual skill interests
    const baseQuery = { 
      _id: { $ne: userId },
      availability: currentUser.availability, // Same cluster
      skills: { $in: lookingFor }, // Other user has skills current user is looking for
      lookingFor: { $in: currentUser.skills } // Other user is looking for skills current user has
    };

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
