const { Pool } = require('pg');

// Ambil URL Koneksi dari Supabase (Settings > Database > Connection String > Node.js)
// Ganti baris 5 di server.js lo jadi kayak gini:
const pool = new Pool({
  connectionString: "postgresql://postgres:renaldicahya@db.bbjyifnzvzzxospplpa.supabase.co:5432/postgres",
  ssl: { rejectUnauthorized: false } 
});
async function testKoneksi() {
    try {
        await pool.connect();
        console.log('SUPABASE CONNECTED! Database online bro.');
    } catch (err) {
        console.log('DATABASE GAGAL: Cek Connection String kamu.');
        console.error(err.message);
    }
}
testKoneksi();

// Ganti setiap query 'db.query' menjadi 'pool.query'
// Dan ganti '?' menjadi '$1', '$2', dst (ciri khas PostgreSQL)
app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        // Postgres pakai $1, $2 bukan ?
        await pool.query('INSERT INTO "user" (email, password) VALUES ($1, $2)', [email, password]);
        res.json({ success: true, message: "Daftar berhasil!" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});