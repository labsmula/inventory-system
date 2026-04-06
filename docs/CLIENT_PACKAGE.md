# Mula Inventory System - Client Package

## 📦 Package untuk UMKM Clients

**Version:** 1.0.0
**Date:** 2026-04-06
**For:** UMKM Indonesia yang ingin menggunak Mula Inventory System

---

## 🎯 Apa yang Ada di Package Ini?

### 1. **Google Sheet Template**
- Link template (siap di-copy)
- Struktur 4 sheets: Master Produk, Stok Current, Transaksi Masuk, Transaksi Keluar
- Formulas & conditional formatting sudah siap

### 2. **Google Apps Script Code**
- Kode backend lengkap (`Code.gs`)
- 5 functions: doGet, addProduct, getData, updateStock, sendEmailNotification
- Siap di-copy-paste ke Apps Script Editor

### 3. **Web App UI**
- HTML UI interaktif (`Index.html`)
- Form input produk + Dashboard monitoring
- Responsive design (mobile-friendly)

### 4. **Documentation**
- Setup guide (README.md)
- User manual (USER_MANUAL.md)
- Code reference (CODE_GS.md)
- Troubleshooting (TROUBLESHOOTING.md)

---

## 🚀 Cara Setup untuk Clients

### **Langkah 1: Copy Google Sheet Template (5 Menit)**

1. Buka link Google Sheet template:
   - Link: [Lihat file `GOOGLE_SHEET_TEMPLATE.md`](../GOOGLE_SHEET_TEMPLATE.md)

2. Klik **File > Make a Copy**
3. Rename sheet: "Inventory System - [Nama UMKM]"
   - Contoh: "Inventory System - Warung Kopi"

4. Simpan di Google Drive client

---

### **Langkah 2: Setup Google Apps Script (10 Menit)**

1. Buka Google Sheet yang baru di-copy
2. Klik **Extensions > Apps Script**
3. Buat file baru: **Code.gs**
4. Copy kode dari file `docs/CODE_GS.md`
5. Paste ke file `Code.gs`
6. Simpan (Ctrl+S)

---

### **Langkah 3: Deploy sebagai Web App (5 Menit)**

1. Klik **Deploy > New Deployment**
2. Konfigurasi:
   - **Select type:** Web app
   - **Description:** Mula Inventory System - [Nama UMKM]
   - **Execute as:** Me (email client)
   - **Who has access:** Anyone

3. Klik **Deploy**

4. **Authorization Required** (jika muncul):
   - Klik "Review Permissions"
   - Pilih akun Google client
   - Klik "Allow"

5. **Copy Web App URL** yang muncul

---

### **Langkah 4: Test Sistem (5 Menit)**

1. Buka Web App URL (dari Langkah 3)
2. Cek UI:
   - Tab "Tambah Produk" muncul?
   - Tab "Dashboard" muncul?

3. Test tambah produk:
   - Isi form: SKU (TEST001), Nama (Test Product), Kategori (F&B), Satuan (kg), Harga Beli (10000), Harga Jual (15000), Min Stok (5)
   - Klik "+ Tambah Produk"
   - Cek notif sukses?

4. Cek Google Sheets:
   - Sheet "Master Produk" → Data TEST001 masuk?
   - Sheet "Stok Current" → Stok 0 diinisialisasi?

---

### **Langkah 5: Akses Web App untuk Sehari-Hari**

1. Simpan Web App URL di browser bookmark
2. Buka URL kapan saja perlu:
   - Tambah produk
   - Cek dashboard
   - Cari produk

---

## ✅ Checklist Setup untuk Clients

### **Sebelum Setup:**
- [ ] Punya akun Google (Gmail)
- [ ] Punya koneksi internet (untuk initial setup)
- [ ] Siap nama UMKM (untuk nama Google Sheet)

### **Selama Setup:**
- [ ] Copy Google Sheet template berhasil
- [ ] Rename Google Sheet sesuai nama UMKM
- [ ] Apps Script Editor terbuka
- [ ] Kode `Code.gs` berhasil di-copy-paste
- [ ] Kode `Code.gs` berhasil disimpan (Ctrl+S)
- [ ] Web App berhasil di-deploy
- [ ] Web App URL berhasil di-copy

### **Setelah Setup:**
- [ ] Web App bisa diakses via browser
- [ ] Bisa tambah produk pertama (TEST001)
- [ ] Data tersimpan di Google Sheets (Master Produk & Stok Current)
- [ ] Dashboard widgets muncul (Total, Low Stock, Out of Stock, Value)
- [ ] Cari produk berfungsi

---

## 📞 Support Mula Labs

### **Contact:**
- **Email:** support@mulalabs.id
- **WhatsApp:** +62 812 3456 7890
- **Website:** www.mulalabs.id

### **Jam Operasional:**
- Senin - Jumat: 09:00 - 18:00 WIB
- Sabtu - Minggu: Tutup

---

## 📞 Apa yang Bisa Dibantu?

### **Teknis:**
- Error saat deploy Web App
- Error saat tambah produk
- Data tidak tersimpan ke Google Sheets
- Email notification tidak jalan

### **Penggunaan:**
- Cara menghapus produk
- Cara mengubah data produk
- Cara export data ke Excel/CSV/PDF
- Cara share Google Sheet ke tim

### **Strategis:**
- Cara menentukan SKU yang baik
- Cara menentukan minimum stok
- Cara menghitung margin yang optimal
- Cara mengoptimasi restock schedule

---

## 📝 Catatan untuk UMKM

### **Penting:**
1. **Hindari duplikat SKU** — Setiap SKU harus unik
2. **Pastikan harga jual > harga beli** — Margin harus positif
3. **Minimum stok harus realistis** — Sesuaikan dengan periode restock
4. **Backup data secara regular** — Download Google Sheets sebagai .zip

### **Tips:**
- Gunakan format SKU yang konsisten (P untuk F&B, R untuk Retail, J untuk Jasa)
- Jangan gunakan karakter spesial di SKU (hanya alphanumeric)
- Review dashboard setiap minggu untuk monitoring

---

## 🎉 Selamat Menggunakan Mula Inventory System!

Sistem ini dikembangkan oleh **Mula Labs** untuk membantu UMKM Indonesia go digital dengan solusi yang mudah, gratis, dan terjangkau.

---

**Need Help?**
Jangan ragu untuk hubungi support Mula Labs via WhatsApp atau Email! 👍

---

**Package Version:** 1.0.0
**Last Updated:** 2026-04-06
