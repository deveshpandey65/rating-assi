// routes/storeOwnerRoutes.js
const express = require("express")
const router = express.Router()
const { getOwnerStore, getOwnerRatings } = require("../controllers/storeOwnerController")
const authenticateToken = require("../middleware/authMiddleware")

router.get("/store", authenticateToken, getOwnerStore)
router.get("/ratings", authenticateToken, getOwnerRatings)

module.exports = router
