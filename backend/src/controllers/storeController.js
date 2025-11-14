const pool = require("../../connections/db");

exports.getStores = async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const [stores] = await conn.execute(`
            SELECT 
                s.*, 
                u.name AS owner_name,
                COALESCE(AVG(r.rating), 0) AS average_rating
            FROM stores s
            LEFT JOIN users u ON s.owner_id = u.id
            LEFT JOIN ratings r ON s.id = r.store_id
            GROUP BY s.id
            ORDER BY s.name
        `);
        conn.release();

        res.json(stores);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addStore = async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({ error: "Only admins can add stores" });

        const { name, email, address, owner_id } = req.body;

        const conn = await pool.getConnection();

        await conn.execute(
            "INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)",
            [name, email, address, owner_id || null]
        );

        conn.release();
        res.status(201).json({ message: "Store added successfully" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStoreOwners = async (req, res) => {
    try {
        const conn = await pool.getConnection();

        const [owners] = await conn.execute(`
            SELECT id, name, email 
            FROM users 
            WHERE role = 'store_owner'
        `);

        conn.release();
        res.json(owners);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.assignStoreOwner = async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({ error: "Only admins can assign store owners" });

        const { store_id, owner_id } = req.body;

        const conn = await pool.getConnection();
        await conn.execute(
            "UPDATE stores SET owner_id = ? WHERE id = ?",
            [owner_id, store_id]
        );
        conn.release();

        res.json({ message: "Owner assigned successfully!" });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
