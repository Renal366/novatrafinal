const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

app.use(cors());
app.use(express.json());

// KONEKSI DATABASE - Pastikan tanda kutip di awal dan akhir link ada semua!
const pool = new Pool({
  connectionString: "postgresql://postgres:renaldicahya@db.ipuqtuobbyqfenfjaiik.supabase.co:5432/postgres
  ssl: { 
    rejectUnauthorized: false 
  }
});

app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Pake tanda kutip dua "user" karena 'user' adalah reserved word di Postgres
        await pool.query('INSERT INTO "user" (email, password) VALUES ($1, $2)', [email, password]);
        res.json({ success: true, message: "DAFTAR BERHASIL!" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query('SELECT * FROM "user" WHERE email = $1 AND password = $2', [email, password]);
        if (result.rows.length > 0) {
            res.json({ success: true, id_user: result.rows[0].id_user });
        } else {
            res.json({ success: false, message: "Email atau password salah!" });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = app;
