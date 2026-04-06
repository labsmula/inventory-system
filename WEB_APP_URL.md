# Web App URL

## 📦 Deployment URL

**Web App URL:** https://script.google.com/macros/s/AKfycbwCMBkdhSsMrMQpY7tZzT1V5dZbKLLmlurVtjUjYlpxEzUju_ozhdSx6V-xmIXz6M_Aew/exec

---

## 🚀 Cara Menggunakan URL

### **Langkah 1: Buka URL**
1. Copy URL di atas
2. Paste di browser (Chrome, Firefox, Edge, dll)
3. Tekan Enter

### **Langkah 2: Web App Muncul**
- UI Web App akan muncul
- Terdapat 2 tabs: "Tambah Produk" & "Dashboard"

### **Langkah 3: Mulai Gunakan**
- **Tambah Produk:** Isi form input produk baru
- **Dashboard:** Monitoring stok produk real-time

---

## 📊 Fitur di Web App

### **Tab "Tambah Produk"**
- Form input lengkap (SKU, nama, kategori, harga, stok)
- Validasi input (semua field harus diisi)
- Notifikasi sukses/gagal

### **Tab "Dashboard"**
- Tampilan tabel semua produk
- Kolom: SKU, Nama Produk, Kategori, Stok, Status, Aksi
- Status: OK (hijau), LOW STOCK (kuning), OUT OF STOCK (merah)
- Cari produk berdasarkan nama atau SKU

---

## ⚠️ Catatan Penting

### **1. URL ini spesifik untuk Akun Google Anda**
- Web App ini ter-deploy di akun Google Anda
- Jika Anda share URL ke tim, mereka akan bisa mengakses (sesuai setting "Who has access")

### **2. Jangan Ubah Kecuali Re-deploy**
- Jangan ubah bagian URL ini kecuali Anda re-deploy Web App
- Jika re-deploy, URL akan berubah dan perlu update di file ini

### **3. Akses "Anyone" vs "Anyone with Google Account"**
- Saat deploy, jika "Who has access" = **Anyone**, orang lain bisa akses tanpa login Google
- Jika "Anyone with Google Account", orang lain perlu login Google dulu

---

## 🔧 Jika Web App Tidak Muncul

### **Problem 1: "Script function not found"**
- Cek kode di Apps Script Editor
- Pastikan nama function benar: `doGet()`, `addProduct()`, `getData()`, `updateStock()`
- Re-deploy jika ada perubahan

### **Problem 2: "You do not have permission"**
- Cek apakah Google Sheet sudah di-share ke Apps Script
- Di Apps Script Editor: File > Project properties > Bound script
- Pastikan sheet terhubung

### **Problem 3: Blank Screen / UI Tidak Muncul**
- Refresh browser (F5)
- Buka di Incognito/Private window (bypass cache)
- Cek browser console (F12) untuk error JavaScript

---

## 🔄 Cara Re-deploy (Jika Perlu)

1. Buka [Google Sheet](https://docs.google.com/spreadsheets/d/1Mp6hC7WCAa9ZY-hghG0FD9D_6_iCZjXx7laogKrNfVY/edit?usp=sharing)
2. Klik **Extensions > Apps Script**
3. Klik **Deploy > New Deployment**
4. Konfigurasi:
   - Select type: Web app
   - Description: "Mula Inventory System v1.1 (Re-deploy)"
   - Execute as: Me
   - Who has access: Anyone (atau Anyone with Google Account)
5. Klik **Deploy**
6. URL baru akan muncul
7. Update file ini dengan URL baru

---

## 📝 Update URL di File Ini

Jika Anda re-deploy dan URL berubah:
1. Hapus URL lama di bagian "Web App URL"
2. Paste URL baru
3. Simpan file

---

**Happy using Mula Inventory System!** 🚀
