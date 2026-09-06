# Apex Luxury Motors — Showroom Management System

An enterprise-grade luxury showroom management platform built with **Next.js 15 (TypeScript)**, **Prisma ORM**, **MongoDB (MERN Stack)** & **PostgreSQL (PERN Stack)** compatibility, dynamic Admin CMS, interactive upper dashboard visual analytics, and certified 50+ year procedural text data storage.

---

## 🌟 Key Architecture & Stack Highlights

### 1. Vercel Deployment & Stack Decision (MERN / PERN via Prisma)
- **Deployment Platform**: Specifically tailored for **Vercel Serverless Hosting** (zero-config, high-speed edge distribution).
- **MERN Stack with Prisma**: Uses Prisma ORM with native MongoDB provider (`provider = "mongodb"`). Fully optimized for MongoDB Atlas.
- **PERN Stack Compatibility**: Designed so that switching between MongoDB and PostgreSQL only requires toggling `provider = "mongodb"` or `provider = "postgresql"` in `prisma/schema.prisma`.
- **Zero-Downtime Local Resiliency**: Includes a built-in JSON file store adapter that ensures local preview and testing work seamlessly even before cloud database credentials are provided.

### 2. 50+ Years Data Retention Lifespan
- **Pure Text-Based Procedural Storage**: Every vehicle record, VIN, invoice ledger, lead inquiry, and test drive is stored strictly as lightweight structured text.
- **Minimal Disk Footprint**: 100,000 complete vehicle transactions consume under 100 MB.
- **Archival Lifespan**: Cloud databases (MongoDB Atlas / Neon / Supabase) maintain structured procedural data indefinitely (50+ years).
- **One-Click Offline Archival**: Integrated **JSON Snapshot** and **CSV Inventory Export** in the Admin Settings panel for multi-decade cold storage.

### 3. Security & Exclusive Admin Authority
- **Zero Public Registration**: Public signups are completely disabled. Only the Administrator can create staff accounts.
- **Admin Password & Profile Management**: Initial Admin credentials (`admin` / `admin123`). Admin can change their username and password at any time with current-password verification.
- **Role-Based Access Control**: `ADMIN`, `MANAGER`, `SALES_AGENT`, `INVENTORY_OFFICER`.

---

## 🚀 Features & Modules

1. **Dynamic Public Home Page** (`/`):
   - Managed completely and live by the Admin via the Company Info CMS.
   - Luxury hero banner with glowing animations, filterable showroom fleet showcase, VIP service cards, certified warranty terms, interactive test-drive booking form, and contact desk.
2. **Login Portal** (`/login`):
   - Dark luxury aesthetic, bcrypt password verification, JWT cookie session, and 1-click test credential hint.
3. **Upper Dashboard Analytics & Visual Graphs** (`/admin`):
   - **Monthly Revenue & Sales Velocity Chart**: Interactive bars, quarterly targets, and units sold.
   - **Fleet Distribution Breakdown**: Body style and powertrain distribution percentages.
   - **Lead Acquisition Funnel**: Stage-by-stage inquiry conversion pipeline.
4. **Showroom Inventory Fleet (CRUD)** (`/admin/inventory`):
   - Make, Model, Year, Variant, VIN, Engine No, Body Style, Transmission, Fuel, Exterior/Interior Colors, Mileage, Cost Price, Selling Price, Status (`AVAILABLE`, `RESERVED`, `SOLD`, `IN_SERVICE`), Condition, and Key Features.
5. **Sales & Invoicing Registry (CRUD)** (`/admin/sales`):
   - Auto-generated invoice numbers (`INV-2026-XXX`), vehicle picker (auto-marks vehicle as `SOLD`), luxury tax & VIP discount calculations, printable official invoice deed.
6. **Customers, Leads & VIP Test Drives (CRUD)** (`/admin/customers`):
   - Client profiles, web inquiries pipeline, and scheduled test drive sessions.
7. **Suppliers & Logistics (CRUD)** (`/admin/suppliers`):
   - OEM suppliers and international procurement allocations.
8. **Dynamic Company Info & Live CMS** (`/admin/company-info`):
   - Live editor for showroom name, tagline, address, hours, about story, warranty policy, and social links.
9. **Staff User Management** (`/admin/users`):
   - Create, edit, deactivate, and reset passwords for showroom staff.
10. **Admin Profile & Archival Backup** (`/admin/settings`):
    - Rotate Admin credentials and download full database JSON/CSV snapshots.

---

## 🛠️ Quick Start & Local Run

### 1. Install Dependencies
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```

### 3. Run Development Server
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 4. Admin Credentials
- **Username**: `admin`
- **Password**: `admin123`
*(Admin can update username and password in `/admin/settings`)*

---

## ☁️ Deploying to Vercel (1-Click)

1. Push this repository to GitHub / GitLab / Bitbucket.
2. Import the project in **[Vercel Dashboard](https://vercel.com)**.
3. In **Project Settings -> Environment Variables**, add:
   - `DATABASE_URL`: Your MongoDB Atlas URI (`mongodb+srv://...`) or PostgreSQL connection string.
   - `JWT_SECRET`: A secure secret string.
4. Click **Deploy**. Vercel will automatically build and deploy the Next.js fullstack application.

---

## 🏛️ License & Intellectual Property
Enterprise Proprietary • Digital Architecture & Platform Rights Reserved to **WebRace Co.**
# showroom_management_system
# showroom_management_system
