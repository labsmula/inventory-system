// Google Apps Script — Mula Inventory System
// Version: 1.3.0 — SETUP & MENU
// File: Setup.gs
// Dibuat oleh Mula Labs — github.com/labsmula

// ==========================================
// 🚀 SETUP AWAL — Jalankan fungsi ini dulu!
// ==========================================

function setupInventory() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Rename Sheet1 jadi Dashboard jika belum ada
  const s1 = ss.getSheetByName('Sheet1');
  if (s1 && !ss.getSheetByName('Dashboard')) s1.setName('Dashboard');
  
  // Helper: buat sheet kalau belum ada
  function getOrCreateSheet(name) {
    let sheet = ss.getSheetByName(name);
    if (!sheet) sheet = ss.insertSheet(name);
    return sheet;
  }
  
  // --- 1. Master Produk ---
  const master = getOrCreateSheet('Master Produk');
  if (master.getLastRow() === 0) {
    master.appendRow(['SKU', 'Nama Produk', 'Kategori', 'Satuan', 'Harga Beli', 'Harga Jual', 'Margin', 'Min Stok', 'Tanggal Input']);
    master.getRange('A1:I1').setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
    master.setColumnWidth(1, 120);
    master.setColumnWidth(2, 200);
    master.setColumnWidth(3, 120);
    master.setColumnWidth(4, 80);
    // Formula margin
    for (let i = 2; i <= 100; i++) {
      master.getRange('G' + i).setFormulaR1C1('=IF(AND(R[0]C[-2]<>"",R[0]C[-1]<>""),R[0]C[-1]-R[0]C[-2],"")');
    }
    // Conditional formatting
    const rule = SpreadsheetApp.newConditionalFormatRule()
      .whenFormulaSatisfied('=AND(H2<>"",H2<=10)')
      .setBackground('#fff3cd')
      .setRanges([master.getRange('H2:H100')])
      .build();
    master.setConditionalFormatRules([rule]);
  }
  
  // --- 2. Stok Current ---
  const stok = getOrCreateSheet('Stok Current');
  if (stok.getLastRow() === 0) {
    stok.appendRow(['SKU', 'Nama Produk', 'Stok Awal', 'Masuk', 'Keluar', 'Stok Akhir', 'Status', 'Last Updated']);
    stok.getRange('A1:H1').setFontWeight('bold').setBackground('#34a853').setFontColor('#ffffff');
    stok.setColumnWidth(1, 120);
    stok.setColumnWidth(2, 200);
  }
  
  // --- 3. Transaksi Masuk ---
  const masuk = getOrCreateSheet('Transaksi Masuk');
  if (masuk.getLastRow() === 0) {
    masuk.appendRow(['Tanggal', 'SKU', 'Nama Produk', 'Jumlah', 'Keterangan']);
    masuk.getRange('A1:E1').setFontWeight('bold').setBackground('#fbbc04').setFontColor('#ffffff');
    masuk.setColumnWidth(1, 140);
    masuk.setColumnWidth(2, 120);
    masuk.setColumnWidth(3, 200);
  }
  
  // --- 4. Transaksi Keluar ---
  const keluar = getOrCreateSheet('Transaksi Keluar');
  if (keluar.getLastRow() === 0) {
    keluar.appendRow(['Tanggal', 'SKU', 'Nama Produk', 'Jumlah', 'Keterangan']);
    keluar.getRange('A1:E1').setFontWeight('bold').setBackground('#ea4335').setFontColor('#ffffff');
    keluar.setColumnWidth(1, 140);
    keluar.setColumnWidth(2, 120);
    keluar.setColumnWidth(3, 200);
  }
  
  // --- 5. Dashboard ---
  const dash = getOrCreateSheet('Dashboard');
  if (dash.getLastRow() === 0) {
    dash.appendRow(['📊 DASHBOARD INVENTORIS']);
    dash.getRange('A1').setFontWeight('bold').setFontSize(16).merge();
    dash.appendRow([]);
    dash.appendRow(['Total Produk', 'Stok Habis', 'Stok Rendah', 'Nilai Inventori']);
    dash.getRange('A3:D3').setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
    dash.getRange('A4').setFormula('=COUNTA(\'Master Produk\'!A2:A)-COUNTBLANK(\'Master Produk\'!A2:A)');
    dash.getRange('B4').setFormula('=COUNTIF(\'Stok Current\'!G2:G,"OUT OF STOCK")');
    dash.getRange('C4').setFormula('=COUNTIF(\'Stok Current\'!G2:G,"LOW STOCK")');
    dash.getRange('D4').setFormula('=SUMPRODUCT(\'Stok Current\'!F2:F,\'Master Produk\'!E2:E)');
    dash.getRange('D4').setNumberFormat('"Rp "#,##0');
    dash.setColumnWidth(1, 150);
    dash.setColumnWidth(2, 130);
    dash.setColumnWidth(3, 130);
    dash.setColumnWidth(4, 180);
  }
  
  // Reorder tabs — Dashboard pertama
  ss.setActiveSheet(dash);
  ss.moveActiveSheet(1);
  
  addInventoryMenu();
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ Setup selesai! Buka menu "📦 Inventaris" di atas.', 'Mula Inventory');
}

// ==========================================
// 📦 MENU
// ==========================================

function onOpen() {
  addInventoryMenu();
}

function addInventoryMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📦 Inventaris')
    .addItem('➕ Tambah Produk', 'uiAddProduct')
    .addItem('✏️ Edit Produk', 'uiEditProduct')
    .addItem('🗑️ Hapus Produk', 'uiDeleteProduct')
    .addSeparator()
    .addItem('📥 Stok Masuk', 'uiStokMasuk')
    .addItem('📤 Stok Keluar', 'uiStokKeluar')
    .addSeparator()
    .addItem('📊 Lihat Laporan', 'uiViewReport')
    .addItem('🎫 Generate QR Code', 'uiGenerateQR')
    .addSeparator()
    .addItem('🔄 Refresh Dashboard', 'refreshDashboard')
    .addSeparator()
    .addItem('🚀 Jalankan Setup Awal', 'setupInventory')
    .addToUi();
}
