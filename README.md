💎 NOVATRASHOP - Sistem Top-Up Game
Sistem Top-Up Game sederhana menggunakan Node.js (Express) untuk backend dan MySQL untuk database. Fitur utama meliputi integrasi produk dinamis, metode pembayaran QRIS/E-Wallet, dan pencatatan transaksi otomatis.

🚀 Fitur Utama
Database Driven: Semua game, produk, dan metode pembayaran ditarik langsung dari MySQL.

Automated Checkout: Menghitung harga dan menampilkan barcode pembayaran secara dinamis.

Transaction Logs: Menyimpan riwayat pembelian ke tabel transaksi.

Success Feedback: Halaman sukses dengan animasi loading dan ringkasan data real-time.

🛠️ Persiapan Lingkungan
1. Database (MySQL)
Buka phpMyAdmin dan buat database baru bernama topup_game.

Import atau jalankan query berikut untuk membuat tabel transaksi:

SQL

CREATE TABLE transaksi (
    id_transaksi INT AUTO_INCREMENT PRIMARY KEY,
    id_produk INT,
    id_metode INT,
    user_game_id VARCHAR(100),
    total_harga INT,
    status VARCHAR(50) DEFAULT 'Pending',
    tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Pastikan tabel game, produk_topup, user, dan metode_pembayaran sudah terisi data.

2. Backend (Node.js)
Pastikan lo udah install Node.js.

Buka terminal di folder project, lalu install library yang dibutuhin:

Bash

npm install express mysql2 cors
Jalanin servernya:

Bash

node server.js
Server akan jalan di: http://127.0.0.1:5000.

💻 Cara Menjalankan Project
Buka file index.html (Frontend) di browser lo.

Pilih game yang mau di-topup.

Masukkan User ID, pilih Nominal, dan pilih Metode Pembayaran.

Klik Beli Sekarang untuk masuk ke halaman detail pembayaran.

Klik BAYAR pada halaman checkout-final.html.

Data akan dikirim ke API /api/transaksi dan disimpan ke MySQL.

Lo bakal di-redirect ke success.html dengan tampilan data yang lengkap.

📁 Struktur Folder
Plaintext

├── frontend/
│   ├── index.html           # Dashboard Utama
│   ├── checkout.html        # Form Input ID & Pilih Item
│   ├── checkout-final.html  # Halaman Scan QRIS & Bayar
│   ├── success.html         # Bukti Bayar & Loading
│   └── img/                 # Folder Gambar & Barcode
└── backend/
    └── server.js            # API Server (Node.js + Express)
⚠️ Catatan Penting
Koneksi Database: Cek server.js bagian db = mysql.createPool. Sesuaikan user, password, dan database dengan settingan XAMPP/MySQL lo.

CORS: Server sudah dilengkapi Middleware CORS agar frontend bisa akses API tanpa kena blokir.
