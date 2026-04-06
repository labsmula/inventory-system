# Scripts Folder Structure - Version Management (Updated)

**Mula Inventory System**
**Date:** 2026-04-06
**Status:** Version Folders Organized

---

## 📁 Folder Structure

```
scripts/
├── Code.gs                    (Latest Version - Symlink to v1.2.1)
├── Index.html                  (Latest Version - Symlink to v1.2.1)
├── v1.0.0/                   (Core Features - Phase 1-4 Complete)
│   ├── Code.gs
│   └── Index.html
├── v1.1.0/                   (QR Code & Barcode Scanning Complete)
│   ├── Code.gs
│   └── Index.html
├── v1.2.0/                   (Modern Dashboard - Modular Design - Blank Page Issue)
│   ├── Code.gs
│   ├── Index.html
│   ├── Dashboard.html          (Removed - caused blank page)
│   ├── Products.html          (Removed - caused blank page)
│   ├── Transactions.html      (Removed - caused blank page)
│   ├── Reports.html            (Removed - caused blank page)
│   └── Settings.html           (Removed - caused blank page)
├── v1.2.1/                   (Single File Design - All Pages CRUD Complete)
│   ├── Code.gs
│   └── Index.html
├── v1.3.0/                   (Future: Interactive Features - Not Started)
└── v1.4.0/                   (Future: Advanced Analytics - Not Started)
```

---

## 🎯 Version Breakdown

### v1.0.0 (Core Features)
**Status:** Complete ✅
**Files:** `Code.gs`, `Index.html`
**Features:**
- Google Sheets Native (4 sheets)
- Google Apps Script Integration (5 functions)
- Custom UI (Form + Dashboard)
- Dashboard Widgets (Total, Low Stock, Out of Stock, Value)
- Email notification system
- Complete documentation (5 files)
- Single file design (monolith)

### v1.1.0 (QR Code & Barcode Scanning)
**Status:** Complete ✅
**Files:** `Code.gs`, `Index.html`
**Features:**
- QR Code Generation (Generate QR codes for products)
- Barcode Scanning (Scan barcodes via camera)
- qrcode.js Integration (QR code generation)
- QuaggaJS Integration (Barcode scanning)
- Complete documentation (QR_BARCODE.md)
- Single file design (monolith)

### v1.2.0 (Modern Dashboard - Modular Design)
**Status:** Abandoned ❌ (Loading & Blank Page Issue)
**Files:** `Code.gs`, `Index.html` (PLUS: Modular HTML files)
**Features:**
- Modern dashboard UI with sidebar navigation
- KPI cards with trend indicators (4 metrics)
- Charts Section (Stock Trend, Category Distribution)
- Alerts & Insights (auto-populated)
- Recent Activity Feed (timeline)
- Add Product Modal
- QR Code Modal
- **ISSUE:** Multiple HTML files caused loading & blank page issue
- **RESOLUTION:** Reverted to single file design in v1.2.1

### v1.2.1 (Single File Design - All Pages CRUD)
**Status:** Complete ✅
**Files:** `Code.gs`, `Index.html`
**Features:**
- Single file design (all views in one Index.html)
- All 5 views (Dashboard, Products, Transactions, Reports, Settings)
- JavaScript view switching (show/hide sections)
- Full CRUD functionality for all pages:
  - **Dashboard:** KPI cards, charts (stock trend, category distribution), alerts, insights, recent activity feed
  - **Products:** Search, filter, pagination, Add Product, Edit (placeholder), QR Code, Delete (placeholder)
  - **Transactions:** Tabs (All, Stock In, Stock Out), summary stats, history table, filters, pagination
  - **Reports:** Report types (Inventory, Transaction, Valuation, Low Stock), summary stats, charts
  - **Settings:** General, Notifications, Integrations (placeholder), Account, Save, Export (JSON), Logout (placeholder)
- QR Code Generation (functional)
- Barcode Scanning (placeholder)
- Responsive Design (mobile sidebar toggle, grid layouts)
- Notification System (success/error messages)
- Loading States (spinner for async operations)
- Modals (Add Product, QR Code)
- Chart.js integration (charts for dashboard & reports)
- qrcode.js integration (QR code generation)
- QuaggaJS integration (barcode scanning - placeholder)
- Font Awesome integration (icons)
- Google Fonts integration (Poppins, Open Sans, Lato)

### v1.3.0 (Interactive Features - Future)
**Status:** Not Started 🚧
**Files:** `Code.gs`, `Index.html` (to be created)
**Planned Features:**
- Real-time data updates (30s auto-refresh)
- Interactive Charts with drill-down
- Quick Actions with keyboard shortcuts
- Smart Search & Filters
- Multi-User Support

### v1.4.0 (Advanced Analytics - Future)
**Status:** Not Started 🚧
**Files:** `Code.gs`, `Index.html` (to be created)
**Planned Features:**
- Predictive Stock Forecasting
- Advanced Reports (PDF export)
- Dashboard Personalization
- Multi-Dashboard Support

---

## 🎯 Deployment Strategy

### Current Version (Active): v1.2.1
- **Web App URL:** https://script.google.com/macros/s/AKfycbwCMBkdhSsMrMQpY7tZzT1V5dZbKLLmlurVtjUjYlpxEzUju_ozhdSx6V-xmIXz6M_Aew/exec
- **Deployment:** v1.2.1 (Single File Design)
- **Root Files:** `scripts/Code.gs` (v1.2.1), `scripts/Index.html` (v1.2.1)

### Upcoming Versions:
- **v1.3.0:** Interactive Features (Not Started)
- **v1.4.0:** Advanced Analytics (Not Started)

---

## 📋 Version File Details

### v1.0.0
- **Code.gs:** Backend functions (7 functions)
- **Index.html:** Single file (Form + Dashboard)
- **Size:** ~15KB
- **Tech:** Google Sheets + Google Apps Script + HTML/CSS/JS

### v1.1.0
- **Code.gs:** Backend functions (9 functions)
- **Index.html:** Single file (Form + Dashboard + QR Code + Barcode Scanning)
- **Size:** ~18KB
- **Tech:** Google Sheets + Google Apps Script + HTML/CSS/JS + qrcode.js + QuaggaJS

### v1.2.0
- **Code.gs:** Backend functions (11 functions)
- **Index.html:** Single file (Main loader)
- **Modular Files (5):** Dashboard.html, Products.html, Transactions.html, Reports.html, Settings.html
- **Total Size:** ~100KB
- **Tech:** Google Sheets + Google Apps Script + HTML/CSS/JS + Chart.js + qrcode.js + QuaggaJS + Font Awesome + Google Fonts
- **Status:** Abandoned (Loading & Blank Page Issue)

### v1.2.1
- **Code.gs:** Backend functions (11 functions)
- **Index.html:** Single file (All 5 views + JavaScript view switching)
- **Size:** ~78KB (HTML) + 21KB (Code.gs) = ~99KB total
- **Tech:** Google Sheets + Google Apps Script + HTML/CSS/JS + Chart.js + qrcode.js + QuaggaJS + Font Awesome + Google Fonts
- **Status:** Production Ready (All Pages CRUD Complete)

---

## 🚀 Migration Path

### v1.0.0 → v1.1.0 (Completed)
- No data migration required (Google Sheets data compatible)
- Update `scripts/Code.gs` with new functions (QR Code, Barcode Scanning)
- Update `scripts/Index.html` with libraries and UI
- Re-deploy Web App (New Deployment required)

### v1.1.0 → v1.2.0 (Abandoned)
- v1.2.0 modular design did not work (Google Apps Script limitation)
- Skipped v1.2.0 deployment due to loading & blank page issue
- Direct migration to v1.2.1

### v1.1.0 → v1.2.1 (Completed)
- No data migration required (Google Sheets data compatible)
- Update `scripts/Code.gs` with new functions (Dashboard: Trends, Category, Activity)
- Update `scripts/Index.html` with modern dashboard UI (single file)
- Re-deploy Web App (New Deployment required)

---

## 🔧 Development Workflow

### 1. Create New Version
1. Copy `scripts/Code.gs` and `scripts/Index.html` to new version folder (e.g., `scripts/v1.3.0/`)
2. Implement new features in `scripts/v1.3.0/Code.gs` and `scripts/v1.3.0/Index.html`
3. Test new version locally
4. If successful, copy back to root `scripts/`
5. Re-deploy Web App

### 2. Rollback Strategy
- If issues arise, copy files from previous version folder (e.g., `scripts/v1.2.1/`)
- Re-deploy Web App with previous version
- No data loss (Google Sheets data independent of scripts)

---

## 📝 Notes

- **Root files (`scripts/Code.gs`, `scripts/Index.html`) are always symlinks to current version** (v1.2.1)
- **Version folders** contain complete code for each release
- **v1.2.0 modular files (Dashboard.html, Products.html, etc.) are abandoned and should not be used**
- **Backwards compatibility maintained** between versions
- **Data migration** not required between versions (Google Sheets data structure unchanged)

---

**Last Updated:** 2026-04-06
**Current Version:** v1.2.1 (Single File Design)
**Planning Version:** v1.3.0 (Interactive Features)
