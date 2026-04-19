# 📦 Mula Inventory System v1.3.0 — Quick Start Guide

> Sistem pencatatan stok otomatis pake Google Sheets + Google Apps Script. Gratis, tanpa install, tanpa coding.

---

## ⚡ 3 Langkah Setup

### Langkah 1: Copy Template Google Sheet
1. Buka link: https://docs.google.com/spreadsheets/d/1Mp6hC7WCAa9ZY-hghG0FD9D_6_iCZjXx7laogKrNfVY/copy
2. Klik **Make a Copy**
3. Rename sesuai usahamu (contoh: "Inventori — Warung Kopi")

### Langkah 2: Pasang Script
1. Di sheet yang sudah di-copy, klik **Extensions > Apps Script**
2. **Hapus semua** kode yang ada di editor
3. **Copy-paste** kode dari `Code.gs` (file ini)
4. Klik **File > Save** (atau Ctrl+S)
5. Tutup tab Apps Script

### Langkah 3: Jalankan Setup
1. Klik **Extensions > Macros > Import**
2. Pilih fungsi `setupInventory` → **Add**
3. Klik **Extensions > Macros > setupInventory** → **Run**
4. ✅ Semua sheet otomatis dibuat!

**Selesai!** Sekarang ada menu baru di atas bernama **📦 Inventaris**

---

## 🎯 Cara Pakai

Setelah setup, ada menu **📦 Inventaris** di atas sheet. Tinggal klik:

| Menu | Fungsi |
|------|--------|
| ➕ Tambah Produk | Tambah produk baru ke database |
| 📥 Stok Masuk | Catat barang masuk (restock) |
| 📤 Stok Keluar | Catat barang keluar (terjual) |
| 🔄 Refresh Dashboard | Update status stok otomatis |

### Contoh Format Input:

**Tambah Produk:**
```
BRG001 | Kopi Arabica | Minuman | kg | 50000 | 85000 | 5
```

**Stok Masuk:**
```
BRG001 | 10 | Restock dari supplier
```

**Stok Keluar:**
```
BRG001 | 3 | Dijual ke customer
```

---

## 📊 Fitur

- ✅ **Auto Setup** — Satu klik, semua sheet + formula langsung jadi
- ✅ **Menu Sederhana** — Tinggal klik, isi format, selesai
- ✅ **Dashboard Otomatis** — Total produk, stok habis, stok rendah, nilai inventori
- ✅ **Warning Stok** — Otomatis tandai LOW STOCK dan OUT OF STOCK
- ✅ **Log Transaksi** — Semua masuk/keluar tercatat lengkap
- ✅ **Tanpa Coding** — Semua lewat menu dan format teks
- ✅ **100% Gratis** — Pake Google Sheets yang udah ada

---

## 📁 Struktur Sheet

| Sheet | Fungsi |
|-------|--------|
| Dashboard | Ringkasan total produk, stok habis, stok rendah, nilai inventori |
| Master Produk | Database produk (SKU, nama, harga, margin) |
| Stok Current | Stok real-time per produk |
| Transaksi Masuk | Log semua barang masuk |
| Transaksi Keluar | Log semua barang keluar |

---

## ❓ FAQ

**Q: Saya belum punya Google Account?**
Buat gratis di accounts.google.com

**Q: Data saya aman?**
Ya, tersimpan di Google Drive pribadi kamu. Tidak ada yang bisa akses kecuali kamu.

**Q: Bisa dipake di HP?**
Ya! Buka Google Sheets app, semua bisa diakses dari HP.

**Q: Script error?**
Pastikan kode ter-copy lengkap dan tidak ada spasi ekstra. Jalankan ulang setupInventory().

---

**Dibuat oleh Mula Labs** — github.com/labsmula  
**Konten terkait:** Tonton video di TikTok/IG @mulalabs
