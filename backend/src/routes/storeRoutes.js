const express = require("express");
const router = express.Router();
const { getStores, addStore, getStoreOwners, assignStoreOwner } = require("../controllers/storeController");
const authenticateToken = require("../middleware/authMiddleware");

router.get("/", getStores);
router.post("/", authenticateToken, addStore);
router.get("/owners", authenticateToken, getStoreOwners);
router.post('/assign-owner', authenticateToken, assignStoreOwner);




module.exports = router;
