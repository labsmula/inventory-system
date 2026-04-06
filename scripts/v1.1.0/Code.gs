// Google Apps Script Backend untuk Mula Inventory System
// Version: 1.1.0 (QR Code & Barcode Scanning Features)

// Serve HTML UI
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle("Mula Inventory System")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// --- PRODUCT FUNCTIONS ---

// Add new product
function addProduct(productData) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Produk");
    
    // Validasi data
    if (!productData.sku || !productData.nama || !productData.hargaBeli || !productData.hargaJual || !productData.minStok) {
      return {
        success: false,
        message: "Data produk tidak lengkap"
      };
    }
    
    // Cek apakah SKU sudah ada (METODE FIX: Gunakan getDataRange)
    const lastRow = sheet.getLastRow();
    let existingSKUs = [];
    
    if (lastRow && lastRow.getRowIndex() > 0) {
      const data = sheet.getDataRange().getValues();
      for (let i = 1; i < data.length; i++) {
        const row = data[i];
        if (row[0] && row[0] !== "") {
          existingSKUs.push(row[0]);
        }
      }
    }
    
    if (existingSKUs.includes(productData.sku)) {
      return {
        success: false,
        message: "SKU sudah terdaftar!"
      };
    }
    
    // Tambah produk baru
    sheet.appendRow([
      productData.sku,
      productData.nama,
      productData.kategori,
      productData.satuan,
      productData.hargaBeli,
      productData.hargaJual,
      productData.minStok,
      new Date()
    ]);
    
    // Initialize stok di sheet Stok Current
    const stokSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stok Current");
    stokSheet.appendRow([
      productData.sku,
      productData.nama,
      0,  // Stok Awal
      0,  // Masuk
      0,  // Keluar
      0,  // Stok Akhir
      "OK",  // Status
      new Date()  // Last Updated
    ]);
    
    return {
      success: true,
      message: "Produk " + productData.nama + " berhasil ditambah!",
      data: productData
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}

// Get all products + dashboard data
function getData() {
  try {
    const masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Produk");
    const stokSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stok Current");
    
    // Get data dari Master Produk
    const masterData = masterSheet.getDataRange().getValues();
    const headers = masterData[0];
    const products = [];
    
    // Get data dari Stok Current
    const stokData = stokSheet.getDataRange().getValues();
    
    // Mapping SKU ke stok
    const stokMap = {};
    for (let i = 1; i < stokData.length; i++) {
      const row = stokData[i];
      const sku = row[0];  // Kolom SKU
      const stokAkhir = row[4];  // Kolom Stok Akhir
      stokMap[sku] = stokAkhir;
    }
    
    // Variabel dashboard
    let totalProducts = 0;
    let lowStockCount = 0;
    let outOfStockCount = 0;
    let inventoryValue = 0;
    
    // Gabungkan data dan hitung metrics
    for (let i = 1; i < masterData.length; i++) {
      const row = masterData[i];
      const sku = row[0];
      const nama = row[1];
      const kategori = row[2];
      const satuan = row[3];
      const minStok = row[7];  // Kolom Minimum Stok
      
      const stokAkhir = stokMap[sku] || 0;
      
      let status = "OK";
      if (stokAkhir === 0) {
        status = "OUT OF STOCK";
      } else if (stokAkhir <= minStok) {
        status = "LOW STOCK";
      }
      
      // Count metrics
      totalProducts++;
      inventoryValue += (stokAkhir * row[4]);
      
      if (stokAkhir === 0) {
        outOfStockCount++;
      } else if (stokAkhir <= minStok) {
        lowStockCount++;
      }
      
      products.push({
        sku: sku,
        nama: nama,
        kategori: kategori,
        satuan: satuan,
        hargaBeli: row[4],
        hargaJual: row[5],
        margin: row[6],
        minStok: minStok,
        stok: stokAkhir,
        status: status
      });
    }
    
    // Format inventory value ke Rupiah
    const inventoryValueFormatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(inventoryValue);
    
    return {
      products: products,
      dashboard: {
        totalProducts: totalProducts,
        lowStockCount: lowStockCount,
        outOfStockCount: outOfStockCount,
        inventoryValue: inventoryValueFormatted
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}

// Update stok
function updateStock(sku, quantity, type) {
  try {
    // type: "in" (masuk) atau "out" (keluar)
    
    if (type !== "in" && type !== "out") {
      return {
        success: false,
        message: "Type harus 'in' atau 'out'"
      };
    }
    
    const stokSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stok Current");
    const data = stokSheet.getDataRange().getValues();
    const headers = data[0];
    const products = data.slice(1);
    
    // Cari produk berdasarkan SKU
    let found = false;
    let rowIndex = 0;
    let existingData = {};
    let namaProduk = "";
    
    for (let i = 0; i < products.length; i++) {
      if (products[i][0] === sku) {  // Kolom SKU
        rowIndex = i + 2;  // +2 karena header di row 1
        existingData = {
          stokAwal: products[i][2],
          masuk: products[i][3],
          keluar: products[i][4],
          stokAkhir: products[i][5]
        };
        namaProduk = products[i][1];  // Kolom Nama Produk
        found = true;
        break;
      }
    }
    
    if (!found) {
      return {
        success: false,
        message: "Produk dengan SKU " + sku + " tidak ditemukan!"
      };
    }
    
    // Hitung stok baru
    const stokBaru = type === "in" 
      ? existingData.stokAkhir + quantity
      : existingData.stokAkhir - quantity;
    
    if (stokBaru < 0) {
      return {
        success: false,
        message: "Stok tidak cukup! Stok saat ini: " + existingData.stokAkhir
      };
    }
    
    // Update baris
    const newMasuk = type === "in" 
      ? existingData.masuk + quantity 
      : existingData.masuk;
    
    const newKeluar = type === "out" 
      ? existingData.keluar + quantity 
      : existingData.keluar;
    
    stokSheet.getRange(rowIndex, 3, 1, 3).setValues([[
      existingData.stokAwal,
      newMasuk,
      newKeluar,
      stokBaru,
      "OK",
      new Date()
    ]]);
    
    // Cek low stock
    const masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Produk");
    const masterData2 = masterSheet.getDataRange().getValues();
    let minStok = 0;
    
    for (let i = 1; i < masterData2.length; i++) {
      if (masterData2[i][0] === sku) {
        minStok = masterData2[i][7];  // Kolom Minimum Stok
        break;
      }
    }
    
    if (stokBaru <= minStok && stokBaru > 0) {
      // Kirim email notifikasi
      const emailPenerima = "owner@mulalabs.id";  // GANTI dengan email Anda
      const emailResult = sendEmailNotification(sku, namaProduk, stokBaru, minStok, emailPenerima);
      
      return {
        success: true,
        message: "Stok berhasil diupdate! Peringatan: Stok rendah (" + stokBaru + "/" + minStok + ")",
        lowStock: true
      };
    }
    
    return {
      success: true,
      message: "Stok berhasil diupdate! Stok akhir: " + stokBaru,
      lowStock: false
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}

// --- EMAIL NOTIFICATION FUNCTIONS ---

// Send email notification
function sendEmailNotification(sku, namaProduk, stokSekarang, minStok, emailPenerima) {
  try {
    const subject = "⚠️ ALERT STOK RENDAH: " + namaProduk;
    const body = `
Halo,

Ini adalah notifikasi otomatis dari Mula Inventory System.

Produk: ${namaProduk} (SKU: ${sku})
Stok saat ini: ${stokSekarang}
Stok minimum: ${minStok}

Mohon segera restock produk ini untuk menghindari kehabisan stok.

Terima kasih,
Mula Inventory System
    `;
    
    MailApp.sendEmail({
      to: emailPenerima,
      subject: subject,
      body: body
    });
    
    return {
      success: true,
      message: "Email notifikasi berhasil dikirim ke " + emailPenerima
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}

// --- QR CODE FUNCTIONS ---

// Generate QR Code data untuk produk
function generateQRCode(sku) {
  try {
    const masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Produk");
    const data = masterSheet.getDataRange().getValues();
    
    // Cari produk berdasarkan SKU
    let namaProduk = "";
    let productURL = "";
    let found = false;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === sku) {  // Kolom SKU
        namaProduk = data[i][1];  // Kolom Nama Produk
        found = true;
        break;
      }
    }
    
    if (!found) {
      return {
        success: false,
        message: "Produk dengan SKU " + sku + " tidak ditemukan!"
      };
    }
    
    // Generate URL produk (Web App URL dengan query parameter SKU)
    const webAppURL = ScriptApp.getService().getUrl();
    productURL = webAppURL + "?sku=" + sku;
    
    return {
      success: true,
      message: "Data produk diambil untuk generate QR Code",
      data: {
        sku: sku,
        nama: namaProduk,
        url: productURL
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}

// --- BARCODE SCANNING FUNCTIONS (FULL IMPLEMENTATION) ---

// Verify barcode SKU exists
function verifyBarcodeSKU(sku) {
  try {
    const masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Produk");
    const data = masterSheet.getDataRange().getValues();
    
    // Cari produk berdasarkan SKU (barcode)
    let found = false;
    let namaProduk = "";
    let kategori = "";
    let satuan = "";
    let hargaBeli = 0;
    let hargaJual = 0;
    let minStok = 0;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === sku) {  // Kolom SKU
        namaProduk = data[i][1];  // Kolom Nama Produk
        kategori = data[i][2];    // Kolom Kategori
        satuan = data[i][3];      // Kolom Satuan
        hargaBeli = data[i][4];   // Kolom Harga Beli
        hargaJual = data[i][5];   // Kolom Harga Jual
        minStok = data[i][7];     // Kolom Minimum Stok
        found = true;
        break;
      }
    }
    
    if (!found) {
      return {
        success: false,
        message: "Barcode SKU " + sku + " tidak ditemukan di database!"
      };
    }
    
    return {
      success: true,
      message: "Barcode SKU valid",
      data: {
        sku: sku,
        nama: namaProduk,
        kategori: kategori,
        satuan: satuan,
        hargaBeli: hargaBeli,
        hargaJual: hargaJual,
        minStok: minStok
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}
