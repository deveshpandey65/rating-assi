const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../../connections/db");

exports.register = async (req, res) => {
    try {
        const { name, email, address, password,role } = req.body;

        if (name.length < 3 || name.length > 60)
            return res.status(400).json({ error: "Name must be 3-60 characters" });

        if (address.length > 400)
            return res.status(400).json({ error: "Address max 400 characters" });

        if (!/^(?=.*[A-Z])(?=.*[!@#$%^&*])[\w!@#$%^&*]{8,16}$/.test(password))
            return res.status(400).json({ error: "Password must be 8-16 chars with uppercase and special char" });

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
            return res.status(400).json({ error: "Invalid email" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const conn = await pool.getConnection();
        if (!role) {
            role = "normal_user";
        }
        await conn.execute(
            "INSERT INTO users (name, email, address, password, role) VALUES (?, ?, ?, ?, ?)",
            [name, email, address, hashedPassword, role]
        );
        conn.release();

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const conn = await pool.getConnection();
        const [rows] = await conn.execute("SELECT * FROM users WHERE email = ?", [email]);
        conn.release();

        if (rows.length === 0) return res.status(401).json({ error: "Invalid credentials" });

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET || "your-secret-key",
            { expiresIn: "24h" }
        );

        res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
