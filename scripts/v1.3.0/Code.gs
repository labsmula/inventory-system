// Google Apps Script — Mula Inventory System
// Version: 1.3.0 (Simplified + Auto Setup)
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
  master.getRange('H2:H100').setFormulaR1C1('');
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
  
  // Dashboard formulas (auto-update)
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
  
  // Add custom menu
  addInventoryMenu();
  
  SpreadsheetApp.getActiveSpreadsheet().toast('✅ Setup selesai! Buka menu "📦 Inventaris" di atas.', 'Mula Inventory');
}

// ==========================================
// 📦 MENU — Otomatis muncul setelah setup
// ==========================================

function onOpen() {
  addInventoryMenu();
}

function addInventoryMenu() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📦 Inventaris')
    .addItem('➕ Tambah Produk', 'uiAddProduct')
    .addItem('📥 Stok Masuk', 'uiStokMasuk')
    .addItem('📤 Stok Keluar', 'uiStokKeluar')
    .addSeparator()
    .addItem('🔄 Refresh Dashboard', 'refreshDashboard')
    .addSeparator()
    .addItem('🚀 Jalankan Setup Awal', 'setupInventory')
    .addToUi();
}

// ==========================================
// ➕ TAMBAH PRODUK
// ==========================================

function addProduct(sku, nama, kategori, satuan, hargaBeli, hargaJual, minStok) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const master = ss.getSheetByName('Master Produk');
    const stok = ss.getSheetByName('Stok Current');
    
    if (!master || !stok) {
      return { success: false, message: '❌ Sheet belum di-setup. Jalankan setupInventory() dulu.' };
    }
    
    if (!sku || !nama || !hargaBeli || !hargaJual) {
      return { success: false, message: '❌ Data tidak lengkap. SKU, Nama, Harga Beli, Harga Jual wajib diisi.' };
    }
    
    // Cek SKU duplikat
    const data = master.getDataRange().getValues();
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === sku) {
        return { success: false, message: '❌ SKU "' + sku + '" sudah ada!' };
      }
    }
    
    // Tambah ke Master Produk
    master.appendRow([sku, nama, kategori || '-', satuan || 'pcs', hargaBeli, hargaJual, '', minStok || 10, new Date()]);
    
    // Tambah ke Stok Current
    stok.appendRow([sku, nama, 0, 0, 0, 0, 'OK', new Date()]);
    
    return { success: true, message: '✅ Produk "' + nama + '" berhasil ditambah!' };
    
  } catch (error) {
    return { success: false, message: '❌ Error: ' + error.toString() };
  }
}

// UI version — popup form
function uiAddProduct() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    '📦 Tambah Produk Baru',
    'Format: SKU | Nama Produk | Kategori | Satuan | Harga Beli | Harga Jual | Min Stok\n\nContoh:\nBRG001 | Kopi Arabica | Minuman | kg | 50000 | 85000 | 5',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (result.getSelectedButton() !== ui.Button.OK) return;
  
  const parts = result.getResponseText().split('|').map(s => s.trim());
  
  if (parts.length < 4) {
    ui.alert('❌ Format salah. Minimal: SKU | Nama | Kategori | Harga Beli | Harga Jual');
    return;
  }
  
  const res = addProduct(parts[0], parts[1], parts[2], parts[3], Number(parts[4]) || 0, Number(parts[5]) || 0, Number(parts[6]) || 10);
  ui.alert(res.message);
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
    
    if (!stok || !masuk) {
      return { success: false, message: '❌ Sheet belum di-setup.' };
    }
    
    jumlah = Number(jumlah) || 0;
    if (jumlah <= 0) return { success: false, message: '❌ Jumlah harus lebih dari 0.' };
    
    // Cari produk di Stok Current
    const stokData = stok.getDataRange().getValues();
    let rowIndex = -1;
    let stokAkhirLama = 0;
    let masukLama = 0;
    let namaProduk = '';
    
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
    
    // Cari nama produk dari Master kalau kosong
    if (!namaProduk) {
      const masterData = master.getDataRange().getValues();
      for (let i = 1; i < masterData.length; i++) {
        if (masterData[i][0] === sku) {
          namaProduk = masterData[i][1];
          break;
        }
      }
    }
    
    const stokBaru = stokAkhirLama + jumlah;
    const masukBaru = masukLama + jumlah;
    
    // Update Stok Current
    stok.getRange(rowIndex, 4).setValue(masukBaru);       // Kolom Masuk
    stok.getRange(rowIndex, 6).setValue(stokBaru);          // Kolom Stok Akhir
    stok.getRange(rowIndex, 7).setValue('OK');              // Status
    stok.getRange(rowIndex, 8).setValue(new Date());        // Last Updated
    
    // Log ke Transaksi Masuk
    masuk.appendRow([new Date(), sku, namaProduk, jumlah, keterangan || '-']);
    
    return { success: true, message: '✅ Stok masuk "' + namaProduk + '" +' + jumlah + '. Stok sekarang: ' + stokBaru };
    
  } catch (error) {
    return { success: false, message: '❌ Error: ' + error.toString() };
  }
}

// UI version
function uiStokMasuk() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    '📥 Stok Masuk',
    'Format: SKU | Jumlah | Keterangan\n\nContoh:\nBRG001 | 10 | Restock dari supplier',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (result.getSelectedButton() !== ui.Button.OK) return;
  
  const parts = result.getResponseText().split('|').map(s => s.trim());
  if (parts.length < 2) {
    ui.alert('❌ Format salah. Contoh: SKU | Jumlah | Keterangan');
    return;
  }
  
  const res = stokMasuk(parts[0], parts[1], parts[2] || '');
  ui.alert(res.message);
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
    
    if (!stok || !keluar) {
      return { success: false, message: '❌ Sheet belum di-setup.' };
    }
    
    jumlah = Number(jumlah) || 0;
    if (jumlah <= 0) return { success: false, message: '❌ Jumlah harus lebih dari 0.' };
    
    // Cari produk
    const stokData = stok.getDataRange().getValues();
    let rowIndex = -1;
    let stokAkhirLama = 0;
    let keluarLama = 0;
    let namaProduk = '';
    let minStok = 10;
    
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
    
    // Cek stok cukup
    if (jumlah > stokAkhirLama) {
      return { success: false, message: '❌ Stok tidak cukup! Stok saat ini: ' + stokAkhirLama + ', Minta: ' + jumlah };
    }
    
    // Cari min stok dari Master
    if (namaProduk) {
      const masterData = master.getDataRange().getValues();
      for (let i = 1; i < masterData.length; i++) {
        if (masterData[i][0] === sku) {
          minStok = masterData[i][7] || 10;
          if (!namaProduk || namaProduk === '') namaProduk = masterData[i][1];
          break;
        }
      }
    }
    
    const stokBaru = stokAkhirLama - jumlah;
    const keluarBaru = keluarLama + jumlah;
    
    // Tentukan status
    let status = 'OK';
    if (stokBaru === 0) status = 'OUT OF STOCK';
    else if (stokBaru <= minStok) status = 'LOW STOCK';
    
    // Update Stok Current
    stok.getRange(rowIndex, 5).setValue(keluarBaru);       // Kolom Keluar
    stok.getRange(rowIndex, 6).setValue(stokBaru);           // Kolom Stok Akhir
    stok.getRange(rowIndex, 7).setValue(status);             // Status
    stok.getRange(rowIndex, 8).setValue(new Date());         // Last Updated
    
    // Log ke Transaksi Keluar
    keluar.appendRow([new Date(), sku, namaProduk, jumlah, keterangan || '-']);
    
    let extraMsg = '';
    if (status === 'OUT OF STOCK') extraMsg = ' ⚠️ STOK HABIS!';
    else if (status === 'LOW STOCK') extraMsg = ' ⚠️ Stok rendah (' + stokBaru + '/' + minStok + ')';
    
    return { success: true, message: '✅ Stok keluar "' + namaProduk + '" -' + jumlah + '. Stok sekarang: ' + stokBaru + '.' + extraMsg };
    
  } catch (error) {
    return { success: false, message: '❌ Error: ' + error.toString() };
  }
}

// UI version
function uiStokKeluar() {
  const ui = SpreadsheetApp.getUi();
  const result = ui.prompt(
    '📤 Stok Keluar',
    'Format: SKU | Jumlah | Keterangan\n\nContoh:\nBRG001 | 3 | Dijual ke customer',
    ui.ButtonSet.OK_CANCEL
  );
  
  if (result.getSelectedButton() !== ui.Button.OK) return;
  
  const parts = result.getResponseText().split('|').map(s => s.trim());
  if (parts.length < 2) {
    ui.alert('❌ Format salah. Contoh: SKU | Jumlah | Keterangan');
    return;
  }
  
  const res = stokKeluar(parts[0], parts[1], parts[2] || '');
  ui.alert(res.message);
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
    
    // Update status semua produk di Stok Current
    const stokData = stok.getDataRange().getValues();
    
    for (let i = 1; i < stokData.length; i++) {
      if (!stokData[i][0]) continue; // Skip empty rows
      
      const sku = stokData[i][0];
      const stokAkhir = stokData[i][5];
      let minStok = 10; // Default
      
      // Cari min stok dari master
      const masterData = master.getDataRange().getValues();
      for (let j = 1; j < masterData.length; j++) {
        if (masterData[j][0] === sku) {
          minStok = masterData[j][7] || 10;
          break;
        }
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
  
  // Build stok map
  const stokMap = {};
  for (let i = 1; i < stokData.length; i++) {
    if (stokData[i][0]) {
      stokMap[stokData[i][0]] = {
        stok: stokData[i][5],
        masuk: stokData[i][3],
        keluar: stokData[i][4],
        status: stokData[i][6]
      };
    }
  }
  
  const products = [];
  for (let i = 1; i < masterData.length; i++) {
    if (!masterData[i][0]) continue;
    const sku = masterData[i][0];
    const info = stokMap[sku] || { stok: 0, masuk: 0, keluar: 0, status: 'N/A' };
    
    products.push({
      sku: sku,
      nama: masterData[i][1],
      kategori: masterData[i][2],
      satuan: masterData[i][3],
      hargaBeli: masterData[i][4],
      hargaJual: masterData[i][5],
      margin: masterData[i][6],
      minStok: masterData[i][7],
      stok: info.stok,
      status: info.status
    });
  }
  
  return { success: true, products: products };
}
