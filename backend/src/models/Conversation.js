const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeamRequest",
      required: true,
      unique: true, // one conversation per request
    },
  },
  {
    timestamps: true,
  }
);

module.exports =
  mongoose.models.Conversation ||
  mongoose.model("Conversation", conversationSchema);
