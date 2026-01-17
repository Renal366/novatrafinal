const express = require('express');
const cors = require('cors');
const pool = require('./db');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Gunakan nama tabel 'users' sesuai dashboard Supabase lo
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password]);
        return res.status(200).json({ success: true, message: "DAFTAR BERHASIL!" });
    } catch (err) {
        console.error("LOG ERROR:", err.message);
        // Pakai 'return' biar fungsinya berhenti di sini kalau error
        return res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = app;
