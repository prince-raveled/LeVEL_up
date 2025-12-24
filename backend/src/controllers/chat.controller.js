const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const User = require("../models/user");

// @desc    Get conversations for a user
// @route   GET /api/chat/conversations/:userId
const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate("participants", "name")
      .populate("request");

    res.json(conversations);
  } catch (error) {
    console.error("Get conversations error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:conversationId
const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const messages = await Message.find({
      conversation: conversationId,
    })
      .populate("sender", "name")
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Send a message
// @route   POST /api/chat/messages
const sendMessage = async (req, res) => {
  try {
    const { conversationId, senderId, content } = req.body;

    const message = await Message.create({
      conversation: conversationId,
      sender: senderId,
      content,
    });

    const populatedMessage = await Message.findById(message._id).populate(
      "sender",
      "name"
    );

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Mark messages as seen for a conversation (messages sent to current user)
// @route   PATCH /api/chat/messages/:conversationId/seen
const markMessagesSeen = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "userId required" });
    }

    const result = await Message.updateMany(
      { conversation: conversationId, sender: { $ne: userId }, seen: false },
      { $set: { seen: true } }
    );

    // fetch ids of updated messages
    const updated = await Message.find({ conversation: conversationId, sender: { $ne: userId }, seen: true }).select("_id");
    const messageIds = updated.map((m) => m._id.toString());

    // emit socket event to conversation room if io is available
    const io = req.app.get("io");
    if (io) {
      io.to(conversationId).emit("messageSeen", { conversationId, messageIds, userId });
    }

    res.json({ message: "marked seen", updatedCount: result.modifiedCount || result.nModified || 0, messageIds });
  } catch (error) {
    console.error("Mark seen error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesSeen,
};