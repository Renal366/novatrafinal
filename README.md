# 💎 NOVATRASHOP - Sistem Top-Up Game

Sistem **Top-Up Game** sederhana berbasis **Node.js (Express)** sebagai backend dan **MySQL** sebagai database. Project ini dirancang untuk simulasi alur top-up game modern dengan produk dinamis, metode pembayaran digital, dan pencatatan transaksi otomatis.

---

## 🚀 Fitur Utama

* **Database Driven**
  Semua data game, produk top-up, user, dan metode pembayaran diambil langsung dari database MySQL.

* **Automated Checkout**
  Sistem otomatis menghitung total harga dan menampilkan detail pembayaran (QRIS / E-Wallet).

* **Transaction Logs**
  Setiap pembelian disimpan ke tabel `transaksi` secara real-time.

* **Success Feedback**
  Halaman sukses dengan animasi loading serta ringkasan transaksi secara langsung.

---

## 🛠️ Persiapan Lingkungan

### 1️⃣ Database (MySQL)

1. Buka **phpMyAdmin**
2. Buat database baru dengan nama:

   ```sql
   topup_game
   ```
3. Jalankan query berikut untuk membuat tabel transaksi:

```sql
CREATE TABLE transaksi (
    id_transaksi INT AUTO_INCREMENT PRIMARY KEY,
    id_produk INT,
    id_metode INT,
    user_game_id VARCHAR(100),
    total_harga INT,
    status VARCHAR(50) DEFAULT 'Pending',
    tanggal TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

> ⚠️ Pastikan tabel **game**, **produk_topup**, **user**, dan **metode_pembayaran** sudah tersedia dan berisi data.

---

### 2️⃣ Backend (Node.js)

1. Pastikan **Node.js** sudah terinstall
2. Masuk ke folder backend melalui terminal
3. Install dependency yang dibutuhkan:

```bash
npm install express mysql2 cors
```

4. Jalankan server:

```bash
node server.js
```

5. Server akan berjalan di:

```
http://127.0.0.1:5000
```

---

## 💻 Cara Menjalankan Project

1. Buka file `index.html` di folder **frontend** menggunakan browser
2. Pilih game yang ingin di-topup
3. Masukkan **User ID Game**
4. Pilih nominal top-up
5. Pilih metode pembayaran (QRIS / E-Wallet)
6. Klik **Beli Sekarang** → masuk ke halaman `checkout-final.html`
7. Klik tombol **BAYAR**
8. Data transaksi akan dikirim ke endpoint:

```
POST /api/transaksi
```

9. Data otomatis tersimpan di MySQL
10. User akan diarahkan ke `success.html` dengan ringkasan transaksi lengkap

---

## 📁 Struktur Folder

```
├── frontend/
│   ├── index.html           # Dashboard Utama
│   ├── checkout.html        # Input User ID & Pilih Item
│   ├── checkout-final.html  # Scan QRIS & Proses Bayar
│   ├── success.html         # Bukti Pembayaran
│   └── img/                 # Gambar & Barcode Pembayaran
│
└── backend/
    └── server.js            # API Server (Node.js + Express)
```

---

## ⚠️ Catatan Penting

* **Koneksi Database**
  Sesuaikan konfigurasi berikut di file `server.js`:

  ```js
  mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'topup_game'
  })
  ```

* **CORS**
  Backend sudah menggunakan middleware **CORS** agar frontend dapat mengakses API tanpa error.

---

## ✅ Status Project

✔ Backend API Aktif
✔ Database Terhubung
✔ Transaksi Tersimpan Otomatis
✔ Frontend Siap Digunakan

---

🔥 **NOVATRASHOP** — Simulasi Sistem Top-Up Game Modern
