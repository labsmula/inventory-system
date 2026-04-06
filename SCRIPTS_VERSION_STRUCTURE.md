# Scripts Folder Structure - Version Management

**Mula Inventory System**
**Date:** 2026-04-06

---

## 📁 Folder Structure

```
scripts/
├── Code.gs                    (Latest version - Symlink to current)
├── Index.html                  (Latest version - Symlink to current)
├── v1.0.0/                   (Core Features - Phase 1-4)
│   ├── Code.gs
│   └── Index.html
├── v1.1.0/                   (QR Code & Barcode Scanning)
│   ├── Code.gs
│   └── Index.html
├── v1.2.0/                   (Modern Dashboard - Planning Phase)
│   ├── Code.gs                (To Be Updated)
│   └── Index.html              (To Be Updated)
├── v1.3.0/                   (Future: Interactive Features)
└── v1.4.0/                   (Future: Advanced Analytics)
```

---

## 🎯 Version Breakdown

### v1.0.0 (Core Features)
**Status:** Complete ✅
**Features:**
- Google Sheets Native (4 sheets)
- Google Apps Script Integration (5 functions)
- Custom UI (Form + Dashboard)
- Dashboard Widgets (Total, Low Stock, Out of Stock, Value)
- Email Notification System
- Complete Documentation (5 files)

**Files:**
- `scripts/v1.0.0/Code.gs`
- `scripts/v1.0.0/Index.html`

---

### v1.1.0 (QR Code & Barcode Scanning)
**Status:** Complete ✅
**Features:**
- QR Code Generation (Generate QR codes for products)
- Barcode Scanning (Scan barcodes via camera)
- qrcode.js Integration (QR code generation)
- QuaggaJS Integration (Barcode scanning)
- Complete Documentation (QR_BARCODE.md)

**Files:**
- `scripts/v1.1.0/Code.gs`
- `scripts/v1.1.0/Index.html`

---

### v1.2.0 (Modern Dashboard)
**Status:** Planning Phase 📝
**Features (Planned):**
- Sidebar Navigation (Dashboard, Products, Transactions, Reports, Settings)
- KPI Cards with Trend Indicators (Total Products, Low Stock, Out of Stock, Value)
- Charts Section (Stock Trend, Category Distribution, Top Selling Products)
- Alerts & Insights (High Priority Alerts, Smart Recommendations)
- Recent Activity Feed (Timeline of stock updates)
- Quick Actions (Add Product, Stock In, Stock Out, Scan Barcode)
- Interactive Features (Real-time updates, Keyboard shortcuts)
- Smart Search (Global search with filters)
- Dashboard Personalization (Drag-and-drop widgets)

**Design Principles:**
- Growth Analyst: Data-driven, actionable insights, trend over snapshot
- Creative Director: Minimalist, modern, trustworthy, consistent branding

**Files:**
- `scripts/v1.2.0/Code.gs` (To Be Updated)
- `scripts/v1.2.0/Index.html` (To Be Updated)

---

### v1.3.0 (Interactive Features - Future)
**Status:** Not Started 🚧
**Features (Planned):**
- Real-time Data Updates (Auto-refresh every 30s)
- Interactive Charts (Drill-down, time range selector)
- Advanced Quick Actions (Keyboard shortcuts, modal pop-ups)
- Smart Search Enhanced (Advanced filters, saved searches)
- Multi-User Support (User roles, permissions)

---

### v1.4.0 (Advanced Analytics - Future)
**Status:** Not Started 🚧
**Features (Planned):**
- Predictive Stock Forecasting (AI/ML predictions)
- Advanced Reports (PDF export, scheduled reports)
- Dashboard Personalization (Custom layouts, widget selection)
- Multi-Dashboard Support (Different views per user role)
- Integrations (POS systems, accounting software)

---

## 🚀 Deployment Strategy

### Current Version (Active): v1.1.0
- **Web App URL:** https://script.google.com/macros/s/AKfycbwCMBkdhSsMrMQpY7tZzT1V5dZbKLLmlurVtjUjYlpxEzUju_ozhdSx6V-xmIXz6M_Aew/exec
- **Deployment:** v1.1.0 (QR Code & Barcode Scanning)

### Upcoming Versions:
- **v1.2.0:** Modern Dashboard (Planning Phase)
- **v1.3.0:** Interactive Features (Not Started)
- **v1.4.0:** Advanced Analytics (Not Started)

---

## 📋 Migration Path

### v1.1.0 → v1.2.0 (When Ready)
1. Update `scripts/v1.2.0/Code.gs` with new functions
2. Update `scripts/v1.2.0/Index.html` with modern dashboard UI
3. New Deployment in Apps Script Editor
4. Test new features
5. Roll out to users

### Rollback Strategy:
- If issues arise, rollback to `scripts/v1.1.0/` files
- Re-deploy v1.1.0
- No data loss (Google Sheets data independent of scripts)

---

## 📝 Notes

- **Root files (`Code.gs`, `Index.html`)** are symlinks to current version (v1.1.0)
- **Version folders** contain complete code for each release
- **Backwards compatibility** maintained between versions
- **Data migration** not required (Google Sheets data structure unchanged)

---

**Last Updated:** 2026-04-06
**Current Version:** v1.1.0
**Planning Version:** v1.2.0
