const pool = require("../../connections/db");

exports.addRating = async (req, res) => {
    try {
        const { store_id, rating } = req.body;

        if (rating < 1 || rating > 5)
            return res.status(400).json({ error: "Rating must be 1-5" });

        const conn = await pool.getConnection();
        const [existing] = await conn.execute(
            "SELECT id FROM ratings WHERE user_id = ? AND store_id = ?",
            [req.user.id, store_id]
        );

        if (existing.length > 0) {
            await conn.execute("UPDATE ratings SET rating = ?, updated_at = NOW() WHERE user_id = ? AND store_id = ?",
                [rating, req.user.id, store_id]);
        } else {
            await conn.execute("INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)",
                [req.user.id, store_id, rating]);
        }

        conn.release();
        res.status(201).json({ message: "Rating submitted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
exports.getRatingsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const conn = await pool.getConnection();
        const [rows] = await conn.execute(
            `SELECT 
                ratings.id,
                ratings.rating,
                ratings.store_id,
                stores.name AS store_name,
                stores.address AS store_address,
                ratings.created_at,
                ratings.updated_at
             FROM ratings
             JOIN stores ON ratings.store_id = stores.id
             WHERE ratings.user_id = ?`,
            [userId]
        );

        conn.release();

        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
