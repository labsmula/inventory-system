// Google Apps Script Backend untuk Mula Inventory System
// Version: 1.2.0 (Modern Dashboard Features)

// Serve HTML UI
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle("Mula Inventory System v1.2.0")
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
    
    stokSheet.getRange(rowIndex, 3, 1, 6).setValues([[
      existingData.stokAwal,
      newMasuk,
      newKeluar,
      stokBaru,
      stokBaru <= 0 ? "OUT OF STOCK" : "OK",
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

// --- DASHBOARD FUNCTIONS (v1.2.0) ---

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
    
    // Simple interpolation for previous days (assuming linear trend)
    // In production, this should use actual historical data from transaction logs
    for (let i = 0; i < trends.length; i++) {
      if (trends[i].totalStock === 0) {
        // Use next available data point
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
      
      // Add relative time (e.g., "2 hours ago")
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
