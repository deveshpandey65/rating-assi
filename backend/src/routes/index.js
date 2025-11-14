const express = require("express");
const router = express.Router();


// Import Routes
const authRoutes = require("./authRoutes");
const storeRoutes = require("./storeRoutes");
const ratingRoutes = require("./ratingRoutes");
const userRoutes = require("./userRoutes");
const dashboardRoutes = require("./dashboardRoutes");
const storeOwnerRoutes = require("./storeOwnerRoutes")
// Use Routes
router.use("/auth", authRoutes);
router.use("/stores", storeRoutes);
router.use("/ratings", ratingRoutes);
router.use("/users", userRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/store-owner", storeOwnerRoutes);
router.get("/test", (req, res) => {
    res.json({ msg: "Auth route working!" });
});

module.exports = router;
