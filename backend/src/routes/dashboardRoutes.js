const express = require("express");
const router = express.Router();
const { getStats } = require("../controllers/dashboardController");
const authenticateToken = require("../middleware/authMiddleware");

router.get("/stats", authenticateToken, getStats);

module.exports = router;