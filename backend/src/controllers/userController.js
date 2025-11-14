const bcrypt = require("bcryptjs");
const pool = require("../../connections/db");

exports.getUsers = async (req, res) => {
    try {
        if (req.user.role !== "admin")
            return res.status(403).json({ error: "Only admins can view users" });

        const conn = await pool.getConnection();
        const [users] = await conn.execute("SELECT id, name, email, address, role FROM users ORDER BY name");
        conn.release();

        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
