# Troubleshooting - Solusi Masalah Umum

## ⚠️ Masalah Web App

### Problem 1: Web App tidak muncul (Blank Screen)
**Symptoms:**
- Buka URL Web App → Halaman kosong/benar
- Tidak ada error message

**Solusi:**
1. Refresh browser (tekan F5)
2. Buka di Incognito/Private window (bypass cache)
3. Cek browser console (tekan F12) untuk error JavaScript
4. Jika ada error: "ScriptError: ReferenceError: document is not defined" → Check `Index.html` di Apps Script Editor
5. Jika error: "Script function not found" → Check `Code.gs` di Apps Script Editor

---

### Problem 2: "You do not have permission to call getRange()"
**Symptoms:**
- Tambah produk via form → Error: "You do not have permission"
- Data tidak tersimpan ke Google Sheets

**Solusi:**
1. Buka Google Sheet (yang di-copy dari template)
2. Cek Extensions > Apps Script > File > Project properties
3. Pastikan **Bound script** menampilkan sheet yang benar
4. Jika tidak, klik "Add script" > Pilih sheet > Save

---

### Problem 3: "Script function not found: addProduct"
**Symptoms:**
- Tambah produk via form → Error: "Script function not found"
- Console error: "addProduct is not defined"

**Solusi:**
1. Buka Apps Script Editor
2. Cek file `Code.gs`
3. Pastikan function `addProduct(productData)` ada
4. Pastikan nama function benar (case-sensitive)
5. Refresh Web App (F5) dan coba lagi

---

### Problem 4: "SKU sudah terdaftar!" tapi di Excel belum ada data
**Symptoms:**
- Tambah produk via form → Notif: "SKU sudah terdaftar!"
- Cek Google Sheets → Data kosong (hanya header)
- Coba lagi → Masih "SKU sudah terdaftar!"

**Solusi:**
1. Ini masalah **stale deployment** (Web App jalanin kode lama)
2. Re-deploy Web App:
   - Buka Apps Script Editor
   - Klik Deploy > New Deployment
   - Pilih type: Web App
   - Execute as: Me
   - Who has access: Anyone
   - Klik Deploy
3. Buka URL Web App baru (jangan pakai URL lama)
4. Coba tambah produk lagi

---

## ⚠️ Masalah Google Sheets

### Problem 5: Margin % tidak muncul (Error: #DIV/0!)
**Symptoms:**
- Kolom Margin di sheet "Master Produk" kosong/error
- Tampilan: `#DIV/0!`

**Solusi:**
1. Cek formula di Kolom G (Margin %)
2. Formula benar: `=ROUND((F2-E2)/F2*100, 0)`
3. Pastikan:
   - F2 = Harga Jual
   - E2 = Harga Beli
   - Jangan ada cell kosong di baris data
4. Jika masih error, refresh formula:
   - Klik cell formula > Tekan Enter

---

### Problem 6: Conditional formatting tidak aktif
**Symptoms:**
- Stok sudah < min stok, tapi background tidak kuning/merah
- Manual re-check conditional formatting > Rules ada, tapi tidak aktif

**Solusi:**
1. Buka sheet "Stok Current"
2. Select seluruh kolom Status (Kolom G)
3. Klik Format > Conditional Formatting
4. Hapus semua rule yang ada (hapus satu per satu)
5. Tambah rule baru:
   - Rule 1: Cell value < cell value (select kolom H, kolom Min Stok)
   - Format: Background kuning, Text merah
   - Rule 2: Cell value = 0
   - Format: Background merah
6. Klik Done
7. Refresh data (tekan Enter di salah satu cell)

---

### Problem 7: Data tidak sinkron (Web App vs Google Sheets)
**Symptoms:**
- Tambah produk via Web App → Berhasil
- Cek Google Sheets → Data tidak masuk

**Solusi:**
1. Cek apakah Web App URL yang sedang dipakai URL yang terbaru (setelah re-deploy)
2. Refresh Google Sheets (tekan F5)
3. Cek apakah sheet yang diakses di Web App adalah sheet yang benar
4. Jika masih tidak sinkron, tambah produk via Google Sheets manual untuk testing

---

## ⚠️ Masalah Email Notification

### Problem 8: Email notifikasi tidak diterima
**Symptoms:**
- Stok low stock, tapi tidak ada email masuk inbox
- Function `sendEmailNotification()` tidak error di Apps Script Logs

**Solusi:**
1. Cek email penerima di function `updateStock()`:
   - Di `Code.gs`, cari baris: `const emailPenerima = "owner@mulalabs.id";`
   - Ganti dengan email Anda yang benar
2. Test email notifikasi manual:
   - Buka Apps Script Editor
   - Jalankan function `sendEmailNotification()` dengan parameter manual
   - Cek inbox apakah email masuk
3. Jika masih tidak masuk, cek folder Spam/Promotions
4. Jika Apps Script minta authorization:
   - Klik "Review Permissions"
   - Pilih akun Google Anda
   - Klik "Allow"
   - Coba kirim lagi

---

## ⚠️ Masalah Browser & Koneksi

### Problem 9: Web App tidak bisa dibuka di HP (Mobile)
**Symptoms:**
- Buka URL Web App di HP → Error: "This site can't be reached"
- Loading terus-menerus, tidak pernah selesai

**Solusi:**
1. Cek koneksi internet di HP
2. Coba ganti browser (Chrome, Firefox, Edge)
3. Coba buka di Desktop/Laptop (untuk testing)
4. Jika bisa di desktop tapi tidak di HP, mungkin masalah responsive design di `Index.html`
5. Pastikan `meta name="viewport" content="width=device-width, initial-scale=1"` ada di `<head>` `Index.html`

---

## ⚠️ Masalah Deployment

### Problem 10: Error saat deploy: "ScriptError: The script completed but did not return anything"
**Symptoms:**
- Deploy > New Deployment > Klik Deploy
- Error: "The script completed but did not return anything"

**Solusi:**
1. Pastikan function `doGet()` ada di `Code.gs`
2. Pastikan `doGet()` mengembalikan:
   ```javascript
   return HtmlService.createHtmlOutputFromFile('Index')
     .setTitle("Mula Inventory System")
     .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
   ```
3. Jika `Index.html` belum ada:
   - Buat file HTML di Apps Script Editor
   - File > New > HTML file
   - Name: `Index.html`
4. Re-deploy lagi

---

## ⚠️ Masalah Data

### Problem 11: Data produk hilang setelah update stok
**Symptoms:**
- Update stok via Web App atau Google Sheets
- Produk hilang dari sheet "Master Produk"

**Solusi:**
1. Jangan hapus baris di sheet "Master Produk"
2. Untuk update stok, edit di sheet "Stok Current" saja
3. Pastikan tidak salah sheet:
   - Update stok: Sheet "Stok Current"
   - Tambah produk: Sheet "Master Produk" + auto di "Stok Current"
4. Cek apakah ada row yang terhapus tidak sengaja (Undo dengan Ctrl+Z)

---

## 📝 Catatan Umum

1. **Selalu Refresh Browser** — Masalah cache sering terjadi, selalu refresh (F5) sebelum berasumsi error
2. **Selalu Re-deploy Jika Edit Code** — Web App tidak auto-reload saat edit di Apps Script Editor, selalu re-deploy
3. **Gunakan Browser Modern** — Chrome, Firefox, Edge, Safari terbaru. Hindari IE lama.
4. **Cek Console (F12)** — Selalu cek browser console untuk error JavaScript jika ada hal aneh
5. **Backup Data** — Selalu download Google Sheets sebagai .zip sebelum melakukan perubahan besar

---

## 🆘 Masalah Tidak Ada di Sini?

### Hubungi Mula Labs Support

**Email:** support@mulalabs.id
**WhatsApp:** +62 812 3456 7890
**Website:** www.mulalabs.id

### Saat Report Issue:
1. Screenshot error
2. Jelaskan langkah sebelum error
3. Jelaskan device/browser yang dipakai
4. Kirim ke email support atau WhatsApp

Tim support akan merespon dalam 1x24 jam.

---

**Semoga masalah Anda cepat terselesaikan!** 👍
