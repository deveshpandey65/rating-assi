// controllers/storeOwnerController.js
const pool = require("../../connections/db");

exports.getOwnerStore = async (req, res) => {
    try {
        if (req.user.role !== "store_owner") {
            return res.status(403).json({ error: "Only store owners can access this" })
        }

        const conn = await pool.getConnection()
        const [stores] = await conn.execute(
            `SELECT s.*, COALESCE(AVG(r.rating), 0) AS average_rating, COUNT(r.id) AS rating_count
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.owner_id = ?
       GROUP BY s.id`,
            [req.user.id]
        )
        conn.release()

        if (stores.length === 0) {
            return res.json(null)
        }

        res.json(stores[0])
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}

exports.getOwnerRatings = async (req, res) => {
    try {
        if (req.user.role !== "store_owner") {
            return res.status(403).json({ error: "Only store owners can access this" })
        }

        const conn = await pool.getConnection()
        const [ratings] = await conn.execute(
            `SELECT r.*, u.name, u.email
       FROM ratings r
       JOIN stores s ON r.store_id = s.id
       JOIN users u ON r.user_id = u.id
       WHERE s.owner_id = ?
       ORDER BY r.created_at DESC`,
            [req.user.id]
        )
        conn.release()

        res.json(ratings)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
