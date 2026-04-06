# Mula Inventory System - Panduan Setup

## 📦 Apa Ini?

Sistem inventory berbasis Google Sheets + Google Apps Script yang membantu UMKM Indonesia track stok produk dengan mudah.

---

## 🎯 Fitur Utama

- **Tambah Produk** — Via form interaktif di Web App
- **Dashboard Monitoring** — Tabel produk dengan status stok real-time
- **Alert Stok Rendah** — Warna kuning jika stok < minimum
- **Alert Stok Kosong** — Warna merah jika stok = 0
- **Log Transaksi** — Catat restock dan penjualan
- **QR Code Generation** — Generate QR codes untuk produk (v1.1.0)
- **Barcode Scanning** — Scan barcodes via kamera device (v1.1.0)
- **100% GRATIS** — Tidak ada biaya bulanan

---

## 🚀 Cara Setup

### Langkah 1: Copy Google Sheet Template (5 Menit)

1. Buka [Google Sheet Template](https://docs.google.com/spreadsheets/d/1Mp6hC7WCAa9ZY-hghG0FD9D_6_iCZjXx7laogKrNfVY/edit?usp=sharing)
2. Klik **File > Make a Copy**
3. Rename sheet: "Inventory System - [Nama UMKM]" (contoh: "Inventory System - Warung Kopi")
4. Simpan di Google Drive Anda

---

### Langkah 2: Setup Google Apps Script (10 Menit)

1. Buka Google Sheet yang baru di-copy
2. Klik **Extensions > Apps Script**
3. Buat file baru: **Code.gs**
4. Copy kode dari file `scripts/Code.gs` (lihat folder `scripts/`)
5. Paste ke file `Code.gs`
6. Simpan (Ctrl+S)

---

### Langkah 3: Deploy sebagai Web App (5 Menit)

1. Klik **Deploy > New Deployment**
2. Konfigurasi:
   - **Select type:** Web app
   - **Description:** "Mula Inventory System - [Nama UMKM]"
   - **Execute as:** Me (email Anda)
   - **Who has access:** Anyone (atau "Anyone with Google Account" untuk lebih aman)
3. Klik **Deploy**
4. **Authorization Required** (jika muncul):
   - Klik "Review Permissions"
   - Pilih akun Google Anda
   - Klik "Allow"
5. **Web App URL** akan muncul — Copy URL ini

---

### Langkah 4: Akses Web App

1. Paste URL Web App di browser (Chrome, Firefox, Edge, dll)
2. Web App UI akan muncul (Form Tambah Produk & Dashboard)
3. Siap digunakan!

---

## ✅ Setup Selesai!

Sistem inventory sudah aktif di akun Google Anda.

---

## 📞 Bantuan

Jika mengalami masalah:
- Cek bagian Troubleshooting di file `docs/TROUBLESHOOTING.md`
- Hubungi Mula Labs Support: support@mulalabs.id

---

## 🎓 Panduan Lanjut

- **Panduan Penggunaan:** Lihat file `docs/USER_MANUAL.md`
- **Kode Backend:** Lihat file `docs/CODE_GS.md`
- **Package untuk Client:** Lihat file `docs/CLIENT_PACKAGE.md`
- **Solusi Masalah:** Lihat file `docs/TROUBLESHOOTING.md`
- **QR Code & Barcode Scanning:** Lihat file `docs/QR_BARCODE.md` (v1.1.0)

---

**Selamat menggunakan Mula Inventory System!** 🚀
