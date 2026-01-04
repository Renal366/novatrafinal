const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors({ origin: '*' }));
app.use(express.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', 
    database: 'topup_game',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
}).promise();

async function testKoneksi() {
    try {
        await db.getConnection();
        console.log('DATABASE CONNECTED! Aman sat.');
    } catch (err) {
        console.log('DATABASE GAGAL: Mungkin password salah atau MySQL mati.');
        console.error(err.message);
    }
}
testKoneksi();

// --- AUTHENTICATION ---
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        await db.query('INSERT INTO user (email, password) VALUES (?, ?)', [email, password]);
        res.json({ success: true, message: "Daftar berhasil!" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Email sudah ada/Error" });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const [rows] = await db.query('SELECT id_user FROM user WHERE email = ? AND password = ?', [email, password]);
        if (rows.length > 0) {
            res.json({ success: true, id_user: rows[0].id_user });
        } else {
            res.status(401).json({ success: false, message: "Email/Pass Salah" });
        }
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// --- GAMES DATA ---
// Ambil semua game (untuk dashboard)
app.get('/api/games', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM game');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// FIX: Ambil detail SATU game (untuk banner di checkout)
app.get('/api/games/:id', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM game WHERE id_game = ?', [req.params.id]);
        if (rows.length > 0) res.json(rows[0]);
        else res.status(404).json({ error: "Game tidak ada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- PRODUCTS DATA ---
// FIX: Ambil list produk berdasarkan ID Game (biar diamond muncul semua)
app.get('/api/products-by-game/:id_game', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM produk_topup WHERE id_game = ?', [req.params.id_game]);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ambil detail satu produk (Penting buat nampilin HARGA di checkout)
app.get('/api/product-detail/:id_produk', async (req, res) => {
    try {
        // Pastikan nama kolom 'id_produk' sesuai schema
        const [rows] = await db.query('SELECT * FROM produk_topup WHERE id_produk = ?', [req.params.id_produk]);
        if (rows.length > 0) {
            res.json(rows[0]);
        } else {
            res.status(404).json({ error: "Produk tidak ditemukan di database" });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GANTI BAGIAN INI DI SERVER.JS LO
app.post('/api/transaksi', async (req, res) => {
    try {
        const { id_produk, id_metode, user_game_id, total_harga, status } = req.body;
        
        // Cek log di terminal node lo nanti buat mastiin data masuk
        console.log("Data diterima:", req.body);

        const query = "INSERT INTO transaksi (id_produk, id_metode, user_game_id, total_harga, status) VALUES (?, ?, ?, ?, ?)";
        
        // Pakai await karena db lo itu .promise()
        await db.query(query, [id_produk, id_metode, user_game_id, total_harga, status]);
        
        res.status(200).json({ success: true, message: "Transaksi Berhasil Disimpan" });
    } catch (err) {
        console.error("Gagal Simpan Database:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
});

// --- API METODE PEMBAYARAN (DANA, GOPAY, QRIS) ---
app.get('/api/metode-pembayaran', async (req, res) => {
    try {
        // SELECT * biar kolom barcode ikut narik
        const [rows] = await db.query('SELECT * FROM metode_pembayaran');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.listen(5000, () => console.log('Server ON di port 5000'));