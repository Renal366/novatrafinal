const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());

// KONEKSI DATABASE SUPABASE
const pool = new Pool({
  postgresql://postgres:renaldicahya@db.ipuqtuobbyqfenfjaiik.supabase.co:5432/postgres
  ssl: { rejectUnauthorized: false }
});

// TEST KONEKSI
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to Supabase database');
    release();
  }
});

// REGISTER ENDPOINT
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, no_telepon } = req.body;
        
        // Validasi input
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email dan password wajib diisi!" 
            });
        }

        // 1. Cek apakah email sudah terdaftar
        const checkResult = await pool.query(
            'SELECT * FROM users WHERE email = $1', 
            [email]
        );
        
        if (checkResult.rows.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: "Email sudah terdaftar!" 
            });
        }

        // 2. Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 3. Insert ke database
        // GUNAKAN TABEL users BUKAN "user"
        const result = await pool.query(
            'INSERT INTO users (email, password, no_telepon) VALUES ($1, $2, $3) RETURNING id_user, email, no_telepon',
            [email, hashedPassword, no_telepon || null]
        );

        // 4. Response tanpa password
        const newUser = result.rows[0];
        res.json({ 
            success: true, 
            message: "DAFTAR BERHASIL!",
            user: newUser
        });

    } catch (err) {
        console.error('Register error:', err);
        res.status(500).json({ 
            success: false, 
            message: "Terjadi kesalahan server",
            error: err.message 
        });
    }
});

// LOGIN ENDPOINT
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: "Email dan password wajib diisi!" 
            });
        }

        // 1. Cari user berdasarkan email
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1', 
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.json({ 
                success: false, 
                message: "Email tidak ditemukan!" 
            });
        }

        const user = result.rows[0];
        
        // 2. Bandingkan password (dengan bcrypt)
        const passwordMatch = await bcrypt.compare(password, user.password);
        
        if (!passwordMatch) {
            return res.json({ 
                success: false, 
                message: "Password salah!" 
            });
        }

        // 3. Hapus password dari response
        delete user.password;
        
        res.json({ 
            success: true, 
            message: "LOGIN BERHASIL!",
            user: {
                id_user: user.id_user,
                email: user.email,
                no_telepon: user.no_telepon
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ 
            success: false, 
            message: "Terjadi kesalahan server",
            error: err.message 
        });
    }
});

// ENDPOUNT TEST
app.get('/api/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW() as waktu');
        res.json({ 
            success: true, 
            message: "Server berjalan!",
            waktu: result.rows[0].waktu 
        });
    } catch (err) {
        res.status(500).json({ 
            success: false, 
            error: err.message 
        });
    }
});

module.exports = app;
