const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

app.use(cors());
app.use(express.json());

// Koneksi Database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Jalur tes buat mastiin backend "Bangun" (akses: /api/health)
app.get('/api/health', (req, res) => {
    return res.json({ status: "OK", message: "Server Nyala Bro!" });
});

// Route Register (Wajib pake /api/ di depannya)
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Ganti jadi 'users' sesuai nama tabel di Supabase lo
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password]);
        return res.json({ success: true, message: "DAFTAR BERHASIL!" });
    } catch (err) {
        console.error("LOG ERROR:", err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
});

// Route Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        
        if (result.rows.length > 0) {
            return res.json({ success: true, id_user: result.rows[0].id });
        } else {
            return res.status(401).json({ success: false, message: "Email atau password salah!" });
        }
    } catch (err) {
        console.error("LOG ERROR:", err.message);
        return res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = app;
