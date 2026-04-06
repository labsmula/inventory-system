# Mula Inventory System - v1.1.0 Release Summary

**Release Date:** 2026-04-06
**Version:** 1.1.0
**Focus:** QR Code Generation & Barcode Scanning

---

## 🎉 What's New

### 1. QR Code Generation
- **Feature:** Generate QR codes for products
- **Use Case:** Print QR codes on product labels, scan to access product details
- **Implementation:**
  - Frontend: `qrcode.js` library integration
  - Backend: `generateQRCode(sku)` function in `Code.gs`
  - UI: "QR" button in Dashboard table → Modal with QR code display

### 2. Barcode Scanning
- **Feature:** Scan product barcodes via device camera to auto-fill forms
- **Use Case:** Quick product entry during stock receiving, easy stock update
- **Implementation:**
  - Frontend: QuaggaJS library integration
  - Backend: `verifyBarcodeSKU(sku)` function in `Code.gs`
  - UI: "📷 Scan" button in Add Product form → Camera view → Auto-fill SKU & fields

---

## 📦 Files Updated

### Backend:
- `scripts/Code.gs`
  - Updated version comment: 1.0.0 → 1.1.0
  - Added `generateQRCode(sku)` function
  - Added `verifyBarcodeSKU(sku)` function
  - Removed placeholder `startBarcodeScanner()` function (replaced with frontend implementation)

### Frontend:
- `scripts/Index.html`
  - Updated title: "Mula Inventory System" → "Mula Inventory System v1.1.0"
  - Added libraries: `qrcode.js` and `QuaggaJS`
  - Added CSS: `.barcode-scanner`, `.qr-code-container`, `.qr-code-display`
  - Added UI: Barcode scanning controls, QR code modal
  - Updated table headers: Added "QR Code" column
  - Updated JavaScript:
    - `displayProducts()`: Added QR button
    - Added `startBarcodeScanner()`: Camera access, QuaggaJS init, scan detection
    - Added `stopBarcodeScanner()`: Cleanup video stream & QuaggaJS
    - Added `generateProductQRCode(sku, namaProduk)`: Generate QR code modal
    - Added `closeQRModal()`: Close QR code modal

### Documentation:
- `README.md`
  - Updated version: 1.0.0 → 1.1.0
  - Updated tech stack: Added QuaggaJS + QRCode.js
  - Added feature 6: QR Code Generation
  - Added feature 7: Barcode Scanning
  - Added v1.1.0 changelog

- `docs/README.md`
  - Added feature: QR Code Generation (v1.1.0)
  - Added feature: Barcode Scanning (v1.1.0)
  - Added documentation link: QR_BARCODE.md

- `docs/QR_BARCODE.md` (NEW)
  - Complete documentation for QR Code & Barcode features
  - Features, requirements, setup guide, usage guide, security notes
  - Troubleshooting tips
  - Version history

---

## 🔧 Technical Implementation

### QR Code Generation:
- **Library:** `qrcode.js` (https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js)
- **Backend Function:** `generateQRCode(sku)` in `Code.gs`
  - Fetches product data from "Master Produk" sheet
  - Generates Web App URL with SKU query parameter
  - Returns SKU, product name, and URL
- **Frontend Function:** `generateProductQRCode(sku, namaProduk)` in `Index.html`
  - Calls backend function
  - Renders QR code in modal using `qrcode.js`
  - QR code size: 128x128px
  - QR code data: Web App URL + SKU (e.g., `https://script.google.com/macros/s/AKfycbwCMBkdhSsMrMQpY7tZzT1V5dZbKLLmlurVtjUjYlpxEzUju_ozhdSx6V-xmIXz6M_Aew/exec?sku=P001`)

### Barcode Scanning:
- **Library:** QuaggaJS (https://unpkg.com/quagga@0.12.1/dist/quagga.min.js)
- **Backend Function:** `verifyBarcodeSKU(sku)` in `Code.gs`
  - Verifies SKU exists in database
  - Returns product data if found (nama, kategori, satuan, hargaBeli, hargaJual, minStok)
  - Returns error if SKU not found
- **Frontend Functions:**
  - `startBarcodeScanner()`:
    - Requests camera access via `navigator.mediaDevices.getUserMedia()`
    - Initializes QuaggaJS with camera stream
    - Configures decoders for multiple barcode types (Code 128, EAN, UPC, etc.)
    - Detects barcodes and auto-fills form fields
  - `stopBarcodeScanner()`:
    - Stops camera stream
    - Stops QuaggaJS
    - Cleans up UI

---

## 📱 Browser & Device Support

### QR Code Generation:
- All modern browsers (Chrome, Firefox, Edge, Safari)
- QR code scanning requires any QR scanner app

### Barcode Scanning:
- Requires device with camera (mobile or desktop)
- Requires HTTPS connection (automatic for Apps Script deployment)
- Browser support:
  - Chrome 50+ (Full support)
  - Firefox 44+ (Full support)
  - Edge 12+ (Full support)
  - Safari 11+ (Partial support, may have camera permission issues)

---

## 🔒 Security Notes

### Camera Access:
- Camera access is only used for barcode scanning
- Video stream is processed locally in the browser (not sent to server)
- Camera access is requested each time scanning starts
- No video data is stored or transmitted

### QR Code Data:
- QR codes contain only public Web App URLs
- No sensitive product data is embedded in QR codes
- QR codes do NOT contain prices, stock levels, or private data
- QR codes point to Web App, which may require authentication (future)

---

## 🚀 Migration Guide (from v1.0.0 to v1.1.0)

### For Existing Users:
1. No data migration required (Google Sheets data remains compatible)
2. Update `scripts/Code.gs` with new functions
3. Update `scripts/Index.html` with new libraries and UI
4. Re-deploy Web App (New Deployment)
5. Test QR code generation and barcode scanning

### For New Users:
- Follow setup guide in `docs/README.md`
- v1.1.0 includes all features from v1.0.0 plus new QR/Barcode features

---

## 📊 Testing Checklist

### QR Code Generation:
- [ ] Generate QR code for existing product
- [ ] Scan generated QR code with QR scanner app
- [ ] Verify QR code opens Web App with correct SKU
- [ ] Print QR code on product label (optional)

### Barcode Scanning:
- [ ] Click "📷 Scan" button in Add Product form
- [ ] Grant camera permission
- [ ] Scan product barcode (Code 128, EAN, UPC)
- [ ] Verify SKU auto-fills
- [ ] Verify form fields auto-fill (if SKU exists)
- [ ] Verify scanner stops after successful scan
- [ ] Test "Stop Scan" button

### General:
- [ ] Test on mobile device
- [ ] Test on desktop with webcam
- [ ] Test in multiple browsers (Chrome, Firefox, Safari)
- [ ] Verify HTTPS connection
- [ ] Check camera permissions

---

## 📝 Known Issues

1. **Camera Permission Issues on Safari:** May need to adjust browser settings
2. **Barcode Detection in Low Light:** Ensure adequate lighting for scanning
3. **Small Barcode Size:** QuaggaJS may struggle with very small barcodes
4. **iOS Camera Access:** May require user to manually grant camera access in iOS settings

---

## 🔮 Future Enhancements (v1.2.0+)

- [ ] Print QR codes directly from dashboard (print-friendly format)
- [ ] Barcode scanning in stock update form (currently only in add product)
- [ ] Batch QR code generation (generate for all products)
- [ ] QR code history (view generated QR codes)
- [ ] Native mobile app with camera-first interface
- [ ] Barcode label printer integration

---

## 🎯 Version Compatibility

| Component | v1.0.0 | v1.1.0 |
|-----------|--------|--------|
| Google Sheets | ✅ Compatible | ✅ Compatible |
| Code.gs | ✅ Compatible | ✅ Required Update |
| Index.html | ✅ Compatible | ✅ Required Update |
| Web App | ✅ Compatible | ✅ Required Re-deploy |
| Data | ✅ Compatible | ✅ Compatible |

---

## 📞 Support

For issues with QR Code or Barcode Scanning:
- **Documentation:** `docs/QR_BARCODE.md`
- **Troubleshooting:** `docs/TROUBLESHOOTING.md`
- **Email:** support@mulalabs.id
- **WhatsApp:** +62 812 3456 7890

---

## 🎉 Summary

**Mula Inventory System v1.1.0** adds two powerful features:
- **QR Code Generation** — Print QR codes on products for easy access
- **Barcode Scanning** — Scan barcodes via camera to auto-fill forms

Both features are fully integrated with existing v1.0.0 functionality and require minimal setup.

**Upgrade to v1.1.0 today!** ⚡

---

**Generated:** 2026-04-06
**Version:** 1.1.0
**Next Version:** 1.2.0 (Planning)
