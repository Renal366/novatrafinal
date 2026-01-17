const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Pake kutip dua di "user" karena itu keyword sistem di Postgres
        
        await pool.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, password]);
        res.status(200).json({ success: true, message: "DAFTAR BERHASIL!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
      console.error("ERROR DATABASE:", err.message); // Ini bakal muncul di Log Vercel
        res.status(500).json({ success: false, message: err.message });
    }
});

module.exports = app;
