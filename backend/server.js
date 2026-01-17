const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const app = express();

app.use(cors());
app.use(express.json());

// ========== KONEKSI DATABASE SUPABASE ==========
// GANTI [PROJECT_ID] dengan ID asli dari Supabase
const pool = new Pool({
  connectionString: "postgresql://postgres:renaldicahya@db.ipuqtuobbyqfenfjaiik.supabase.co:5432/postgres
  ssl: { rejectUnauthorized: false }
});
// ===============================================

// Test koneksi database
pool.on('connect', () => {
  console.log('✅ Connected to Supabase database');
});

pool.on('error', (err) => {
  console.error('❌ Database connection error:', err);
});

// ========== ENDPOINT TEST ==========
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() as waktu, version() as version');
    res.json({
      success: true,
      message: "Database connected!",
      data: result.rows[0]
    });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ========== REGISTER ==========
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, no_telepon } = req.body;
    
    console.log('Register attempt:', { email, no_telepon });
    
    // Validasi
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi!"
      });
    }
    
    // 1. Cek email sudah ada
    const checkQuery = await pool.query(
      'SELECT email FROM users WHERE email = $1',
      [email]
    );
    
    if (checkQuery.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email sudah terdaftar!"
      });
    }
    
    // 2. Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // 3. Insert ke database
    const insertQuery = await pool.query(
      `INSERT INTO users (email, password, no_telepon) 
       VALUES ($1, $2, $3) 
       RETURNING id_user, email, no_telepon`,
      [email, hashedPassword, no_telepon || null]
    );
    
    const newUser = insertQuery.rows[0];
    
    console.log('User registered:', newUser.id_user);
    
    res.json({
      success: true,
      message: "Pendaftaran berhasil!",
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

// ========== LOGIN ==========
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt:', { email });
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email dan password wajib diisi!"
      });
    }
    
    // 1. Cari user
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
    
    // 2. Verifikasi password
    const passwordValid = await bcrypt.compare(password, user.password);
    
    if (!passwordValid) {
      return res.json({
        success: false,
        message: "Password salah!"
      });
    }
    
    // 3. Hapus password dari response
    delete user.password;
    
    res.json({
      success: true,
      message: "Login berhasil!",
      user: user
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

// ========== PORT ==========
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
