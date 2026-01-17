const { Pool } = require('pg');

// Ambil link dari Environment Variables Vercel
const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString: connectionString,
  ssl: { 
    rejectUnauthorized: false // Wajib buat koneksi ke Supabase dari luar
  }
});

module.exports = pool;
