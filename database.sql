-- Gunakan Schema
CREATE DATABASE IF NOT EXISTS topup_game;
USE topup_game;

-- 1. Tabel USER (Sesuai ERD: email, no_telepon, password)
CREATE TABLE user (
    id_user INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) NOT NULL UNIQUE,
    no_telepon VARCHAR(20),
    password VARCHAR(100) NOT NULL
);

-- 2. Tabel GAME (Sesuai ERD + Kolom Gambar untuk UI)
CREATE TABLE game (
    id_game INT PRIMARY KEY AUTO_INCREMENT,
    nama_game VARCHAR(100) NOT NULL,
    developer VARCHAR(100),
    genre VARCHAR(50),
    gambar VARCHAR(100), -- Wajib ada untuk dashboard
    banner VARCHAR(100)  -- Wajib ada untuk checkout
);

-- 3. Tabel PRODUK_TOPUP (Sesuai ERD: nama_paket, harga, jumlah_item)
CREATE TABLE produk_topup (
    id_produk INT PRIMARY KEY AUTO_INCREMENT,
    id_game INT,
    nama_paket VARCHAR(100) NOT NULL,
    harga DECIMAL(12,2) NOT NULL,
    jumlah_item INT,
    FOREIGN KEY (id_game) REFERENCES game(id_game)
);

-- 4. Tabel METODE_PEMBAYARAN (Sesuai ERD + Kolom Logo untuk UI)
CREATE TABLE metode_pembayaran (
    id_metode INT PRIMARY KEY AUTO_INCREMENT,
    nama_metode VARCHAR(50) NOT NULL,
    jenis VARCHAR(50),
    gambar_logo VARCHAR(100) -- Agar logo DANA/GOPAY muncul
);

-- 5. Tabel TRANSAKSI (Sesuai ERD: Menghubungkan semua entitas)
CREATE TABLE transaksi (
    id_transaksi INT PRIMARY KEY AUTO_INCREMENT,
    id_user INT,
    id_produk INT,
    id_metode INT,
    user_game_id VARCHAR(100), -- ID Game tujuan topup
    total_harga DECIMAL(12,2),
    status VARCHAR(50) DEFAULT 'Pending',
    tanggal_transaksi DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES user(id_user),
    FOREIGN KEY (id_produk) REFERENCES produk_topup(id_produk),
    FOREIGN KEY (id_metode) REFERENCES metode_pembayaran(id_metode)
);

-- 6. Tabel EVENT_GAME (Sesuai ERD)
CREATE TABLE event_game (
    id_event INT PRIMARY KEY AUTO_INCREMENT,
    id_game INT,
    nama_event VARCHAR(100),
    deskripsi TEXT,
    tanggal_mulai DATE,
    tanggal_selesai DATE,
    bonus VARCHAR(100),
    status_event VARCHAR(50),
    FOREIGN KEY (id_game) REFERENCES game(id_game)
);