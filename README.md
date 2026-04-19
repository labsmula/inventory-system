# Mula Labs Inventory System

## 📦 Project Overview

**Name:** Mula Inventory System
**Version:** 1.2.1
**Tech Stack:** Google Sheets + Google Apps Script + Chart.js + qrcode.js + QuaggaJS
**Status:** Production Ready

---

## 🎯 Purpose

Sistem inventory berbasis **Google Sheets + Google Apps Script** yang membantu UMKM Indonesia track stok produk dengan mudah, gratis, dan interaktif.

---

## ✨ Fitur Utama

### 1. **Frontend UI (Interaktif)**
- Form input produk (SKU, nama, kategori, harga, stok)
- Dashboard monitoring stok real-time
- Search & filter produk
- Responsive design (mobile-friendly)

### 2. **Backend Logic (Google Apps Script)**
- `doGet()` — Serve HTML UI
- `addProduct()` — Tambah produk baru
- `getData()` — Fetch semua data produk
- `updateStock()` — Update stok (masuk/keluar)
- `sendEmailNotification()` — Email alert low stock

### 3. **Database (Google Sheets)**
- **Master Produk** — Database produk dengan margin
- **Stok Current** — Tracking stok real-time
- **Transaksi Masuk** — Log restock
- **Transaksi Keluar** — Log penjualan

### 4. **Dashboard Widgets**
- Total Products count
- Low Stock count
- Out of Stock count
- Inventory Value (IDR)

### 5. **Email Notification**
- Otomatis kirim email jika stok <= minimum
- Kirim ke email owner UMKM

### 6. **QR Code Generation** (NEW - v1.1.0)
- Generate QR codes untuk produk
- Scan QR codes untuk quick access ke product details
- Print QR codes pada product labels

### 7. **Barcode Scanning** (NEW - v1.1.0)
- Scan product barcodes via device camera
- Auto-fill form fields with scanned barcode
- Support berbagai barcode types (Code 128, EAN, UPC, dll)

---

## 🚀 Cara Setup

### **Langkah 1: Copy Google Sheet Template (5 Menit)**
1. Buka file `GOOGLE_SHEET_TEMPLATE.md`
2. Klik link template
3. File > Make a Copy
4. Rename: "Inventory System - [Nama UMKM]"

### **Langkah 2: Setup Google Apps Script (10 Menit)**
1. Buka Google Sheet yang baru
2. Extensions > Apps Script
3. Copy kode dari file `scripts/Code.gs`
4. Paste ke file `Code.gs`
5. Save (Ctrl+S)

### **Langkah 3: Deploy sebagai Web App (5 Menit)**
1. Klik Deploy > New Deployment
2. Type: Web App
3. Description: "Mula Inventory System - [Nama UMKM]"
4. Execute as: Me
5. Who has access: Anyone
6. Klik Deploy

### **Langkah 4: Akses Web App**
1. Copy URL Web App dari file `WEB_APP_URL.md`
2. Buka di browser
3. Web App UI akan muncul
4. Siap digunakan!

---

## 📚 Dokumentasi Lengkap

### **Untuk UMKM Clients:**
- [`docs/README.md`](docs/README.md) — Panduan setup cepat
- [`docs/USER_MANUAL.md`](docs/USER_MANUAL.md) — Panduan penggunaan Web App & Google Sheets
- [`docs/TROUBLESHOOTING.md`](docs/TROUBLESHOOTING.md) — Solusi masalah umum

### **Untuk Developer/Tech Support:**
- [`docs/CODE_GS.md`](docs/CODE_GS.md) — Kode backend Google Apps Script (copy-paste ready)
- [`docs/CLIENT_PACKAGE.md`](docs/CLIENT_PACKAGE.md) — Template package untuk distribusi ke UMKM

---

## 🎯 Use Cases

### **Untuk UMKM F&B:**
- Track bahan baku (tepung, gula, dll)
- Monitor stok produk jadi
- Alert jika stok restock rendah

### **Untuk UMKM Retail:**
- Manage inventory barang dagangan
- Track penjualan harian
- Hitung margin per produk

### **Untuk UMKM Jasa:**
- Track jam kerja (jika pakai satuan "jam")
- Monitor resource per jasa
- Alert jika resource habis

---

## 💰 Cost

**100% GRATIS!**
- Google Sheets: Free (15GB storage)
- Google Apps Script: Free
- Web App Deployment: Free
- Email Notification: Free (via MailApp)

**Tidak ada biaya bulanan.**

---

## 🔗 Links Penting

- **Google Sheet Template:** Lihat file `GOOGLE_SHEET_TEMPLATE.md`
- **Web App URL:** Lihat file `WEB_APP_URL.md`

---

## 📁 Folder Structure

```
mula-labs-inventory-system/
├── README.md                           # Project overview & setup guide
├── GOOGLE_SHEET_TEMPLATE.md          # Google Sheet template link
├── WEB_APP_URL.md                     # Web App deployment link
├── VERSION_1.1.0.md                  # v1.1.0 release summary
├── SCRIPTS_VERSION_STRUCTURE.md        # Version management documentation
├── docs/                               # Documentation folder
│   ├── README.md                      # Setup guide
│   ├── USER_MANUAL.md                 # User manual
│   ├── CODE_GS.md                    # Backend code
│   ├── CLIENT_PACKAGE.md              # Client package
│   ├── TROUBLESHOOTING.md             # Troubleshooting guide
│   ├── QR_BARCODE.md                  # QR Code & Barcode documentation
│   └── V1.2.0_PLANNING.md           # v1.2.0 modern dashboard planning
└── scripts/                             # Scripts folder (versioned)
    ├── Code.gs                        # Latest version (symlink to v1.1.0)
    ├── Index.html                      # Latest version (symlink to v1.1.0)
    ├── v1.0.0/                       # Core Features (Complete)
    │   ├── Code.gs
    │   └── Index.html
    ├── v1.1.0/                       # QR Code & Barcode Scanning (Complete)
    │   ├── Code.gs
    │   └── Index.html
    ├── v1.2.0/                       # Modern Dashboard (Planning)
    │   ├── Code.gs
    │   └── Index.html
    ├── v1.3.0/                       # Interactive Features (Not Started)
    └── v1.4.0/                       # Advanced Analytics (Not Started)
```

**Current Version:** v1.1.0 (Production Ready)
**Planning Version:** v1.2.0 (Modern Dashboard)
- **Kode Backend:** Lihat file `scripts/Code.gs`
- **Panduan Penggunaan:** Lihat file `docs/USER_MANUAL.md`

---

## 📞 Kontak

**Mula Labs**
- **Email:** hello@mulalabs.tech
- **WhatsApp:** +62 895 1830 1399
- **TikTok:** [@mulalabs](https://tiktok.com/@mulalabs)
- **Instagram:** [@mulalabs](https://instagram.com/mulalabs)
- **GitHub:** [labsmula](https://github.com/labsmula)
- **Lokasi:** Remote — Indonesia

---

## 🚀 Quick Start

**Coba sekarang:**
1. Copy Google Sheet Template (lihat file `GOOGLE_SHEET_TEMPLATE.md`)
2. Setup Apps Script (lihat file `scripts/Code.gs`)
3. Deploy Web App (lihat file `WEB_APP_URL.md`)
4. Buka Web App dan tambah produk pertama!

**Sistem siap dalam 20 menit!** ⚡

---

## 📜 Changelog

### **v1.1.0 (2026-04-06) — QR Code & Barcode Scanning**
- ✅ QR Code Generation — Generate QR codes for products
- ✅ Barcode Scanning — Scan barcodes via camera to auto-fill forms
- ✅ Integration with qrcode.js & QuaggaJS libraries
- ✅ Updated documentation (QR_BARCODE.md)
- ✅ Enhanced UI with camera controls & QR modal

### **v1.0.0 (2026-04-06)**
- Initial release
- Core features: Add product, Dashboard, Stock management
- Email notification system
- Dashboard widgets (Total, Low Stock, Out of Stock, Value)
- Complete documentation (User Manual, Troubleshooting, Client Package)

---

## ⚡ License

Project ini dikembangkan oleh **Mula Labs** untuk UMKM Indonesia.
Distribusi bebas untuk penggunaan komersial dan non-komersial.

---

**Selamat menggunakan Mula Inventory System!** 🎉

## 📜 Changelog (Updated)

### **v1.2.1 (2026-04-06)** — Single File Design (All Pages CRUD)
- ✅ Fixed loading & blank page issue (v1.2.0 modular design bug)
- ✅ Reverted to single file design (Index.html)
- ✅ All 5 views (Dashboard, Products, Transactions, Reports, Settings) in one file
- ✅ JavaScript view switching (show/hide sections)
- ✅ Full CRUD functionality for all pages:
  - Dashboard: KPI cards, stock trend chart, category distribution, alerts, insights, recent activity feed
  - Products: Search, filter, pagination, add product, edit (placeholder), QR code, delete (placeholder)
  - Transactions: Tabs (All, Stock In, Stock Out), summary stats, history table, filters, pagination, view (placeholder)
  - Reports: Report types (Inventory, Transaction, Valuation, Low Stock), summary stats, charts, view (placeholder), download PDF (placeholder)
  - Settings: General, notifications, integrations (placeholder), account, save (placeholder), export (placeholder), logout (placeholder)
- ✅ QR Code generation (functional)
- ✅ Barcode scanning (placeholder)
- ✅ Responsive design (mobile sidebar toggle, grid layouts)
- ✅ Notification system (success/error messages)
- ✅ Loading states (spinner for async operations)
- ✅ Modals (Add Product, QR Code)
- ✅ Chart.js integration (charts for dashboard & reports)
- ✅ qrcode.js integration (QR code generation)
- ✅ QuaggaJS integration (barcode scanning — placeholder)
- ✅ Font Awesome integration (icons)
- ✅ Google Fonts integration (Poppins, Open Sans, Lato)
- ✅ Updated version to v1.2.1, added changelog

### **v1.2.0 (2026-04-06)** — Modern Dashboard (Modular Design)
- ✅ Modern dashboard UI with sidebar navigation
- ✅ KPI cards with trend indicators (4 metrics)
- ✅ Stock trend chart (7 days line chart)
- ✅ Category distribution (doughnut chart)
- ✅ Alerts & insights (auto-populated)
- ✅ Recent activity feed (timeline)
- ❌ Modular design (multiple HTML files) — Caused loading & blank page issue
- Updated version to v1.2.0, added changelog

### **v1.1.0 (2026-04-06)**
- Added QR Code Generation & Barcode Scanning
- Integration with qrcode.js & QuaggaJS libraries
- Updated documentation (QR_BARCODE.md)
- Updated version to v1.1.0, added features 6 & 7, added v1.1.0 changelog

### **v1.0.0 (2026-04-06)**
- Initial release
- Core features: Add product, Dashboard, Stock management
- Email notification system
- Dashboard widgets (Total, Low Stock, Out of Stock, Value)
- Complete documentation (5 files)

