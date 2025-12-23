const express = require("express");
const {
  sendRequest,
  getIncomingRequests,
  updateRequestStatus,
  getRequestByToken, // 👈 ADD THIS
} = require("../controllers/request.controller");


const router = express.Router();

router.post("/", sendRequest);
router.get("/incoming/:userId", getIncomingRequests);
router.get("/token/:token", getRequestByToken);
router.patch("/:id", updateRequestStatus);

module.exports = router;
