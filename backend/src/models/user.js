const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // Availability cluster (hackathon, project, research, quiz)
    availability: {
      type: String,
      required: true,
      enum: ['hackathon', 'project', 'research', 'quiz'],
    },

    // Skills the user already has
    skills: {
      type: [String],
      required: true,
    },

    // Skills the user is looking for in teammates
    lookingFor: {
      type: [String],
      required: true,
    },

    

    // Portfolio / profile links
    portfolio: {
      github: { type: String },
      linkedin: { type: String },
      leetcode: { type: String },
      website: { type: String },
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);

// Add indexes for performance
userSchema.index({ availability: 1 });
userSchema.index({ skills: 1 });
userSchema.index({ availability: 1, skills: 1 });

