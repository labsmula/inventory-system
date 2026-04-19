// Google Apps Script — Mula Inventory System
// Version: 1.3.0 (Full Features + Auto Setup)
// Dibuat oleh Mula Labs — github.com/labsmula

// ==========================================
// 🚀 SETUP AWAL — Jalankan fungsi ini dulu!
// ==========================================

function setupInventory() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Hapus sheet default jika ada
  const defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet) ss.deleteSheet(defaultSheet);
  
  // --- 1. Master Produk ---
  const master = ss.insertSheet('Master Produk');
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
  
  // Conditional formatting: Min Stok warning
  const ruleMinStok = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND(H2<>"",H2<=10)')
    .setBackground('#fff3cd')
    .setRanges([master.getRange('H2:H100')])
    .build();
  master.setConditionalFormatRules([ruleMinStok]);
  
  // --- 2. Stok Current ---
  const stok = ss.insertSheet('Stok Current');
  stok.appendRow(['SKU', 'Nama Produk', 'Stok Awal', 'Masuk', 'Keluar', 'Stok Akhir', 'Status', 'Last Updated']);
  stok.getRange('A1:H1').setFontWeight('bold').setBackground('#34a853').setFontColor('#ffffff');
  stok.setColumnWidth(1, 120);
  stok.setColumnWidth(2, 200);
  
  // --- 3. Transaksi Masuk ---
  const masuk = ss.insertSheet('Transaksi Masuk');
  masuk.appendRow(['Tanggal', 'SKU', 'Nama Produk', 'Jumlah', 'Keterangan']);
  masuk.getRange('A1:E1').setFontWeight('bold').setBackground('#fbbc04').setFontColor('#ffffff');
  masuk.setColumnWidth(1, 140);
  masuk.setColumnWidth(2, 120);
  masuk.setColumnWidth(3, 200);
  
  // --- 4. Transaksi Keluar ---
  const keluar = ss.insertSheet('Transaksi Keluar');
  keluar.appendRow(['Tanggal', 'SKU', 'Nama Produk', 'Jumlah', 'Keterangan']);
  keluar.getRange('A1:E1').setFontWeight('bold').setBackground('#ea4335').setFontColor('#ffffff');
  keluar.setColumnWidth(1, 140);
  keluar.setColumnWidth(2, 120);
  keluar.setColumnWidth(3, 200);
  
  // --- 5. Dashboard ---
  const dash = ss.insertSheet('Dashboard');
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
  
  // Reorder tabs
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

// ==========================================
// ➕ TAMBAH PRODUK
// ==========================================

function addProductSimple(sku, nama, kategori, satuan, hargaBeli, hargaJual, minStok) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const master = ss.getSheetByName('Master Produk');
    const stok = ss.getSheetByName('Stok Current');
    
    if (!master || !stok) return { success: false, message: '❌ Sheet belum di-setup. Jalankan setupInventory() dulu.' };
    if (!sku || !nama || !hargaBeli || !hargaJual) return { success: false, message: '❌ Data tidak lengkap. SKU, Nama, Harga Beli, Harga Jual wajib diisi.' };
    
    const data = master.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === sku) return { success: false, message: '❌ SKU "' + sku + '" sudah ada!' };
    }
    
    master.appendRow([sku, nama, kategori || '-', satuan || 'pcs', hargaBeli, hargaJual, '', minStok || 10, new Date()]);
    stok.appendRow([sku, nama, 0, 0, 0, 0, 'OK', new Date()]);
    
    return { success: true, message: '✅ Produk "' + nama + '" berhasil ditambah!' };
  } catch (error) {
    return { success: false, message: '❌ Error: ' + error.toString() };
  }
}

function uiAddProduct() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    '📦 Tambah Produk Baru',
    'Format: SKU | Nama Produk | Kategori | Satuan | Harga Beli | Harga Jual | Min Stok\n\nContoh:\nBRG001 | Kopi Arabica | Minuman | kg | 50000 | 85000 | 5',
    ui.ButtonSet.OK_CANCEL
  );
  if (result.getSelectedButton() !== ui.Button.OK) return;
  
  const parts = result.getResponseText().split('|').map(s => s.trim());
  if (parts.length < 4) { ui.alert('❌ Format salah. Minimal: SKU | Nama | Kategori | Harga Beli | Harga Jual'); return; }
  
  const res = addProductSimple(parts[0], parts[1], parts[2], parts[3], Number(parts[4]) || 0, Number(parts[5]) || 0, Number(parts[6]) || 10);
  ui.alert(res.message);
  if (res.success) refreshDashboard();
}

// ==========================================
// ✏️ EDIT PRODUK
// ==========================================

function editProduct(sku, updateData) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const master = ss.getSheetByName('Master Produk');
    const stok = ss.getSheetByName('Stok Current');
    
    if (!master) return { success: false, message: '❌ Sheet belum di-setup.' };
    
    const data = master.getDataRange().getValues();
    let rowIndex = -1;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === sku) { rowIndex = i + 1; break; }
    }
    
    if (rowIndex === -1) return { success: false, message: '❌ SKU "' + sku + '" tidak ditemukan.' };
    
    // Update fields yang diberikan
    if (updateData.nama) master.getRange(rowIndex, 2).setValue(updateData.nama);
    if (updateData.kategori) master.getRange(rowIndex, 3).setValue(updateData.kategori);
    if (updateData.satuan) master.getRange(rowIndex, 4).setValue(updateData.satuan);
    if (updateData.hargaBeli) master.getRange(rowIndex, 5).setValue(updateData.hargaBeli);
    if (updateData.hargaJual) master.getRange(rowIndex, 6).setValue(updateData.hargaJual);
    if (updateData.minStok) master.getRange(rowIndex, 8).setValue(updateData.minStok);
    
    // Update nama di Stok Current juga
    if (updateData.nama && stok) {
      const stokData = stok.getDataRange().getValues();
      for (let i = 1; i < stokData.length; i++) {
        if (stokData[i][0] === sku) {
          stok.getRange(i + 1, 2).setValue(updateData.nama);
          break;
        }
      }
    }
    
    // Recalculate margin
    master.getRange('G' + rowIndex).setFormulaR1C1('=IF(AND(R[0]C[-2]<>"",R[0]C[-1]<>""),R[0]C[-1]-R[0]C[-2],"")');
    
    return { success: true, message: '✅ Produk "' + (updateData.nama || sku) + '" berhasil diupdate!' };
  } catch (error) {
    return { success: false, message: '❌ Error: ' + error.toString() };
  }
}

function uiEditProduct() {
  const ui = SpreadsheetApp.getUi();
  
  // Pilih SKU dulu
  const master = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Master Produk');
  if (!master) { ui.alert('❌ Sheet belum di-setup.'); return; }
  
  const data = master.getDataRange().getValues();
  const skuList = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) skuList.push(data[i][0] + ' — ' + data[i][1]);
  }
  if (skuList.length === 0) { ui.alert('❌ Belum ada produk. Tambah produk dulu.'); return; }
  
  const response = ui.prompt(
    '✏️ Edit Produk',
    'Produk tersedia:\n' + skuList.join('\n') + '\n\nMasukkan SKU yang ingin diedit:',
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  const sku = response.getResponseText().trim();
  if (!sku) { ui.alert('❌ SKU tidak boleh kosong.'); return; }
  
  // Ambil data lama
  let oldData = null;
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === sku) {
      oldData = { nama: data[i][1], kategori: data[i][2], satuan: data[i][3], hargaBeli: data[i][4], hargaJual: data[i][5], minStok: data[i][7] };
      break;
    }
  }
  if (!oldData) { ui.alert('❌ SKU "' + sku + '" tidak ditemukan.'); return; }
  
  // Input data baru
  const editResponse = ui.prompt(
    '✏️ Edit: ' + oldData.nama + ' (' + sku + ')',
    'Isi data baru (kosongkan jika tidak ingin diubah):\n\nNama: ' + oldData.nama + '\nKategori: ' + oldData.kategori + '\nSatuan: ' + oldData.satuan + '\nHarga Beli: ' + oldData.hargaBeli + '\nHarga Jual: ' + oldData.hargaJual + '\nMin Stok: ' + oldData.minStok + '\n\nFormat: Nama | Kategori | Satuan | Harga Beli | Harga Jual | Min Stok',
    ui.ButtonSet.OK_CANCEL
  );
  if (editResponse.getSelectedButton() !== ui.Button.OK) return;
  
  const parts = editResponse.getResponseText().split('|').map(s => s.trim());
  if (parts.length === 1 && parts[0] === '') { ui.alert('❌ Tidak ada perubahan.'); return; }
  
  const updateData = {};
  if (parts[0]) updateData.nama = parts[0];
  if (parts[1]) updateData.kategori = parts[1];
  if (parts[2]) updateData.satuan = parts[2];
  if (parts[3]) updateData.hargaBeli = Number(parts[3]);
  if (parts[4]) updateData.hargaJual = Number(parts[4]);
  if (parts[5]) updateData.minStok = Number(parts[5]);
  
  const res = editProduct(sku, updateData);
  ui.alert(res.message);
  if (res.success) refreshDashboard();
}

// ==========================================
// 🗑️ HAPUS PRODUK
// ==========================================

function deleteProduct(sku) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const master = ss.getSheetByName('Master Produk');
    const stok = ss.getSheetByName('Stok Current');
    
    if (!master) return { success: false, message: '❌ Sheet belum di-setup.' };
    
    const masterData = master.getDataRange().getValues();
    let masterRow = -1;
    let namaProduk = '';
    
    for (let i = 1; i < masterData.length; i++) {
      if (masterData[i][0] === sku) {
        masterRow = i + 1;
        namaProduk = masterData[i][1];
        break;
      }
    }
    
    if (masterRow === -1) return { success: false, message: '❌ SKU "' + sku + '" tidak ditemukan.' };
    
    // Hapus dari Master Produk
    master.deleteRow(masterRow);
    
    // Hapus dari Stok Current
    if (stok) {
      const stokData = stok.getDataRange().getValues();
      for (let i = stokData.length - 1; i >= 1; i--) {
        if (stokData[i][0] === sku) {
          stok.deleteRow(i + 1);
          break;
        }
      }
    }
    
    return { success: true, message: '✅ Produk "' + namaProduk + '" (' + sku + ') berhasil dihapus!' };
  } catch (error) {
    return { success: false, message: '❌ Error: ' + error.toString() };
  }
}

function uiDeleteProduct() {
  const ui = SpreadsheetApp.getUi();
  const master = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Master Produk');
  if (!master) { ui.alert('❌ Sheet belum di-setup.'); return; }
  
  const data = master.getDataRange().getValues();
  const skuList = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) skuList.push(data[i][0] + ' — ' + data[i][1]);
  }
  if (skuList.length === 0) { ui.alert('❌ Belum ada produk.'); return; }
  
  const response = ui.prompt(
    '🗑️ Hapus Produk',
    'Produk tersedia:\n' + skuList.join('\n') + '\n\nMasukkan SKU yang ingin dihapus:',
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  const sku = response.getResponseText().trim();
  if (!sku) { ui.alert('❌ SKU tidak boleh kosong.'); return; }
  
  const confirm = ui.alert('⚠️ Konfirmasi', 'Yakin ingin menghapus produk "' + sku + '"?\n\nData stok dan transaksi akan tetap ada di log.', ui.ButtonSet.YES_NO);
  if (confirm !== ui.Button.YES) return;
  
  const res = deleteProduct(sku);
  ui.alert(res.message);
  if (res.success) refreshDashboard();
}

// ==========================================
// 📥 STOK MASUK
// ==========================================

function stokMasuk(sku, jumlah, keterangan) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const stok = ss.getSheetByName('Stok Current');
    const masuk = ss.getSheetByName('Transaksi Masuk');
    const master = ss.getSheetByName('Master Produk');
    
    if (!stok || !masuk) return { success: false, message: '❌ Sheet belum di-setup.' };
    jumlah = Number(jumlah) || 0;
    if (jumlah <= 0) return { success: false, message: '❌ Jumlah harus lebih dari 0.' };
    
    const stokData = stok.getDataRange().getValues();
    let rowIndex = -1, stokAkhirLama = 0, masukLama = 0, namaProduk = '';
    
    for (let i = 1; i < stokData.length; i++) {
      if (stokData[i][0] === sku) {
        rowIndex = i + 1;
        stokAkhirLama = stokData[i][5];
        masukLama = stokData[i][3];
        namaProduk = stokData[i][1];
        break;
      }
    }
    
    if (rowIndex === -1) return { success: false, message: '❌ SKU "' + sku + '" tidak ditemukan.' };
    
    if (!namaProduk) {
      const masterData = master.getDataRange().getValues();
      for (let i = 1; i < masterData.length; i++) {
        if (masterData[i][0] === sku) { namaProduk = masterData[i][1]; break; }
      }
    }
    
    const stokBaru = stokAkhirLama + jumlah;
    const masukBaru = masukLama + jumlah;
    
    stok.getRange(rowIndex, 4).setValue(masukBaru);
    stok.getRange(rowIndex, 6).setValue(stokBaru);
    stok.getRange(rowIndex, 7).setValue(stokBaru <= 0 ? 'OUT OF STOCK' : 'OK');
    stok.getRange(rowIndex, 8).setValue(new Date());
    
    masuk.appendRow([new Date(), sku, namaProduk, jumlah, keterangan || '-']);
    
    return { success: true, message: '✅ Stok masuk "' + namaProduk + '" +' + jumlah + '. Stok: ' + stokBaru };
  } catch (error) {
    return { success: false, message: '❌ Error: ' + error.toString() };
  }
}

function uiStokMasuk() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    '📥 Stok Masuk',
    'Format: SKU | Jumlah | Keterangan\n\nContoh:\nBRG001 | 10 | Restock dari supplier',
    ui.ButtonSet.OK_CANCEL
  );
  if (result.getSelectedButton() !== ui.Button.OK) return;
  
  const parts = result.getResponseText().split('|').map(s => s.trim());
  if (parts.length < 2) { ui.alert('❌ Format salah. Contoh: SKU | Jumlah | Keterangan'); return; }
  
  const res = stokMasuk(parts[0], parts[1], parts[2] || '');
  ui.alert(res.message);
  if (res.success) refreshDashboard();
}

// ==========================================
// 📤 STOK KELUAR
// ==========================================

function stokKeluar(sku, jumlah, keterangan) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const stok = ss.getSheetByName('Stok Current');
    const keluar = ss.getSheetByName('Transaksi Keluar');
    const master = ss.getSheetByName('Master Produk');
    
    if (!stok || !keluar) return { success: false, message: '❌ Sheet belum di-setup.' };
    jumlah = Number(jumlah) || 0;
    if (jumlah <= 0) return { success: false, message: '❌ Jumlah harus lebih dari 0.' };
    
    const stokData = stok.getDataRange().getValues();
    let rowIndex = -1, stokAkhirLama = 0, keluarLama = 0, namaProduk = '', minStok = 10;
    
    for (let i = 1; i < stokData.length; i++) {
      if (stokData[i][0] === sku) {
        rowIndex = i + 1;
        stokAkhirLama = stokData[i][5];
        keluarLama = stokData[i][4];
        namaProduk = stokData[i][1];
        break;
      }
    }
    
    if (rowIndex === -1) return { success: false, message: '❌ SKU "' + sku + '" tidak ditemukan.' };
    if (jumlah > stokAkhirLama) return { success: false, message: '❌ Stok tidak cukup! Stok: ' + stokAkhirLama + ', Minta: ' + jumlah };
    
    if (namaProduk) {
      const masterData = master.getDataRange().getValues();
      for (let i = 1; i < masterData.length; i++) {
        if (masterData[i][0] === sku) { minStok = masterData[i][7] || 10; break; }
      }
    }
    
    const stokBaru = stokAkhirLama - jumlah;
    const keluarBaru = keluarLama + jumlah;
    let status = 'OK';
    if (stokBaru === 0) status = 'OUT OF STOCK';
    else if (stokBaru <= minStok) status = 'LOW STOCK';
    
    stok.getRange(rowIndex, 5).setValue(keluarBaru);
    stok.getRange(rowIndex, 6).setValue(stokBaru);
    stok.getRange(rowIndex, 7).setValue(status);
    stok.getRange(rowIndex, 8).setValue(new Date());
    
    keluar.appendRow([new Date(), sku, namaProduk, jumlah, keterangan || '-']);
    
    let extra = '';
    if (status === 'OUT OF STOCK') extra = ' ⚠️ STOK HABIS!';
    else if (status === 'LOW STOCK') extra = ' ⚠️ Stok rendah (' + stokBaru + '/' + minStok + ')';
    
    return { success: true, message: '✅ Stok keluar "' + namaProduk + '" -' + jumlah + '. Stok: ' + stokBaru + '.' + extra };
  } catch (error) {
    return { success: false, message: '❌ Error: ' + error.toString() };
  }
}

function uiStokKeluar() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    '📤 Stok Keluar',
    'Format: SKU | Jumlah | Keterangan\n\nContoh:\nBRG001 | 3 | Dijual ke customer',
    ui.ButtonSet.OK_CANCEL
  );
  if (result.getSelectedButton() !== ui.Button.OK) return;
  
  const parts = result.getResponseText().split('|').map(s => s.trim());
  if (parts.length < 2) { ui.alert('❌ Format salah. Contoh: SKU | Jumlah | Keterangan'); return; }
  
  const res = stokKeluar(parts[0], parts[1], parts[2] || '');
  ui.alert(res.message);
  if (res.success) refreshDashboard();
}

// ==========================================
// 📊 LAPORAN
// ==========================================

function generateReport(type, startDate, endDate) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const master = ss.getSheetByName('Master Produk');
    const stok = ss.getSheetByName('Stok Current');
    const masuk = ss.getSheetByName('Transaksi Masuk');
    const keluar = ss.getSheetByName('Transaksi Keluar');
    
    if (!master || !stok) return { success: false, message: '❌ Sheet belum di-setup.' };
    
    let report = '📊 LAPORAN INVENTORIS\n';
    report += 'Tanggal: ' + Utilities.formatDate(new Date(), 'Asia/Jakarta', 'dd/MM/yyyy HH:mm') + '\n';
    report += '═══════════════════════════\n\n';
    
    // --- Ringkasan Umum ---
    const stokData = stok.getDataRange().getValues();
    const masterData = master.getDataRange().getValues();
    
    let totalProduk = 0, stokHabis = 0, stokRendah = 0, totalNilai = 0;
    let totalMasuk = 0, totalKeluar = 0;
    
    const products = [];
    for (let i = 1; i < masterData.length; i++) {
      if (!masterData[i][0]) continue;
      const sku = masterData[i][0];
      const nama = masterData[i][1];
      const hargaBeli = masterData[i][4];
      const hargaJual = masterData[i][5];
      const minStok = masterData[i][7] || 10;
      
      let stokAkhir = 0, statusStok = 'N/A';
      for (let j = 1; j < stokData.length; j++) {
        if (stokData[j][0] === sku) {
          stokAkhir = stokData[j][5];
          statusStok = stokData[j][6];
          break;
        }
      }
      
      totalProduk++;
      totalNilai += stokAkhir * hargaBeli;
      if (statusStok === 'OUT OF STOCK') stokHabis++;
      else if (statusStok === 'LOW STOCK') stokRendah++;
      
      products.push({ sku, nama, hargaBeli, hargaJual, stokAkhir, statusStok, minStok });
    }
    
    // Hitung transaksi masuk
    if (masuk) {
      const masukData = masuk.getDataRange().getValues();
      for (let i = 1; i < masukData.length; i++) {
        if (masukData[i][3]) totalMasuk += masukData[i][3];
      }
    }
    
    // Hitung transaksi keluar
    if (keluar) {
      const keluarData = keluar.getDataRange().getValues();
      for (let i = 1; i < keluarData.length; i++) {
        if (keluarData[i][3]) totalKeluar += keluarData[i][3];
      }
    }
    
    report += '📦 RINGKASAN\n';
    report += 'Total Produk      : ' + totalProduk + '\n';
    report += 'Stok Habis        : ' + stokHabis + '\n';
    report += 'Stok Rendah       : ' + stokRendah + '\n';
    report += 'Nilai Inventori   : Rp ' + totalNilai.toLocaleString('id-ID') + '\n';
    report += 'Total Stok Masuk  : ' + totalMasuk + ' unit\n';
    report += 'Total Stok Keluar : ' + totalKeluar + ' unit\n';
    report += '\n═══════════════════════════\n\n';
    
    // --- Daftar Produk ---
    report += '📋 DAFTAR PRODUK\n';
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const margin = p.hargaJual - p.hargaBeli;
      report += '\n' + (i + 1) + '. ' + p.nama + ' (' + p.sku + ')\n';
      report += '   Harga Beli  : Rp ' + p.hargaBeli.toLocaleString('id-ID') + '\n';
      report += '   Harga Jual  : Rp ' + p.hargaJual.toLocaleString('id-ID') + '\n';
      report += '   Margin      : Rp ' + margin.toLocaleString('id-ID') + '\n';
      report += '   Stok        : ' + p.stokAkhir + ' [' + p.statusStok + ']\n';
    }
    
    // --- Produk yang perlu di-restock ---
    const needRestock = products.filter(p => p.statusStok === 'OUT OF STOCK' || p.statusStok === 'LOW STOCK');
    if (needRestock.length > 0) {
      report += '\n\n═══════════════════════════\n\n';
      report += '⚠️ PERLU RESTOCK\n';
      for (const p of needRestock) {
        report += '- ' + p.nama + ': Stok ' + p.stokAkhir + '/' + p.minStok + '\n';
      }
    }
    
    report += '\n═══════════════════════════\n';
    report += 'Dibuat oleh Mula Inventory System\n';
    
    return { success: true, report: report };
  } catch (error) {
    return { success: false, message: '❌ Error: ' + error.toString() };
  }
}

function uiViewReport() {
  const ui = SpreadsheetApp.getUi();
  const res = generateReport();
  if (!res.success) { ui.alert(res.message); return; }
  
  // Tampilkan di sidebar
  const html = HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html><head><style>' +
    'body { font-family: Arial, sans-serif; padding: 15px; font-size: 13px; }' +
    'h2 { color: #4285f4; }' +
    'pre { white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 8px; font-size: 12px; line-height: 1.5; }' +
    '</style></head><body>' +
    '<h2>📊 Laporan Inventori</h2>' +
    '<pre>' + res.report + '</pre>' +
    '<br><button onclick="google.script.host.close()">Tutup</button>' +
    '</body></html>'
  ).setTitle('Laporan Inventori');
  
  ui.showSidebar(html);
}

// ==========================================
// 🎫 QR CODE (Download)
// ==========================================

function generateQRCode(sku) {
  try {
    const master = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Master Produk');
    if (!master) return { success: false, message: '❌ Sheet belum di-setup.' };
    
    const data = master.getDataRange().getValues();
    let namaProduk = '', hargaJual = 0, found = false;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === sku) {
        namaProduk = data[i][1];
        hargaJual = data[i][5];
        found = true;
        break;
      }
    }
    
    if (!found) return { success: false, message: '❌ SKU "' + sku + '" tidak ditemukan.' };
    
    // QR data: SKU + Nama + Harga
    const qrData = JSON.stringify({
      sku: sku,
      nama: namaProduk,
      harga: hargaJual,
      source: 'Mula Inventory System'
    });
    
    // Generate QR Code via Google Chart API
    const qrUrl = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + encodeURIComponent(qrData) + '&choe=UTF-8';
    
    const webAppURL = ScriptApp.getService().getUrl();
    
    return {
      success: true,
      message: '✅ QR Code untuk "' + namaProduk + '" berhasil di-generate!',
      data: {
        sku: sku,
        nama: namaProduk,
        hargaJual: hargaJual,
        qrUrl: qrUrl,
        qrData: qrData,
        url: webAppURL + '?sku=' + sku
      }
    };
  } catch (error) {
    return { success: false, message: '❌ Error: ' + error.toString() };
  }
}

function uiGenerateQR() {
  const ui = SpreadsheetApp.getUi();
  const master = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Master Produk');
  if (!master) { ui.alert('❌ Sheet belum di-setup.'); return; }
  
  const data = master.getDataRange().getValues();
  const skuList = [];
  for (let i = 1; i < data.length; i++) {
    if (data[i][0]) skuList.push(data[i][0] + ' — ' + data[i][1] + ' (Rp ' + data[i][5].toLocaleString('id-ID') + ')');
  }
  if (skuList.length === 0) { ui.alert('❌ Belum ada produk.'); return; }
  
  const response = ui.prompt(
    '🎫 Generate QR Code',
    'Produk tersedia:\n' + skuList.join('\n') + '\n\nMasukkan SKU:',
    ui.ButtonSet.OK_CANCEL
  );
  if (response.getSelectedButton() !== ui.Button.OK) return;
  
  const sku = response.getResponseText().trim();
  const res = generateQRCode(sku);
  
  if (!res.success) { ui.alert(res.message); return; }
  
  // Tampilkan QR di sidebar dengan tombol download
  const html = HtmlService.createHtmlOutput(
    '<!DOCTYPE html><html><head><style>' +
    'body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }' +
    'h2 { color: #4285f4; }' +
    '.info { background: #f5f5f5; padding: 10px; border-radius: 8px; margin: 15px 0; text-align: left; }' +
    '.info p { margin: 5px 0; }' +
    'img { border: 2px solid #ddd; border-radius: 8px; margin: 15px 0; }' +
    'button { padding: 10px 20px; font-size: 14px; cursor: pointer; border-radius: 5px; border: none; }' +
    '.download { background: #34a853; color: white; margin: 5px; }' +
    '.download:hover { background: #2d8f47; }' +
    '.close { background: #ea4335; color: white; margin: 5px; }' +
    '</style></head><body>' +
    '<h2>🎫 QR Code</h2>' +
    '<div class="info">' +
    '<p><strong>SKU:</strong> ' + res.data.sku + '</p>' +
    '<p><strong>Produk:</strong> ' + res.data.nama + '</p>' +
    '<p><strong>Harga:</strong> Rp ' + res.data.hargaJual.toLocaleString('id-ID') + '</p>' +
    '</div>' +
    '<img src="' + res.data.qrUrl + '" width="250" height="250" id="qrImage">' +
    '<br>' +
    '<button class="download" onclick="downloadQR()">⬇️ Download QR Code</button>' +
    '<button class="close" onclick="google.script.host.close()">✕ Tutup</button>' +
    '<script>' +
    'function downloadQR() {' +
    '  var img = document.getElementById("qrImage");' +
    '  var canvas = document.createElement("canvas");' +
    '  canvas.width = img.width;' +
    '  canvas.height = img.height;' +
    '  var ctx = canvas.getContext("2d");' +
    '  ctx.drawImage(img, 0, 0);' +
    '  var link = document.createElement("a");' +
    '  link.download = "QR_' + res.data.sku + '.png";' +
    '  link.href = canvas.toDataURL("image/png");' +
    '  link.click();' +
    '}' +
    '</script>' +
    '</body></html>'
  ).setTitle('QR Code — ' + res.data.nama);
  
  ui.showSidebar(html);
}

// ==========================================
// 🔄 REFRESH DASHBOARD
// ==========================================

function refreshDashboard() {
  const ui = SpreadsheetApp.getUi();
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const stok = ss.getSheetByName('Stok Current');
    const master = ss.getSheetByName('Master Produk');
    
    if (!stok || !master) {
      ui.alert('❌ Sheet belum di-setup. Jalankan menu: 📦 Inventaris > 🚀 Jalankan Setup Awal');
      return;
    }
    
    const stokData = stok.getDataRange().getValues();
    for (let i = 1; i < stokData.length; i++) {
      if (!stokData[i][0]) continue;
      const sku = stokData[i][0];
      const stokAkhir = stokData[i][5];
      let minStok = 10;
      
      const masterData = master.getDataRange().getValues();
      for (let j = 1; j < masterData.length; j++) {
        if (masterData[j][0] === sku) { minStok = masterData[j][7] || 10; break; }
      }
      
      let status = 'OK';
      if (stokAkhir === 0) status = 'OUT OF STOCK';
      else if (stokAkhir <= minStok) status = 'LOW STOCK';
      
      stok.getRange(i + 1, 7).setValue(status);
    }
    
    SpreadsheetApp.getActiveSpreadsheet().toast('✅ Dashboard refreshed!', 'Mula Inventory');
  } catch (error) {
    ui.alert('❌ Error: ' + error.toString());
  }
}

// ==========================================
// 📋 GET DATA (untuk integrasi / web app)
// ==========================================

function getAllData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const master = ss.getSheetByName('Master Produk');
  const stok = ss.getSheetByName('Stok Current');
  
  if (!master || !stok) return { success: false, message: 'Sheet belum di-setup' };
  
  const masterData = master.getDataRange().getValues();
  const stokData = stok.getDataRange().getValues();
  
  const stokMap = {};
  for (let i = 1; i < stokData.length; i++) {
    if (stokData[i][0]) {
      stokMap[stokData[i][0]] = { stok: stokData[i][5], masuk: stokData[i][3], keluar: stokData[i][4], status: stokData[i][6] };
    }
  }
  
  const products = [];
  for (let i = 1; i < masterData.length; i++) {
    if (!masterData[i][0]) continue;
    const sku = masterData[i][0];
    const info = stokMap[sku] || { stok: 0, masuk: 0, keluar: 0, status: 'N/A' };
    products.push({ sku, nama: masterData[i][1], kategori: masterData[i][2], satuan: masterData[i][3], hargaBeli: masterData[i][4], hargaJual: masterData[i][5], margin: masterData[i][6], minStok: masterData[i][7], stok: info.stok, status: info.status });
  }
  
  return { success: true, products: products };
}

// ==========================================
// 🌐 WEB APP FUNCTIONS
// ==========================================

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Mula Inventory System v1.3.0')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function addProduct(productDataOrSku, nama, kategori, satuan, hargaBeli, hargaJual, minStok) {
  // Handle object format (from web app)
  if (typeof productDataOrSku === 'object' && productDataOrSku !== null) {
    var p = productDataOrSku;
    if (!p.sku || !p.nama || !p.hargaBeli || !p.hargaJual || !p.minStok) {
      return { success: false, message: 'Data produk tidak lengkap' };
    }
    // Check for duplicate SKU
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Master Produk');
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === p.sku) return { success: false, message: 'SKU sudah terdaftar!' };
    }
    sheet.appendRow([p.sku, p.nama, p.kategori || '-', p.satuan || 'pcs', p.hargaBeli, p.hargaJual, p.hargaJual - p.hargaBeli, p.minStok, new Date()]);
    var stokSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Stok Current');
    stokSheet.appendRow([p.sku, p.nama, 0, 0, 0, 0, 'OK', new Date()]);
    return { success: true, message: 'Produk ' + p.nama + ' berhasil ditambah!', data: p };
  }
  // Handle individual params (from menu)
  return addProductSimple(productDataOrSku, nama, kategori, satuan, hargaBeli, hargaJual, minStok);
}

function getData() {
  try {
    var masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Master Produk');
    var stokSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Stok Current');
    var masterData = masterSheet.getDataRange().getValues();
    var stokData = stokSheet.getDataRange().getValues();
    var stokMap = {};
    for (var i = 1; i < stokData.length; i++) {
      if (stokData[i][0]) stokMap[stokData[i][0]] = stokData[i][5];
    }
    var products = [];
    var totalProducts = 0, lowStockCount = 0, outOfStockCount = 0, inventoryValue = 0;
    for (var i = 1; i < masterData.length; i++) {
      var row = masterData[i];
      if (!row[0]) continue;
      var sku = row[0], nama = row[1], kat = row[2], sat = row[3], hargaBeli = row[4], hargaJual = row[5], minStok = row[7];
      var stokAkhir = stokMap[sku] || 0;
      var status = 'OK';
      if (stokAkhir === 0) status = 'OUT OF STOCK';
      else if (stokAkhir <= minStok) status = 'LOW STOCK';
      totalProducts++;
      inventoryValue += (stokAkhir * hargaBeli);
      if (stokAkhir === 0) outOfStockCount++;
      else if (stokAkhir <= minStok) lowStockCount++;
      products.push({ sku: sku, nama: nama, kategori: kat, satuan: sat, hargaBeli: hargaBeli, hargaJual: hargaJual, margin: row[6], minStok: minStok, stok: stokAkhir, status: status });
    }
    var inventoryValueFormatted = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(inventoryValue);
    return { products: products, dashboard: { totalProducts: totalProducts, lowStockCount: lowStockCount, outOfStockCount: outOfStockCount, inventoryValue: inventoryValueFormatted } };
  } catch (error) {
    return { success: false, message: 'Error: ' + error.toString() };
  }
}

function updateStock(sku, quantity, type) {
  try {
    if (type !== 'in' && type !== 'out') return { success: false, message: "Type harus 'in' atau 'out'" };
    var stokSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Stok Current');
    var data = stokSheet.getDataRange().getValues();
    var found = false, rowIndex = 0, existingData = {}, namaProduk = '';
    for (var i = 0; i < data.length - 1; i++) {
      if (data[i + 1][0] === sku) {
        rowIndex = i + 2;
        existingData = { stokAwal: data[i + 1][2], masuk: data[i + 1][3], keluar: data[i + 1][4], stokAkhir: data[i + 1][5] };
        namaProduk = data[i + 1][1];
        found = true;
        break;
      }
    }
    if (!found) return { success: false, message: 'Produk dengan SKU ' + sku + ' tidak ditemukan!' };
    var stokBaru = type === 'in' ? existingData.stokAkhir + quantity : existingData.stokAkhir - quantity;
    if (stokBaru < 0) return { success: false, message: 'Stok tidak cukup! Stok saat ini: ' + existingData.stokAkhir };
    var newMasuk = type === 'in' ? existingData.masuk + quantity : existingData.masuk;
    var newKeluar = type === 'out' ? existingData.keluar + quantity : existingData.keluar;
    // Get minStok for status
    var masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Master Produk');
    var masterData = masterSheet.getDataRange().getValues();
    var minStok = 10;
    for (var i = 1; i < masterData.length; i++) {
      if (masterData[i][0] === sku) { minStok = masterData[i][7] || 10; break; }
    }
    var status = 'OK';
    if (stokBaru === 0) status = 'OUT OF STOCK';
    else if (stokBaru <= minStok) status = 'LOW STOCK';
    stokSheet.getRange(rowIndex, 3, 1, 6).setValues([[existingData.stokAwal, newMasuk, newKeluar, stokBaru, status, new Date()]]);
    // Log transaction
    var transSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(type === 'in' ? 'Transaksi Masuk' : 'Transaksi Keluar');
    if (transSheet) transSheet.appendRow([new Date(), sku, namaProduk, quantity, '-']);
    return { success: true, message: 'Stok berhasil diupdate! Stok akhir: ' + stokBaru, lowStock: status === 'LOW STOCK' };
  } catch (error) {
    return { success: false, message: 'Error: ' + error.toString() };
  }
}

function getDashboardTrends(days) {
  try {
    var stokSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Stok Current');
    var data = stokSheet.getDataRange().getValues();
    var totalStock = 0;
    for (var i = 1; i < data.length; i++) { if (data[i][5]) totalStock += data[i][5]; }
    var today = new Date();
    var trends = [];
    for (var i = 0; i <= days; i++) {
      var date = new Date(today);
      date.setDate(today.getDate() - (days - i));
      var dateStr = Utilities.formatDate(date, 'GMT', 'dd/MM/yyyy');
      trends.push({ date: dateStr, totalStock: totalStock });
    }
    return { success: true, data: trends };
  } catch (error) {
    return { success: false, message: 'Error: ' + error.toString() };
  }
}

function getCategoryDistribution() {
  try {
    var masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Master Produk');
    var data = masterSheet.getDataRange().getValues();
    var categoryCount = {};
    var totalProducts = 0;
    for (var i = 1; i < data.length; i++) {
      var kategori = data[i][2];
      if (kategori && data[i][0]) {
        categoryCount[kategori] = (categoryCount[kategori] || 0) + 1;
        totalProducts++;
      }
    }
    var distribution = [];
    for (var key in categoryCount) {
      distribution.push({ category: key, count: categoryCount[key], percentage: Math.round((categoryCount[key] / totalProducts) * 100) });
    }
    distribution.sort(function(a, b) { return b.count - a.count; });
    return { success: true, data: distribution };
  } catch (error) {
    return { success: false, message: 'Error: ' + error.toString() };
  }
}

function getRecentActivity(limit) {
  try {
    var stokSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Stok Current');
    var data = stokSheet.getDataRange().getValues();
    var activities = [];
    for (var i = 1; i < data.length; i++) {
      var sku = data[i][0], namaProduk = data[i][1], stokAwal = data[i][2], stokAkhir = data[i][5], lastUpdated = data[i][7];
      if (stokAkhir !== stokAwal && lastUpdated) {
        activities.push({ type: stokAkhir > stokAwal ? 'Stock In' : 'Stock Out', sku: sku, namaProduk: namaProduk, quantity: Math.abs(stokAkhir - stokAwal), timestamp: lastUpdated });
      }
    }
    activities.sort(function(a, b) { return new Date(b.timestamp) - new Date(a.timestamp); });
    var recent = activities.slice(0, limit || 5);
    var now = new Date();
    for (var i = 0; i < recent.length; i++) {
      var ts = new Date(recent[i].timestamp);
      recent[i].timeStr = Utilities.formatDate(ts, Session.getScriptTimeZone(), 'HH:mm');
      recent[i].dateStr = Utilities.formatDate(ts, Session.getScriptTimeZone(), 'dd/MM/yyyy');
      var diffMs = now - ts;
      var diffHrs = Math.floor(diffMs / 3600000);
      var diffDays = Math.floor(diffMs / 86400000);
      if (diffHrs < 1) recent[i].relativeTime = 'Just now';
      else if (diffHrs < 24) recent[i].relativeTime = diffHrs + ' hour' + (diffHrs > 1 ? 's' : '') + ' ago';
      else recent[i].relativeTime = diffDays + ' day' + (diffDays > 1 ? 's' : '') + ' ago';
    }
    return { success: true, data: recent };
  } catch (error) {
    return { success: false, message: 'Error: ' + error.toString() };
  }
}

function getTopSellers(limit) {
  try {
    var transSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Transaksi Keluar');
    var data = transSheet.getDataRange().getValues();
    var productSales = {};
    for (var i = 1; i < data.length; i++) {
      var sku = data[i][1], quantity = data[i][3];
      if (sku && quantity) {
        if (!productSales[sku]) productSales[sku] = { sku: sku, totalSold: 0, transactions: 0 };
        productSales[sku].totalSold += quantity;
        productSales[sku].transactions += 1;
      }
    }
    var topSellers = Object.values(productSales).sort(function(a, b) { return b.totalSold - a.totalSold; });
    topSellers = topSellers.slice(0, limit || 10);
    var masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Master Produk');
    var masterData = masterSheet.getDataRange().getValues();
    for (var i = 0; i < topSellers.length; i++) {
      for (var j = 1; j < masterData.length; j++) {
        if (masterData[j][0] === topSellers[i].sku) { topSellers[i].namaProduk = masterData[j][1]; break; }
      }
    }
    return { success: true, data: topSellers };
  } catch (error) {
    return { success: false, message: 'Error: ' + error.toString() };
  }
}
