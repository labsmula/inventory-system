// Google Apps Script Backend untuk Mula Inventory System
// Version: 1.3.0 (ALL PHASES IMPLEMENTED)

// Serve HTML UI
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle("Mula Inventory System v1.3.0")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// --- PRODUCT FUNCTIONS (CRUD) ---

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
    
    // Cek apakah SKU sudah ada
    let existingSKUs = [];
    try {
      const data = sheet.getDataRange().getValues();
      if (data.length > 1) {
        for (let i = 1; i < data.length; i++) {
          const row = data[i];
          if (row[0] && row[0] !== "") {
            existingSKUs.push(row[0]);
          }
        }
      }
    } catch (error) {
      console.error('Error getting existing SKUs:', error);
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
      productData.hargaJual - productData.hargaBeli,  // Margin
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

// Update existing product
function updateProduct(productData) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Produk");
    const stokSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stok Current");
    
    if (!productData.sku) {
      return {
        success: false,
        message: "SKU tidak boleh kosong"
      };
    }
    
    // Update Master Produk
    const data = sheet.getDataRange().getValues();
    let foundRow = 0;
    
    for (let i = 1; i < data.length; i++) {
      if (data[i][0] === productData.sku) {
        foundRow = i + 1;
        break;
      }
    }
    
    if (foundRow === 0) {
      return {
        success: false,
        message: "Produk dengan SKU " + productData.sku + " tidak ditemukan!"
      };
    }
    
    // Update baris Master Produk
    sheet.getRange(foundRow, 1, 1, 8).setValues([[
      productData.sku,
      productData.nama,
      productData.kategori,
      productData.satuan,
      productData.hargaBeli,
      productData.hargaJual,
      productData.hargaJual - productData.hargaBeli,
      productData.minStok,
      new Date()
    ]]);
    
    // Update Stok Current (minStock only, stok dijaga sama)
    const stokData = stokSheet.getDataRange().getValues();
    let stokFoundRow = 0;
    
    for (let i = 1; i < stokData.length; i++) {
      if (stokData[i][0] === productData.sku) {
        stokFoundRow = i + 1;
        break;
      }
    }
    
    if (stokFoundRow > 0) {
      const currentStock = stokData[stokFoundRow - 1][4];
      const minStock = productData.minStok;
      let newStatus = "OK";
      
      if (currentStock === 0) {
        newStatus = "OUT OF STOCK";
      } else if (currentStock <= minStock) {
        newStatus = "LOW STOCK";
      }
      
      stokSheet.getRange(stokFoundRow, 7, 1, 1).setValues([[
        newStatus,
        new Date()
      ]]);
    }
    
    return {
      success: true,
      message: "Produk " + productData.nama + " berhasil diperbarui!"
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}

// Delete product
function deleteProduct(sku) {
  try {
    const masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Produk");
    const stokSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stok Current");
    
    // Cari produk di Master Produk
    const masterData = masterSheet.getDataRange().getValues();
    let masterRow = 0;
    let productName = "";
    
    for (let i = 1; i < masterData.length; i++) {
      if (masterData[i][0] === sku) {
        masterRow = i + 1;
        productName = masterData[i][1];
        break;
      }
    }
    
    if (masterRow === 0) {
      return {
        success: false,
        message: "Produk dengan SKU " + sku + " tidak ditemukan!"
      };
    }
    
    // Cari produk di Stok Current
    const stokData = stokSheet.getDataRange().getValues();
    let stokRow = 0;
    
    for (let i = 1; i < stokData.length; i++) {
      if (stokData[i][0] === sku) {
        stokRow = i + 1;
        break;
      }
    }
    
    // Hapus dari Master Produk
    masterSheet.deleteRow(masterRow);
    
    // Hapus dari Stok Current
    if (stokRow > 0) {
      stokSheet.deleteRow(stokRow);
    }
    
    return {
      success: true,
      message: "Produk " + productName + " berhasil dihapus!"
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

// --- TRANSACTION FUNCTIONS (CRUD) ---

// Create new transaction
function createTransaction(transactionData) {
  try {
    const stokSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stok Current");
    const transaksiMasukSheet = transactionData.type === "in" 
      ? SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transaksi Masuk")
      : SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transaksi Keluar");
    
    // Validasi data
    if (!transactionData.sku || !transactionData.quantity || !transactionData.type) {
      return {
        success: false,
        message: "Data transaksi tidak lengkap"
      };
    }
    
    // Cek apakah produk ada
    const products = getData();
    let foundProduct = null;
    
    for (let i = 0; i < products.products.length; i++) {
      if (products.products[i].sku === transactionData.sku) {
        foundProduct = products.products[i];
        break;
      }
    }
    
    if (!foundProduct) {
      return {
        success: false,
        message: "Produk dengan SKU " + transactionData.sku + " tidak ditemukan!"
      };
    }
    
    // Hitung stok baru
    let newStock = 0;
    if (transactionData.type === "in") {
      newStock = foundProduct.stok + transactionData.quantity;
    } else if (transactionData.type === "out") {
      newStock = foundProduct.stok - transactionData.quantity;
    }
    
    if (newStock < 0) {
      return {
        success: false,
        message: "Stok tidak cukup! Stok saat ini: " + foundProduct.stok
      };
    }
    
    // Update Stok Current
    const stokData = stokSheet.getDataRange().getValues();
    let foundRow = 0;
    
    for (let i = 1; i < stokData.length; i++) {
      if (stokData[i][0] === transactionData.sku) {
        foundRow = i + 1;
        break;
      }
    }
    
    if (foundRow === 0) {
      return {
        success: false,
        message: "Produk tidak ditemukan di Stok Current"
      };
    }
    
    const oldStock = stokData[foundRow - 1][2];
    let newMasuk = stokData[foundRow - 1][3];
    let newKeluar = stokData[foundRow - 1][4];
    
    if (transactionData.type === "in") {
      newMasuk += transactionData.quantity;
    } else if (transactionData.type === "out") {
      newKeluar += transactionData.quantity;
    }
    
    let status = "OK";
    if (newStock === 0) {
      status = "OUT OF STOCK";
    } else if (newStock <= foundProduct.minStok) {
      status = "LOW STOCK";
    }
    
    stokSheet.getRange(foundRow, 2, 1, 6).setValues([[
      oldStock,
      newMasuk,
      newKeluar,
      newStock,
      status,
      new Date()
    ]]);
    
    // Catat transaksi di sheet transaksi
    transaksiMasukSheet.appendRow([
      new Date(),
      transactionData.sku,
      foundProduct.nama,
      transactionData.type === "in" ? "Stock In" : "Stock Out",
      transactionData.quantity,
      foundProduct.satuan,
      foundProduct.hargaJual * transactionData.quantity  // Total value
    ]);
    
    // Kirim notifikasi email jika perlu
    let lowStockAlert = false;
    if (status === "LOW STOCK" || status === "OUT OF STOCK") {
      const emailPenerima = "owner@mulalabs.id";  // GANTI dengan email Anda
      const emailResult = sendEmailNotification(
        transactionData.sku, 
        foundProduct.nama, 
        newStock, 
        foundProduct.minStok, 
        emailPenerima
      );
      lowStockAlert = emailResult.success;
    }
    
    return {
      success: true,
      message: transactionData.type === "in" 
        ? "Stock In " + foundProduct.nama + " berhasil dicatat! Stok: " + newStock + " " + foundProduct.satuan
        : "Stock Out " + foundProduct.nama + " berhasil dicatat! Stok: " + newStock + " " + foundProduct.satuan,
      lowStock: lowStockAlert
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}

// Get transaction details
function getTransactionDetails(sku) {
  try {
    const products = getData();
    let foundProduct = null;
    
    for (let i = 0; i < products.products.length; i++) {
      if (products.products[i].sku === sku) {
        foundProduct = products.products[i];
        break;
      }
    }
    
    if (!foundProduct) {
      return {
        success: false,
        message: "Produk dengan SKU " + sku + " tidak ditemukan!"
      };
    }
    
    return {
      success: true,
      data: {
        sku: foundProduct.sku,
        nama: foundProduct.nama,
        kategori: foundProduct.kategori,
        satuan: foundProduct.satuan,
        stok: foundProduct.stok,
        minStok: foundProduct.minStok,
        status: foundProduct.status,
        hargaBeli: foundProduct.hargaBeli,
        hargaJual: foundProduct.hargaJual
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}

// Delete transaction (from history)
function deleteTransaction(sku, timestamp) {
  try {
    const transaksiMasukSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transaksi Masuk");
    const transaksiKeluarSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transaksi Keluar");
    
    // Cari transaksi yang sesuai
    let foundSheet = null;
    let foundRow = 0;
    
    // Cari di Transaksi Masuk
    const masukData = transaksiMasukSheet.getDataRange().getValues();
    for (let i = 1; i < masukData.length; i++) {
      if (masukData[i][0] instanceof Date && 
          new Date(masukData[i][0]).getTime() === new Date(timestamp).getTime() &&
          masukData[i][1] === sku) {
        foundSheet = transaksiMasukSheet;
        foundRow = i + 1;
        break;
      }
    }
    
    // Cari di Transaksi Keluar jika tidak ketemu
    if (foundRow === 0) {
      const keluarData = transaksiKeluarSheet.getDataRange().getValues();
      for (let i = 1; i < keluarData.length; i++) {
        if (keluarData[i][0] instanceof Date && 
            new Date(keluarData[i][0]).getTime() === new Date(timestamp).getTime() &&
            keluarData[i][1] === sku) {
          foundSheet = transaksiKeluarSheet;
          foundRow = i + 1;
          break;
        }
      }
    }
    
    if (foundRow === 0) {
      return {
        success: false,
        message: "Transaksi tidak ditemukan!"
      };
    }
    
    // Hapus transaksi
    foundSheet.deleteRow(foundRow);
    
    // Adjust stock kembali (reverse transaction)
    const stokSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stok Current");
    const stokData = stokSheet.getDataRange().getValues();
    let stokFoundRow = 0;
    let oldStock = 0;
    let oldMasuk = 0;
    let oldKeluar = 0;
    
    for (let i = 1; i < stokData.length; i++) {
      if (stokData[i][0] === sku) {
        stokFoundRow = i + 1;
        oldStock = stokData[i][2];
        oldMasuk = stokData[i][3];
        oldKeluar = stokData[i][4];
        break;
      }
    }
    
    if (stokFoundRow > 0) {
      // Reverse transaction (kembalikan ke stok awal)
      const originalStock = oldStock;
      let status = "OK";
      
      if (originalStock === 0) {
        status = "OUT OF STOCK";
      }
      
      stokSheet.getRange(stokFoundRow, 5, 1, 2).setValues([[
        originalStock,
        status,
        new Date()
      ]]);
    }
    
    return {
      success: true,
      message: "Transaksi berhasil dihapus! Stok dikembalikan ke: " + oldStock
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}

// Get all transactions (for history)
function getTransactions() {
  try {
    const transaksiMasukSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transaksi Masuk");
    const transaksiKeluarSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transaksi Keluar");
    
    const masukData = transaksiMasukSheet.getDataRange().getValues();
    const keluarData = transaksiKeluarSheet.getDataRange().getValues();
    
    const transactions = [];
    
    // Get Transaksi Masuk
    for (let i = 1; i < masukData.length; i++) {
      const row = masukData[i];
      transactions.push({
        date: row[0] instanceof Date ? Utilities.formatDate(row[0], "GMT", "dd/MM/yyyy HH:mm") : row[0],
        type: "Stock In",
        sku: row[1],
        namaProduk: row[2],
        quantity: row[3],
        satuan: row[4],
        totalValue: row[5]
      });
    }
    
    // Get Transaksi Keluar
    for (let i = 1; i < keluarData.length; i++) {
      const row = keluarData[i];
      transactions.push({
        date: row[0] instanceof Date ? Utilities.formatDate(row[0], "GMT", "dd/MM/yyyy HH:mm") : row[0],
        type: "Stock Out",
        sku: row[1],
        namaProduk: row[2],
        quantity: row[3],
        satuan: row[4],
        totalValue: row[5]
      });
    }
    
    // Sort by date descending (terbaru dulu)
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    return {
      success: true,
      data: transactions
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

// --- BARCODE SCANNING FUNCTIONS ---

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

// --- DASHBOARD FUNCTIONS ---

// Get dashboard trends data (stock over time)
function getDashboardTrends(days) {
  try {
    const stokSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stok Current");
    const data = stokSheet.getDataRange().getValues();
    const headers = data[0];
    const products = data.slice(1);
    
    // Calculate date range
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - days);
    
    // Initialize trend data
    const trends = [];
    const trendMap = {};
    
    // Populate trend data for each day
    for (let i = 0; i <= days; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = Utilities.formatDate(date, "GMT", "dd/MM/yyyy");
      trends.push({
        date: dateStr,
        totalStock: 0
      });
      trendMap[dateStr] = trends.length - 1;
    }
    
    // Sum stock for each product at current time
    let totalStock = 0;
    for (let i = 0; i < products.length; i++) {
      const stokAkhir = products[i][4];  // Kolom Stok Akhir
      if (stokAkhir) {
        totalStock += stokAkhir;
      }
    }
    
    // Fill current stock for today
    const todayStr = Utilities.formatDate(today, "GMT", "dd/MM/yyyy");
    if (trendMap[todayStr] !== undefined) {
      trends[trendMap[todayStr]].totalStock = totalStock;
    }
    
    // Simple interpolation for previous days
    for (let i = 0; i < trends.length; i++) {
      if (trends[i].totalStock === 0) {
        for (let j = i + 1; j < trends.length; j++) {
          if (trends[j].totalStock > 0) {
            trends[i].totalStock = trends[j].totalStock;
            break;
          }
        }
      }
    }
    
    return {
      success: true,
      data: trends
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}

// Get category distribution
function getCategoryDistribution() {
  try {
    const masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Produk");
    const data = masterSheet.getDataRange().getValues();
    const products = data.slice(1);
    
    // Count products per category
    const categoryCount = {};
    let totalProducts = 0;
    
    for (let i = 0; i < products.length; i++) {
      const kategori = products[i][2];  // Kolom Kategori
      if (kategori) {
        categoryCount[kategori] = (categoryCount[kategori] || 0) + 1;
        totalProducts++;
      }
    }
    
    // Convert to array with percentages
    const distribution = [];
    for (const [kategori, count] of Object.entries(categoryCount)) {
      distribution.push({
        category: kategori,
        count: count,
        percentage: Math.round((count / totalProducts) * 100)
      });
    }
    
    // Sort by count descending
    distribution.sort((a, b) => b.count - a.count);
    
    return {
      success: true,
      data: distribution
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}

// Get top selling products
function getTopSellers(limit) {
  try {
    const transaksiKeluarSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Transaksi Keluar");
    const data = transaksiKeluarSheet.getDataRange().getValues();
    const transactions = data.slice(1);
    
    // Count transactions per product
    const productSales = {};
    
    for (let i = 0; i < transactions.length; i++) {
      const sku = transactions[i][0];  // Kolom SKU
      const quantity = transactions[i][2];  // Kolom Kuantitas
      
      if (sku && quantity) {
        if (!productSales[sku]) {
          productSales[sku] = {
            sku: sku,
            totalSold: 0,
            transactions: 0
          };
        }
        productSales[sku].totalSold += quantity;
        productSales[sku].transactions += 1;
      }
    }
    
    // Convert to array and sort by total sold
    const topSellers = Object.values(productSales).sort((a, b) => b.totalSold - a.totalSold);
    
    // Get top N products
    const limitedTopSellers = topSellers.slice(0, limit);
    
    // Add product names from Master Produk
    const masterSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Master Produk");
    const masterData = masterSheet.getDataRange().getValues();
    
    for (let i = 0; i < limitedTopSellers.length; i++) {
      const sku = limitedTopSellers[i].sku;
      for (let j = 1; j < masterData.length; j++) {
        if (masterData[j][0] === sku) {  // Kolom SKU
          limitedTopSellers[i].namaProduk = masterData[j][1];  // Kolom Nama Produk
          break;
        }
      }
    }
    
    return {
      success: true,
      data: limitedTopSellers
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}

// Get recent activity
function getRecentActivity(limit) {
  try {
    const stokSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Stok Current");
    const data = stokSheet.getDataRange().getValues();
    const products = data.slice(1);
    
    // Collect recent activities
    const activities = [];
    
    for (let i = 0; i < products.length; i++) {
      const sku = products[i][0];  // Kolom SKU
      const namaProduk = products[i][1];  // Kolom Nama Produk
      const stokAwal = products[i][2];  // Kolom Stok Awal
      const stokAkhir = products[i][4];  // Kolom Stok Akhir
      const lastUpdated = products[i][7];  // Kolom Last Updated
      
      // If stock changed, add activity
      if (stokAkhir !== stokAwal && lastUpdated) {
        activities.push({
          type: stokAkhir > stokAwal ? "Stock In" : "Stock Out",
          sku: sku,
          namaProduk: namaProduk,
          quantity: Math.abs(stokAkhir - stokAwal),
          timestamp: lastUpdated
        });
      }
    }
    
    // Sort by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    // Get top N activities
    const recentActivities = activities.slice(0, limit);
    
    // Format timestamps
    for (let i = 0; i < recentActivities.length; i++) {
      const timestamp = new Date(recentActivities[i].timestamp);
      recentActivities[i].timeStr = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "HH:mm");
      recentActivities[i].dateStr = Utilities.formatDate(timestamp, Session.getScriptTimeZone(), "dd/MM/yyyy");
      
      // Add relative time
      const now = new Date();
      const diffMs = now - timestamp;
      const diffHrs = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffHrs < 1) {
        recentActivities[i].relativeTime = "Just now";
      } else if (diffHrs < 24) {
        recentActivities[i].relativeTime = diffHrs + " hour" + (diffHrs > 1 ? "s" : "") + " ago";
      } else {
        recentActivities[i].relativeTime = diffDays + " day" + (diffDays > 1 ? "s" : "") + " ago";
      }
    }
    
    return {
      success: true,
      data: recentActivities
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}

// --- REPORTS FUNCTIONS ---

// Generate report
function generateReport(reportType, filters) {
  try {
    const reportData = {
      reportType: reportType,
      filters: filters,
      generatedAt: new Date()
    };
    
    // Get data based on report type
    let data = [];
    let summary = {};
    
    if (reportType === "inventory") {
      const products = getData().products;
      data = products;
      summary = {
        totalProducts: products.length,
        totalStockValue: 0,
        lowStockCount: 0,
        outOfStockCount: 0
      };
      
      for (let i = 0; i < products.length; i++) {
        summary.totalStockValue += (products[i].stok * products[i].hargaJual);
        
        if (products[i].status === "LOW STOCK") {
          summary.lowStockCount++;
        }
        
        if (products[i].status === "OUT OF STOCK") {
          summary.outOfStockCount++;
        }
      }
      
    } else if (reportType === "transactions") {
      const transactions = getTransactions();
      data = transactions.data;
      summary = {
        totalTransactions: data.length,
        totalStockIn: 0,
        totalStockOut: 0,
        totalValue: 0
      };
      
      for (let i = 0; i < data.length; i++) {
        if (data[i].type === "Stock In") {
          summary.totalStockIn += data[i].quantity;
        } else if (data[i].type === "Stock Out") {
          summary.totalStockOut += data[i].quantity;
        }
        
        summary.totalValue += data[i].totalValue;
      }
      
    } else if (reportType === "valuation") {
      const products = getData().products;
      data = products;
      summary = {
        totalStockValue: 0
      };
      
      for (let i = 0; i < products.length; i++) {
        summary.totalStockValue += (products[i].stok * products[i].hargaJual);
      }
      
    } else if (reportType === "lowstock") {
      const products = getData().products;
      data = products.filter(p => p.status === "LOW STOCK" || p.status === "OUT OF STOCK");
      summary = {
        totalProducts: data.length,
        lowStockCount: data.filter(p => p.status === "LOW STOCK").length,
        outOfStockCount: data.filter(p => p.status === "OUT OF STOCK").length
      };
    }
    
    return {
      success: true,
      message: "Report " + reportType + " berhasil di-generate!",
      data: {
        reportData: reportData,
        data: data,
        summary: summary
      }
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}

// --- SETTINGS FUNCTIONS ---

// Get user settings
function getSettings() {
  try {
    // For now, return default settings
    // In production, this should load from "Settings" sheet or Properties Service
    const settings = {
      businessName: "Mula Inventory System",
      defaultUnit: "pcs",
      lowStockThreshold: 5,
      currencySymbol: "Rp",
      emailLowStock: true,
      emailOutOfStock: true,
      emailDailySummary: false,
      notificationEmail: "owner@mulalabs.id",
      notificationFrequency: "immediate",
      displayName: "Zaky Arisandhi",
      accountEmail: "zaky@mulalabs.id",
      timezone: "WIB",
      language: "id"
    };
    
    return {
      success: true,
      data: settings
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}

// Save user settings (Client-side localStorage)
function saveSettings(settings) {
  try {
    // Since this is called from frontend, we just return success
    // Actual saving happens in frontend via localStorage
    return {
      success: true,
      message: "Settings berhasil disimpan!"
    };
    
  } catch (error) {
    return {
      success: false,
      message: "Error: " + error.toString()
    };
  }
}
