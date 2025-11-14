const express = require("express");
const router = express.Router();
const { addRating } = require("../controllers/ratingController");
const authenticateToken = require("../middleware/authMiddleware");

router.post("/", authenticateToken, addRating);
router.get("/user/:userId", authenticateToken, require("../controllers/ratingController").getRatingsByUser);

module.exports = router;
