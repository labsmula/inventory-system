# Panduan Penggunaan Web App & Google Sheets

## 📱 Cara Menggunakan Web App

### 1. Buka Web App
- Paste URL Web App (lihat file `WEB_APP_URL.md`) di browser (Chrome, Firefox, Edge, dll)
- Web App UI akan muncul

### 2. Navigasi (Tabs)
- **Tab "Tambah Produk":** Form input untuk menambah produk baru
- **Tab "Dashboard":** Tampilan tabel semua produk dengan status stok

### 3. Menambah Produk Baru

#### Langkah:
1. Klik tab "Tambah Produk"
2. Isi semua field:
   - **SKU:** Kode unik produk (contoh: P001, R001, J001)
   - **Nama Produk:** Nama produk (contoh: Kopi Arabica 500g)
   - **Kategori:** Pilih: F&B, Retail, atau Jasa
   - **Satuan:** Pilih: kg, liter, pcs, atau botol
   - **Harga Beli:** Harga beli per satuan (contoh: 80000)
   - **Harga Jual:** Harga jual per satuan (contoh: 120000)
   - **Minimum Stok:** Jumlah minimum stok sebelum perlu restock (contoh: 10)

3. Klik tombol **"+ Tambah Produk"**

4. Notifikasi sukses akan muncul:
   - ✅ "Produk [Nama Produk] berhasil ditambah!"

---

### 4. Monitor Dashboard

#### Langkah:
1. Klik tab "Dashboard"
2. Tabel produk akan muncul dengan kolom:
   - **SKU:** Kode produk
   - **Nama Produk:** Nama produk
   - **Kategori:** Kategori produk
   - **Stok:** Jumlah stok saat ini
   - **Status:** Status stok (OK, LOW STOCK, OUT OF STOCK)
   - **Aksi:** Tombol "Edit" untuk ubah produk

3. **Dashboard Widgets (Di bagian atas):**
   - **Total Produk:** Jumlah total produk di database
   - **Low Stock:** Jumlah produk dengan stok rendah (<= minimum)
   - **Out of Stock:** Jumlah produk dengan stok kosong (= 0)
   - **Inventory Value:** Total nilai inventory (stok * harga beli) dalam Rupiah

4. **Warna Status:**
   - **Hijau (OK):** Stok > minimum stok
   - **Kuning (LOW STOCK):** Stok <= minimum stok, tapi masih ada
   - **Merah (OUT OF STOCK):** Stok = 0

---

### 5. Cari Produk

#### Langkah:
1. Di tab "Dashboard", gunakan kotak "Cari Produk"
2. Ketik nama atau SKU produk
3. Tabel produk akan otomatis filter
4. Hanya produk yang mengandung kata kunci akan muncul

---

## 📊 Cara Menggunakan Google Sheets

### 1. Cek Master Produk (Database Produk)

#### Langkah:
1. Buka Google Sheet (di Google Drive Anda)
2. Pilih sheet **"Master Produk"**
3. Semua produk yang ditambah via Web App akan muncul di sini
4. **Kolom yang tersedia:**
   - **SKU:** Kode produk
   - **Nama Produk:** Nama produk
   - **Kategori:** Kategori (F&B, Retail, Jasa)
   - **Satuan:** Satuan (kg, liter, pcs, botol)
   - **Harga Beli:** Harga beli per satuan
   - **Harga Jual:** Harga jual per satuan
   - **Margin %:** Margin persentase (auto-calc)
   - **Minimum Stok:** Stok minimum sebelum perlu restock

---

### 2. Cek Stok Current (Tracking Stok Real-Time)

#### Langkah:
1. Buka Google Sheet
2. Pilih sheet **"Stok Current"**
3. Setiap produk akan punya baris tracking stok:
   - **SKU:** Kode produk
   - **Nama Produk:** Nama produk
   - **Stok Awal:** Stok awal produk
   - **Masuk:** Jumlah restock (masuk)
   - **Keluar:** Jumlah terjual (keluar)
   - **Stok Akhir:** Stok terkini (auto-calc)
   - **Status:** Status stok (OK, LOW STOCK, OUT OF STOCK)
   - **Last Updated:** Tanggal update terakhir

---

### 3. Log Transaksi Masuk (Restock)

#### Langkah:
1. Buka Google Sheet
2. Pilih sheet **"Transaksi Masuk"**
3. Catat saat ada restock:
   - **Tanggal:** Tanggal restock
   - **SKU:** SKU produk yang di-restock
   - **Nama Produk:** Nama produk
   - **Jumlah:** Jumlah restock (contoh: 10 kg)
   - **Supplier:** Nama supplier

4. Stok di sheet "Stok Current" akan otomatis update (jika pakai fitur `updateStock()`)

---

### 4. Log Transaksi Keluar (Terjual)

#### Langkah:
1. Buka Google Sheet
2. Pilih sheet **"Transaksi Keluar"**
3. Catat saat ada penjualan:
   - **Tanggal:** Tanggal penjualan
   - **SKU:** SKU produk yang terjual
   - **Nama Produk:** Nama produk
   - **Jumlah:** Jumlah terjual (contoh: 5 pcs)
   - **Customer/Pelanggan:** Nama customer

4. Stok di sheet "Stok Current" akan otomatis update (jika pakai fitur `updateStock()`)

---

## 💡 Tips Best Practices

### 1. Menentukan SKU (Kode Produk)
- Gunakan format konsisten:
  - **P** untuk produk F&B (contoh: P001, P002)
  - **R** untuk produk Retail (contoh: R001, R002)
  - **J** untuk produk Jasa (contoh: J001, J002)
- SKU harus unik (tidak boleh duplikat)

### 2. Menentukan Minimum Stok
- Sesuaikan dengan periode restock:
  - Jika restock mingguan: set min stok = 7 hari penjualan rata-rata
  - Jika restock bulanan: set min stok = 30 hari penjualan rata-rata
- Hitung berapa produk terjual per hari, lalu kalikan dengan hari aman

### 3. Harga (Beli vs Jual)
- Harga jual harus > harga beli (margin positif)
- Margin ideal: 20-50% (untuk F&B/Retail)
- Hindari margin terlalu rendah (<10%) atau terlalu tinggi (>100%)

---

## ❓ FAQ (Pertanyaan Umum)

### Q: Apakah sistem ini gratis?
**A:** Ya, 100% gratis. Menggunakan Google Sheets (free) dan Google Apps Script (free). Tidak ada biaya bulanan.

### Q: Apakah bisa offline?
**A:** Secara penuh tidak. Perlu koneksi internet untuk mengakses Google Sheets dan Web App. Tapi Google Sheets bisa diakses offline jika sudah di-load sebelumnya (Google Sheets mobile app).

### Q: Apakah data saya aman?
**A:** Ya, data tersimpan di Google Sheets milik Anda. Mula Labs tidak memiliki akses ke data UMKM Anda.

### Q: Berapa jumlah produk maksimal?
**A:** Google Sheets support hingga 10 juta cell per sheet. Untuk penggunaan normal (ratusan produk), tidak ada masalah.

### Q: Apakah bisa multi-user?
**A:** Ya, Google Sheets dan Web App bisa di-share ke tim. Web App bisa diakses oleh "Anyone with Google account".

### Q: Apakah bisa di-export?
**A:** Ya, Google Sheets bisa di-export ke Excel, CSV, PDF. Data bisa di-backup kapan saja.

### Q: Apakah bisa menghapus produk?
**A:** Ya, bisa menghapus produk langsung di Google Sheet (sheet "Master Produk"). Cari baris produk, klik kan > Delete row.

---

## 🆘 Contact & Support

### Mula Labs
- **Email:** support@mulalabs.id
- **WhatsApp:** +62 812 3456 7890
- **Website:** www.mulalabs.id

### Reporting Issues
Jika mengalami masalah atau punya saran:
1. Screenshot error
2. Jelaskan langkah sebelum error
3. Kirim ke email support Mula Labs
4. Tim akan merespon dalam 1x24 jam

---

## 📝 Notes Terakhir

- Selalu backup data Google Sheets secara regular (Download > Compress .zip)
- Jika mengganti nama sheet di Google Sheets, pastikan update nama di function `addProduct()` (bagian `getSheetByName()`)
- Jika ingin mengubah email notifikasi, ubah email di function `sendEmailNotification()` (file `scripts/Code.gs`)

---

**Selamat menggunakan Mula Inventory System!** 🚀
