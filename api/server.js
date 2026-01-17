const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const app = express();

app.use(cors());
app.use(express.json());

// 1. Koneksi Database (Sudah Bener Pakai pg)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Jalur tes
app.get('/api/health', (req, res) => {
    return res.json({ status: "OK", message: "Server Nyala Bro!" });
});

// --- AUTHENTICATION (FIXED: Pakai pool.query & $1) ---
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        // PostgreSQL pakai $1, $2
        await pool.query('INSERT INTO "users" (email, password) VALUES ($1, $2)', [email, password]);
        res.json({ success: true, message: "Daftar berhasil!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Ambil data dari result.rows
        const result = await pool.query('SELECT id_user FROM "users" WHERE email = $1 AND password = $2', [email, password]);
        if (result.rows.length > 0) {
            res.json({ success: true, id_user: result.rows[0].id_user });
        } else {
            res.status(401).json({ success: false, message: "Email/Pass Salah" });
        }
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// --- GAMES DATA (FIXED: Nama Tabel 'game') ---
app.get('/api/games', async (req, res) => {
    try {
        // Harus 'game' sesuai screenshot lo
        const result = await pool.query('SELECT * FROM game ORDER BY id_game ASC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/games/:id', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM game WHERE id_game = $1', [req.params.id]);
        if (result.rows.length > 0) res.json(result.rows[0]);
        else res.status(404).json({ error: "Game tidak ada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PRODUCTS DATA (FIXED: Nama Kolom 'nama_paket') ---
app.get('/api/products-by-game/:id_game', async (req, res) => {
    try {
        // Sesuai schema produk_topup lo
        const result = await pool.query('SELECT * FROM produk_topup WHERE id_game = $1 ORDER BY harga ASC', [req.params.id_game]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/product-detail/:id_produk', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM produk_topup WHERE id_produk = $1', [req.params.id_produk]);
        if (result.rows.length > 0) res.json(result.rows[0]);
        else res.status(404).json({ error: "Produk tidak ditemukan" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- TRANSAKSI (FIXED: Gaya PostgreSQL) ---
app.post('/api/transaksi', async (req, res) => {
    try {
        const { id_produk, id_metode, user_game_id, total_harga, status } = req.body;
        const query = 'INSERT INTO transaksi (id_produk, id_metode, user_game_id, total_harga, status) VALUES ($1, $2, $3, $4, $5)';
        await pool.query(query, [id_produk, id_metode, user_game_id, total_harga, status]);
        res.status(200).json({ success: true, message: "Transaksi Berhasil Disimpan" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- METODE PEMBAYARAN ---
app.get('/api/metode-pembayaran', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM metode_pembayaran');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = app;
