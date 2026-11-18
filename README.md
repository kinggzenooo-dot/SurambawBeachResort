# 🌊 Surambaw Beach Resort - Unified Web Application Suite

A full-stack, responsive luxury resort management system for **Surambaw Beach Resort**, featuring a single-entry unified portal, Python Flask backend, SQLite database persistence, and synchronized role interfaces for **Guests (Customers)**, **Staff (Front Desk)**, and **Administrators (Executive Management)**.

---

## ✨ Features & Architecture

### 1. 🔗 Unified Single-Link Portal (`/`)
- Access **all 3 portals** from **one single URL** without separate disconnected links.
- **Universal Auth Bar**:
  - Displays the active role mode (`Guest`, `Staff Desk`, `Admin`).
  - **1-Click Instant Role Switcher** buttons to test and transition between Guest, Staff, and Admin views with one click.
  - Active user profile avatar and name.
  - Interactive **Sign In & Registration Modal** with instant demo 1-click credentials.
  - **Logout confirmation dialog** with session clearing.

### 2. 🏖️ Customer / Guest Portal (`customer.html` / `index.html`)
- **Home**: Resort overview, live island weather & tide widget, quick stats, quick booking bar, featured villas/amenities.
- **Browse**: Filter by category (*Rooms, Cottages, Villas, Amenities/Add-ons*), price slider, capacity filter, keyword search, and detail modal.
- **Booking Cart**: Selected items, date pickers (*Check-in, Check-out*), guest count, nights calculation, quantity controls, promo code discount (`SURAMBAW10`), tax & fees, and instant checkout.
- **My Reservations**: Active vs previous stay history, status tracking (*Confirmed, Checked-in, Checked-out*), and printable digital QR code E-Vouchers.
- **Profile**: Personal info, contact details, account settings, Gold VIP status privileges.

### 3. 🛎️ Staff & Front Desk Portal (`staff.html`)
- **Operations Dashboard**: Today's Arrivals (Check-ins queue), Today's Departures (Check-outs queue), occupancy rate (75%), and recent reservations.
- **Reservation Desk**: Front Desk booking wizard with guest search/creation, accommodation selection, add-on checklist, date pickers, special requests, subtotal, tax/fee calculation, payment recording, and balance tracking.
- **Reservations Manager**: Search and filter by status (*Pending, Confirmed, Checked-in, Checked-out, Cancelled*), update status in real-time.
- **Guest CRM**: Search guests, view profile drawer, stay history, and `+ Add Guest` modal.
- **Accommodations Inspector**: Real-time room status (*Available, Occupied, Maintenance*), rates, capacity, and housekeeping tracker.

### 4. 👑 Executive Admin Portal (`admin.html`)
- **Executive Dashboard**: KPI metrics (*Total Revenue, Total Bookings, Average Booking Value, Completed Stays*), accommodation rankings, low-stock alerts, and recent activity log.
- **Booking Management**: Full reservations oversight and status workflows.
- **Resort Management**: Catalog manager for Accommodations, Category definitions, and Seasonal Rate schedules (Peak vs Low season).
- **Inventory Control**: Live stock tracking (*In Stock, Low Stock, Out of Stock*), `+ Add Stock` / `- Deduct Stock` modal, and stock history log.
- **Finance & Analytics**: Revenue breakdown by timeframe (*Today, This Week, This Month, Custom*), PDF report generator, and category performance matrix.
- **Staff Access Control**: Manage staff accounts and role privileges.

### 5. 🐍 Python Flask Backend (`app.py`) & Real-Time Sync
- **RESTful APIs**:
  - `POST /api/auth/login`: Authenticate email/password or 1-click role demo.
  - `POST /api/auth/register`: Create new guest user account.
  - `GET /api/auth/me`: Check authenticated session.
  - `POST /api/auth/logout`: End session.
  - `GET /api/accommodations` & `POST /api/accommodations`: Room & villa inventory.
  - `GET /api/reservations` & `POST /api/reservations`: Live booking creation (synchronizes customer checkout to staff desk and admin revenue).
  - `PUT /api/reservations/<id>/status`: Status transitions (*Confirmed ➔ Checked-in ➔ Checked-out*).
  - `GET /api/inventory` & `POST /api/inventory/adjust`: Stock adjustments with activity logging.
  - `GET /api/stats`: Real-time KPI calculations.

---

## 🔑 Demo Accounts (1-Click Ready)

| Role | Name | Email | Password |
| :--- | :--- | :--- | :--- |
| **🏖️ Guest** | Alexander Wright | `guest@surambaw.com` | `guest123` |
| **🛎️ Staff Desk** | Maria Santos | `staff@surambaw.com` | `staff123` |
| **👑 Executive Admin** | Arthur Pendelton | `admin@surambaw.com` | `admin123` |

---

## 🎨 Theme Colors & Styling

| Palette Color | Hex Code | Role |
| :--- | :--- | :--- |
| **Navbar / Sidebar** | `#0B3954` | Deep Ocean |
| **Background** | `#F8F5EF` | Warm Off-White |
| **Cards** | `#FFFFFF` | Crisp White Cards |
| **Primary Buttons** | `#FF7F6A` | Coral (Hover: `#E96B59`) |
| **Secondary Buttons**| `#0B3954` | Deep Ocean |
| **Highlights** | `#F4E3C1` | Sand Gold |
| **Success / Available**| `#3BAA7C` | Emerald Green |
| **Text** | `#243B53` | Deep Navy |
| **Muted Text** | `#6B7280` | Gray |
| **Icons** | Custom SVG | Vector SVG icons used exclusively |

---

## 🚀 How to Run Locally

### 1. Requirements
- Python 3.8+
- Flask & Flask-CORS (`pip install Flask flask-cors`)

### 2. Start the Backend Server
```bash
python app.py
```

### 3. Open the Resort Application
Open your browser and navigate to:
```
http://localhost:5000/
```
- Click the **Guest**, **Staff Desk**, or **Admin** buttons on the top bar to switch roles instantly.
- Test making a booking in the Guest view, then switch to Staff or Admin to see the new reservation synchronized live!
