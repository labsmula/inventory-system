# QR Code & Barcode Scanning - Documentation

**Mula Inventory System v1.1.0**

---

## 📱 Overview

Mula Inventory System v1.1.0 now includes two advanced features:

1. **QR Code Generation** — Generate QR codes for products for quick access
2. **Barcode Scanning** — Scan product barcodes via camera to auto-fill forms

---

## 🎯 Features

### 1. QR Code Generation

**Purpose:** Generate QR codes for products to enable quick scanning and access.

**Use Cases:**
- Print QR codes on product labels
- Scan QR codes to quickly access product details
- Share product URLs via QR codes

**How It Works:**
1. Go to Dashboard → Products Table
2. Click "QR" button on any product row
3. QR code modal will display with product info
4. Scan the QR code with any QR scanner app
5. QR code contains a URL to the Web App with the product SKU

**Technical Details:**
- Library: `qrcode.js` (https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js)
- Generated QR codes contain Web App URL + SKU query parameter
- Example URL: `https://script.google.com/macros/s/AKfycbwCMBkdhSsMrMQpY7tZzT1V5dZbKLLmlurVtjUjYlpxEzUju_ozhdSx6V-xmIXz6M_Aew/exec?sku=P001`

---

### 2. Barcode Scanning

**Purpose:** Scan product barcodes via device camera to auto-fill forms.

**Use Cases:**
- Quick product entry during stock receiving
- Easy stock update without typing
- Integration with POS systems that use barcode labels

**How It Works:**
1. Go to "Tambah Produk" tab
2. Click "📷 Scan" button
3. Grant camera access (if prompted)
4. Point camera at product barcode
5. SKU will auto-fill in the SKU field
6. Form fields will auto-fill if SKU exists in database
7. Scanner stops automatically after successful scan

**Supported Barcode Types:**
- Code 128
- EAN-13
- EAN-8
- Code 39
- Code 93
- UPC
- UPC-E

**Technical Details:**
- Library: QuaggaJS (https://unpkg.com/quagga@0.12.1/dist/quagga.min.js)
- Camera access: `navigator.mediaDevices.getUserMedia()`
- Browser support: HTTPS required (or localhost)

---

## 🔧 Requirements

### For QR Code Generation:
- Modern browser (Chrome, Firefox, Edge, Safari)
- QR code scanner app (for scanning generated QR codes)

### For Barcode Scanning:
- Device with camera (mobile or desktop)
- HTTPS connection (required for camera access)
- Browser that supports `getUserMedia` API
- Modern browser (Chrome 50+, Firefox 44+, Edge 12+, Safari 11+)

---

## 📋 Setup Guide

### For QR Code Generation:
No setup required! QR code generation is fully integrated in v1.1.0.

### For Barcode Scanning:
1. Ensure your Web App URL is HTTPS (automatic for Apps Script deployment)
2. Test camera access on your device:
   - Open Web App
   - Click "📷 Scan" button
   - Grant camera permission
   - Test scanning a barcode

---

## 🚀 Usage Guide

### QR Code Generation:

**Step-by-Step:**
1. Open Web App
2. Click "Dashboard" tab
3. Find the product in the table
4. Click "QR" button in the "QR Code" column
5. QR code modal will display with:
   - QR code image (128x128px)
   - Product name
6. Click "Tutup" to close modal

**Printing QR Codes:**
- Right-click on QR code → "Save Image As"
- Print on product labels
- Include product name below QR code

**Scanning Generated QR Codes:**
- Use any QR code scanner app
- Scan the QR code
- Opens Web App with product SKU pre-loaded
- Product details are visible in dashboard

---

### Barcode Scanning:

**Step-by-Step (Adding New Product with Barcode):**
1. Open Web App
2. Click "Tambah Produk" tab
3. Click "📷 Scan" button
4. Grant camera permission
5. Point camera at product barcode
6. SKU field will auto-fill
7. Fill in other product details (nama, kategori, etc.)
8. Click "+ Tambah Produk"

**Step-by-Step (Updating Stock with Barcode):**
1. Open Web App
2. Click "Dashboard" tab
3. Note: Stock update form uses manual SKU input
4. To use barcode, copy SKU from dashboard
5. Go to "Tambah Produk" tab → "📷 Scan" button
6. Scanner will auto-fill SKU
7. (Note: Stock update form enhancement coming in v1.2.0)

**Troubleshooting:**
- **Camera not working:** Check browser permissions, use HTTPS
- **Barcode not detecting:** Ensure good lighting, camera focus, supported barcode type
- **Scanner not stopping:** Click "Stop Scan" button manually

---

## 🔒 Security & Privacy

### Camera Access:
- Camera access is only used for barcode scanning
- Video stream is processed locally in the browser
- No video data is sent to server
- Camera access is requested each time scanning starts

### QR Code Data:
- QR codes contain only public Web App URLs
- No sensitive product data is embedded in QR codes
- QR codes do NOT contain prices or inventory data
- QR codes point to Web App, which requires authentication

---

## 📊 Version History

- **v1.1.0** — Added QR Code Generation & Barcode Scanning
- **v1.0.0** — Initial release with core inventory features

---

## 🤝 Support

For issues or questions:
- WhatsApp: +62 812 3456 7890
- Email: support@mulalabs.id

---

## 📚 Additional Resources

- **qrcode.js Library:** https://github.com/davidshimjs/qrcodejs
- **QuaggaJS Library:** https://serratus.github.io/quaggaJS/
- **Apps Script Documentation:** https://developers.google.com/apps-script

---

**Generated:** 2026-04-06
**Version:** 1.1.0
