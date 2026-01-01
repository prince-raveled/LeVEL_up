const express = require("express");
const {
  getConversations,
  getMessages,
  sendMessage,
  markMessagesSeen,
  getConversation,
} = require("../controllers/chat.controller");

const router = express.Router();

router.get("/conversations/:userId", getConversations);
router.get("/conversation/:conversationId", getConversation);
router.get("/messages/:conversationId", getMessages);
router.post("/messages", sendMessage);
router.patch("/messages/:conversationId/seen", markMessagesSeen);

module.exports = router;