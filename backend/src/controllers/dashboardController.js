const pool = require("../../connections/db");

exports.getStats = async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({ error: "Only admins can view stats" });

        const conn = await pool.getConnection();
        const [userCount] = await conn.execute('SELECT COUNT(*) as count FROM users WHERE role != "admin"');
        const [storeCount] = await conn.execute("SELECT COUNT(*) as count FROM stores");
        const [ratingCount] = await conn.execute("SELECT COUNT(*) as count FROM ratings");
        conn.release();

        res.json({
            totalUsers: userCount[0].count,
            totalStores: storeCount[0].count,
            totalRatings: ratingCount[0].count,
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
