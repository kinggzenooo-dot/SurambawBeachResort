import os
import sqlite3
import json
from datetime import datetime, date
from flask import Flask, request, jsonify, session, send_from_directory, render_template_string
from flask_cors import CORS

try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

APP_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(APP_DIR, 'resort.db')

# Supabase Connection Setup
SUPABASE_URL = os.environ.get('VITE_SUPABASE_URL') or os.environ.get('SUPABASE_URL') or 'https://cgssryoqqsfxwnirmxzb.supabase.co'
SUPABASE_KEY = os.environ.get('VITE_SUPABASE_ANON_KEY') or os.environ.get('SUPABASE_KEY') or 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnc3NyeW9xcXNmeHduaXJteHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ5ODAzMTksImV4cCI6MjExMDU1NjMxOX0.I8gQzyMn4c3LBVqpwKxlCsK1lGm2aRI6SoVsltKaD4s'

supabase = None
try:
    from supabase import create_client
    if SUPABASE_URL and SUPABASE_KEY:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        print("Connected to Supabase successfully:", SUPABASE_URL)
except Exception as e:
    print("Supabase connection fallback to SQLite:", e)

app = Flask(__name__, static_folder=APP_DIR)
app.secret_key = os.environ.get('SECRET_KEY', 'surambaw_beach_resort_secret_key_2026')
CORS(app)

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    cursor = conn.cursor()

    # Users Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL, -- 'customer', 'staff', 'admin'
            phone TEXT,
            address TEXT,
            tier TEXT DEFAULT 'Standard Guest',
            avatar TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Accommodations Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS accommodations (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            category TEXT NOT NULL, -- 'rooms', 'cottages', 'villas'
            type TEXT NOT NULL,
            tag TEXT,
            price REAL NOT NULL,
            price_period TEXT DEFAULT 'per night',
            rating REAL DEFAULT 4.9,
            reviews_count INTEGER DEFAULT 50,
            image TEXT,
            description TEXT,
            capacity INTEGER NOT NULL,
            sqm INTEGER,
            bed_type TEXT,
            view TEXT,
            amenities TEXT, -- JSON array
            status TEXT DEFAULT 'Available' -- 'Available', 'Occupied', 'Maintenance'
        )
    ''')

    # Addons Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS addons (
            id TEXT PRIMARY KEY,
            title TEXT NOT NULL,
            category TEXT DEFAULT 'addons',
            price REAL NOT NULL,
            price_period TEXT DEFAULT 'per service',
            icon TEXT,
            image TEXT,
            description TEXT
        )
    ''')

    # Reservations Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS reservations (
            id TEXT PRIMARY KEY,
            code TEXT UNIQUE NOT NULL,
            guest_id TEXT,
            guest_name TEXT NOT NULL,
            guest_email TEXT,
            guest_phone TEXT,
            accommodation_id TEXT,
            accommodation_name TEXT NOT NULL,
            category TEXT,
            check_in TEXT NOT NULL,
            check_out TEXT NOT NULL,
            nights INTEGER NOT NULL,
            guests_count INTEGER NOT NULL,
            addons_json TEXT DEFAULT '[]',
            subtotal REAL NOT NULL,
            tax REAL DEFAULT 0,
            discount REAL DEFAULT 0,
            total REAL NOT NULL,
            paid REAL DEFAULT 0,
            balance REAL DEFAULT 0,
            status TEXT DEFAULT 'Confirmed', -- 'Pending', 'Confirmed', 'Checked-in', 'Checked-out', 'Cancelled'
            special_requests TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')

    # Guests CRM Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS guests (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE,
            phone TEXT,
            address TEXT,
            tier TEXT DEFAULT 'Regular Guest',
            total_stays INTEGER DEFAULT 1,
            total_spent REAL DEFAULT 0,
            last_stay TEXT,
            status TEXT DEFAULT 'Active'
        )
    ''')

    # Inventory Table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS inventory (
            id TEXT PRIMARY KEY,
            sku TEXT,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            in_stock INTEGER NOT NULL,
            min_threshold INTEGER NOT NULL,
            unit TEXT NOT NULL,
            status TEXT NOT NULL -- 'In Stock', 'Low Stock', 'Out of Stock'
        )
    ''')

    # Inventory History
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS inventory_history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_name TEXT NOT NULL,
            action TEXT NOT NULL,
            staff TEXT NOT NULL,
            date TEXT NOT NULL
        )
    ''')

    # Check if seeded
    cursor.execute('SELECT COUNT(*) as count FROM users')
    if cursor.fetchone()['count'] == 0:
        seed_data(cursor)

    conn.commit()
    conn.close()

def seed_data(cursor):
    # 1. Seed Users
    users = [
        ('user-admin-01', 'Arthur Pendelton', 'admin@surambaw.com', 'admin123', 'admin', '+63 917 111 0001', 'Surambaw Executive Suite, Palawan', 'General Manager / Admin', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'),
        ('user-staff-01', 'Maria Santos', 'staff@surambaw.com', 'staff123', 'staff', '+63 917 222 0002', 'Staff Quarters Villa 4, Palawan', 'Senior Desk Supervisor', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'),
        ('user-guest-01', 'Alexander Wright', 'guest@surambaw.com', 'guest123', 'customer', '+63 917 555 8920', '88 Ocean Drive, Waterfront District, Manila', 'Surambaw Gold VIP', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'),
        ('user-guest-02', 'Sofia Rodriguez', 'sofia@example.com', 'guest123', 'customer', '+63 918 333 4455', 'Cebu City, Philippines', 'Surambaw Platinum VIP', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80')
    ]
    cursor.executemany('''
        INSERT INTO users (id, name, email, password, role, phone, address, tier, avatar)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', users)

    # 2. Seed Accommodations
    accommodations = [
        ('villa-overwater-01', 'Surambaw Royal Overwater Villa', 'villas', 'Villa', 'Signature Villa', 18500, 'per night', 4.98, 124, 
         'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
         'Direct ocean access villa with a private infinity glass pool, glass floor viewing pane, wrap-around sundeck, and 24/7 personal butler service.',
         4, 140, 'King Size + Daybed', 'Panoramic Ocean Horizon', json.dumps(['Private Infinity Pool', 'Direct Ocean Access', 'Glass Floor Viewing', 'Free High-speed Wi-Fi', '24/7 Butler Service', 'Espresso Machine', 'Outdoor Rain Shower', 'Jacuzzi Spa Bath']), 'Available'),
        
        ('villa-beachfront-02', 'Sunset Beachfront Villa', 'villas', 'Villa', 'Beachfront Luxury', 14200, 'per night', 4.95, 98,
         'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
         'Nestled directly on powdery white sand with private plunge pool, personal cabana, outdoor open-air garden bath, and sunset view.',
         4, 115, 'King Size Bed', 'Direct Sunset Beachfront', json.dumps(['Private Beach Plunge Pool', 'Personal Beach Cabana', 'Garden Rain Shower', 'Complimentary Minibar', 'Private Sun Loungers']), 'Available'),

        ('villa-family-03', 'Grand Family Ocean Villa', 'villas', 'Villa', 'Family Favorite', 22000, 'per night', 4.92, 76,
         'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
         'Spacious two-bedroom sanctuary designed for families and groups, featuring a sprawling pool patio, outdoor dining pavilion, and entertainment lounge.',
         8, 220, '2 King Beds + 2 Twin Beds', 'Lagoon & Ocean Coast', json.dumps(['Two Master Bedrooms', 'Private Lap Pool', 'Family Dining Pavilion', 'Chef-on-demand Kitchen', 'Kids Playground Access']), 'Available'),

        ('cottage-nipa-01', 'Traditional Nipa Beach Cottage', 'cottages', 'Cottage', 'Eco Tropical', 7500, 'per night', 4.88, 142,
         'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80',
         'Authentic island aesthetic built with polished bamboo and woven palm thatch, offering sea breeze ventilation, bamboo hammock, and beach trail.',
         2, 48, 'Queen Size Bamboo Bed', 'Tropical Beach Garden', json.dumps(['Authentic Bamboo Architecture', 'Private Veranda & Hammock', 'Ensuite Eco-Bathroom', 'Artisan Ceiling Fan', 'Daily Coconut Refreshments']), 'Available'),

        ('room-deluxe-01', 'Deluxe Ocean View Room', 'rooms', 'Room', 'Best Value', 5800, 'per night', 4.85, 210,
         'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80',
         'Contemporary island room featuring floor-to-ceiling glass doors opening onto a private balcony overlooking the turquoise waters of Surambaw Cove.',
         2, 42, 'King or Twin Beds', 'Unobstructed Cove View', json.dumps(['Private Ocean Balcony', 'Walk-in Marble Shower', 'Smart TV & Soundbar', 'Pillow Menu Selection', 'Coffee & Tea Bar']), 'Available'),

        ('room-lagoon-02', 'Premier Lagoon Access Room', 'rooms', 'Room', 'Direct Pool Access', 6900, 'per night', 4.91, 115,
         'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
         'Ground floor suite with direct swim-up access into the resort lagoon pool right from your private sun deck terrace.',
         3, 52, 'King Size + Sofa Bed', 'Lagoon Pool Swim-Up', json.dumps(['Direct Swim-Up Pool Terrace', 'Sun Deck Daybeds', 'Dual Vanity Bathroom', 'Welcome Tropical Fruit Basket']), 'Available')
    ]
    cursor.executemany('''
        INSERT INTO accommodations (id, title, category, type, tag, price, price_period, rating, reviews_count, image, description, capacity, sqm, bed_type, view, amenities, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', accommodations)

    # 3. Seed Addons
    addons = [
        ('addon-transfer-01', 'Luxury Speedboat Airport Transfer', 'addons', 3500, 'per roundtrip', 'ship', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80', 'Direct 25-minute VIP speedboat ride from mainland airport terminal straight to Surambaw private dock.'),
        ('addon-breakfast-02', 'Floating Champagne Breakfast', 'addons', 2800, 'per tray for 2', 'coffee', 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80', 'Handcrafted gourmet breakfast served on a wicker floating tray in your private villa pool with fresh fruit & Moët champagne.'),
        ('addon-scuba-03', 'Guided Coral Reef Scuba Dive', 'addons', 5200, 'per diver', 'compass', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', 'PADI certified dive trip to Surambaw Marine Sanctuary exploring vibrant coral reefs, sea turtles, and marine life.'),
        ('addon-spa-04', 'Sunset Ocean Massage & Hot Stone Spa', 'addons', 4800, 'per 90 min session', 'heart', 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80', 'Relaxing full body coconut oil and warm basalt stone massage in an open-air beachfront pavilion.')
    ]
    cursor.executemany('''
        INSERT INTO addons (id, title, category, price, price_period, icon, image, description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', addons)

    # 4. Seed Reservations
    reservations = [
        ('res-9011', 'RES-2026-9011', 'user-guest-02', 'Capt. Roberto Fernandez', 'roberto@fernandez-marine.com', '+63 918 222 3344', 'villa-overwater-01', 'Surambaw Royal Overwater Villa', 'Villas', '2026-08-20', '2026-08-24', 4, 2, json.dumps([{'name': 'Speedboat Transfer', 'price': 3500}]), 74000, 8880, 7400, 78980, 78980, 0, 'Confirmed', 'Extra pillows and early check-in at 2 PM.'),
        ('res-9014', 'RES-2026-9014', 'user-guest-01', 'Alexander Wright', 'guest@surambaw.com', '+63 917 555 8920', 'villa-beachfront-02', 'Sunset Beachfront Villa', 'Villas', '2026-08-20', '2026-08-23', 3, 2, json.dumps([{'name': 'Floating Champagne Breakfast', 'price': 2800}]), 42600, 5112, 4260, 46252, 41252, 5000, 'Confirmed', 'Champagne on ice upon arrival.'),
        ('res-9019', 'RES-2026-9019', None, 'Dr. Kenneth Vance', 'kenneth.vance@vancemedical.com', '+63 920 444 5566', 'room-deluxe-01', 'Deluxe Ocean View Room', 'Rooms', '2026-08-20', '2026-08-22', 2, 2, '[]', 11600, 1392, 0, 12992, 12992, 0, 'Checked-in', 'Quiet room requested.'),
        ('res-9005', 'RES-2026-9005', 'user-guest-01', 'Alexander Wright', 'guest@surambaw.com', '+63 917 555 8920', 'cottage-nipa-01', 'Traditional Nipa Beach Cottage', 'Cottages', '2026-06-12', '2026-06-15', 3, 2, '[]', 22500, 2700, 2250, 22950, 22950, 0, 'Checked-out', 'Anniversary celebration.')
    ]
    cursor.executemany('''
        INSERT INTO reservations (id, code, guest_id, guest_name, guest_email, guest_phone, accommodation_id, accommodation_name, category, check_in, check_out, nights, guests_count, addons_json, subtotal, tax, discount, total, paid, balance, status, special_requests)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', reservations)

    # 5. Seed Guests
    guests = [
        ('gst-01', 'Alexander Wright', 'guest@surambaw.com', '+63 917 555 8920', 'Manila, Philippines', 'Surambaw Gold VIP', 4, 185200, '2026-08-20', 'Active'),
        ('gst-02', 'Capt. Roberto Fernandez', 'roberto@fernandez-marine.com', '+63 918 222 3344', 'Batangas City', 'Surambaw Platinum VIP', 6, 312000, '2026-08-20', 'Active'),
        ('gst-03', 'Sofia Rodriguez', 'sofia@example.com', '+63 918 333 4455', 'Cebu City', 'Surambaw Gold VIP', 3, 142800, '2026-07-15', 'Active'),
        ('gst-04', 'Dr. Kenneth Vance', 'kenneth.vance@vancemedical.com', '+63 920 444 5566', 'Quezon City', 'Regular Guest', 1, 12992, '2026-08-20', 'Active')
    ]
    cursor.executemany('''
        INSERT INTO guests (id, name, email, phone, address, tier, total_stays, total_spent, last_stay, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', guests)

    # 6. Seed Inventory
    inventory = [
        ('INV-101', 'LIN-01', 'Surambaw Luxury Beach Towels', 'Linens', 140, 30, 'pieces', 'In Stock'),
        ('INV-102', 'SPA-01', 'Premium Coconut Body Oil (500ml)', 'Spa', 8, 15, 'bottles', 'Low Stock'),
        ('INV-103', 'SPO-01', 'Snorkel & Mask Sets', 'Water Sports', 45, 10, 'sets', 'In Stock'),
        ('INV-104', 'BEV-01', 'Moët & Chandon Champagne', 'Dining', 4, 10, 'bottles', 'Low Stock'),
        ('INV-105', 'AME-01', 'Surambaw Branded Sunscreen SPF50', 'Amenities', 0, 20, 'tubes', 'Out of Stock'),
        ('INV-106', 'SPO-02', 'Ocean Kayak Paddles', 'Water Sports', 24, 6, 'paddles', 'In Stock'),
        ('INV-107', 'SPA-02', 'Eucalyptus Aromatherapy Oil', 'Spa', 5, 12, 'bottles', 'Low Stock')
    ]
    cursor.executemany('''
        INSERT INTO inventory (id, sku, name, category, in_stock, min_threshold, unit, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', inventory)

    # 7. Seed Inventory History
    history = [
        ('Premium Coconut Body Oil', 'Deducted 4 bottles', 'Maria Santos', '2026-08-19'),
        ('Luxury Beach Towels', 'Added 50 pieces', 'Victor Ramirez', '2026-08-18'),
        ('Snorkel & Mask Sets', 'Deducted 2 sets', 'Maria Santos', '2026-08-16')
    ]
    cursor.executemany('''
        INSERT INTO inventory_history (item_name, action, staff, date)
        VALUES (?, ?, ?, ?)
    ''', history)

# Initialize and seed database on startup (supports both gunicorn and direct python execution)
init_db()

# ==================== AUTH APIS ====================

@app.route('/api/auth/login', methods=['POST'])
def api_login():
    data = request.get_json() or {}
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    role_override = data.get('role') # convenient for 1-click demo login

    conn = get_db()
    cursor = conn.cursor()

    if role_override:
        cursor.execute('SELECT * FROM users WHERE role = ? LIMIT 1', (role_override,))
        user = cursor.fetchone()
    elif email and password:
        cursor.execute('SELECT * FROM users WHERE LOWER(email) = ? AND password = ?', (email, password))
        user = cursor.fetchone()
    else:
        conn.close()
        return jsonify({'success': False, 'message': 'Email and password required'}), 400

    if user:
        user_dict = dict(user)
        user_dict.pop('password', None)
        session['user_id'] = user_dict['id']
        session['user_role'] = user_dict['role']
        conn.close()
        return jsonify({'success': True, 'user': user_dict})
    
    conn.close()
    return jsonify({'success': False, 'message': 'Invalid credentials. Please check your email and password.'}), 401

@app.route('/api/auth/register', methods=['POST'])
def api_register():
    data = request.get_json() or {}
    name = data.get('name', '').strip()
    email = data.get('email', '').strip().lower()
    password = data.get('password', '')
    phone = data.get('phone', '').strip()

    if not name or not email or not password:
        return jsonify({'success': False, 'message': 'Name, email, and password are required'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT id FROM users WHERE LOWER(email) = ?', (email,))
    if cursor.fetchone():
        conn.close()
        return jsonify({'success': False, 'message': 'An account with this email already exists'}), 409

    user_id = f"user-{int(datetime.now().timestamp())}"
    cursor.execute('''
        INSERT INTO users (id, name, email, password, role, phone, tier, avatar)
        VALUES (?, ?, ?, ?, 'customer', ?, 'Surambaw Guest Member', ?)
    ''', (user_id, name, email, password, phone, 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80'))
    
    # Also add to guests table
    cursor.execute('''
        INSERT INTO guests (id, name, email, phone, tier, total_stays, total_spent, last_stay, status)
        VALUES (?, ?, ?, ?, 'Surambaw Guest Member', 0, 0, 'New Member', 'Active')
    ''', (f"gst-{user_id[-6:]}", name, email, phone))

    conn.commit()
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    user_dict = dict(user)
    user_dict.pop('password', None)
    session['user_id'] = user_id
    session['user_role'] = 'customer'
    conn.close()

    # Synchronize to Supabase if connected
    if supabase:
        try:
            supabase.table('users').insert({
                'id': user_id,
                'name': name,
                'email': email,
                'password': password,
                'role': 'customer',
                'phone': phone,
                'tier': 'Surambaw Guest Member'
            }).execute()
        except Exception as sb_err:
            pass

    return jsonify({'success': True, 'user': user_dict})

@app.route('/api/auth/me', methods=['GET'])
def api_auth_me():
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({'authenticated': False})
    
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    user = cursor.fetchone()
    conn.close()

    if user:
        user_dict = dict(user)
        user_dict.pop('password', None)
        return jsonify({'authenticated': True, 'user': user_dict})
    
    session.clear()
    return jsonify({'authenticated': False})

@app.route('/api/auth/logout', methods=['POST'])
def api_logout():
    session.clear()
    return jsonify({'success': True, 'message': 'Logged out successfully'})

# ==================== ACCOMMODATIONS & ADDONS ====================

@app.route('/api/accommodations', methods=['GET', 'POST'])
def api_accommodations():
    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'POST':
        data = request.get_json() or {}
        new_id = f"room-{int(datetime.now().timestamp())}"
        amenities_str = json.dumps(data.get('amenities', []))
        cursor.execute('''
            INSERT INTO accommodations (id, title, category, type, tag, price, price_period, rating, reviews_count, image, description, capacity, sqm, bed_type, view, amenities, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (new_id, data.get('title'), data.get('category', 'rooms'), data.get('type', 'Room'), data.get('tag', 'New'),
              float(data.get('price', 5000)), data.get('price_period', 'per night'), 5.0, 1,
              data.get('image', 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80'),
              data.get('description', ''), int(data.get('capacity', 2)), int(data.get('sqm', 40)),
              data.get('bed_type', 'King Bed'), data.get('view', 'Ocean View'), amenities_str, 'Available'))
        conn.commit()
        cursor.execute('SELECT * FROM accommodations WHERE id = ?', (new_id,))
        item = dict(cursor.fetchone())
        item['amenities'] = json.loads(item['amenities']) if item['amenities'] else []
        conn.close()
        return jsonify({'success': True, 'accommodation': item})

    cursor.execute('SELECT * FROM accommodations ORDER BY price DESC')
    rows = cursor.fetchall()
    items = []
    for r in rows:
        d = dict(r)
        d['amenities'] = json.loads(d['amenities']) if d['amenities'] else []
        items.append(d)
    conn.close()
    return jsonify({'success': True, 'accommodations': items})

@app.route('/api/addons', methods=['GET'])
def api_addons():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM addons')
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({'success': True, 'addons': rows})

# ==================== RESERVATIONS APIS ====================

@app.route('/api/reservations', methods=['GET', 'POST'])
def api_reservations():
    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'POST':
        data = request.get_json() or {}
        user_id = session.get('user_id')
        code = f"RES-2026-{int(datetime.now().timestamp() % 100000):05d}"
        res_id = f"res-{int(datetime.now().timestamp())}"

        guest_name = data.get('guest_name', 'Guest')
        guest_email = data.get('guest_email', '')
        guest_phone = data.get('guest_phone', '')
        accommodation_name = data.get('accommodation_name', 'Villa')
        accommodation_id = data.get('accommodation_id', '')
        category = data.get('category', 'Villas')
        check_in = data.get('check_in', str(date.today()))
        check_out = data.get('check_out', str(date.today()))
        nights = int(data.get('nights', 1))
        guests_count = int(data.get('guests_count', 2))
        addons_json = json.dumps(data.get('addons', []))
        subtotal = float(data.get('subtotal', 0))
        tax = float(data.get('tax', 0))
        discount = float(data.get('discount', 0))
        total = float(data.get('total', 0))
        paid = float(data.get('paid', total))
        balance = total - paid
        status = data.get('status', 'Confirmed')
        special_requests = data.get('special_requests', '')

        cursor.execute('''
            INSERT INTO reservations (
                id, code, guest_id, guest_name, guest_email, guest_phone,
                accommodation_id, accommodation_name, category,
                check_in, check_out, nights, guests_count,
                addons_json, subtotal, tax, discount, total, paid, balance, status, special_requests
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            res_id, code, user_id, guest_name, guest_email, guest_phone,
            accommodation_id, accommodation_name, category,
            check_in, check_out, nights, guests_count,
            addons_json, subtotal, tax, discount, total, paid, balance, status, special_requests
        ))

        # Update or insert into guests table
        cursor.execute('SELECT id, total_stays, total_spent FROM guests WHERE LOWER(email) = ?', (guest_email.lower(),))
        existing_guest = cursor.fetchone()
        if existing_guest:
            new_stays = existing_guest['total_stays'] + 1
            new_spent = existing_guest['total_spent'] + total
            cursor.execute('''
                UPDATE guests SET total_stays = ?, total_spent = ?, last_stay = ? WHERE id = ?
            ''', (new_stays, new_spent, check_in, existing_guest['id']))
        elif guest_email:
            cursor.execute('''
                INSERT INTO guests (id, name, email, phone, tier, total_stays, total_spent, last_stay, status)
                VALUES (?, ?, ?, ?, 'New Guest', 1, ?, ?, 'Active')
            ''', (f"gst-{res_id[-6:]}", guest_name, guest_email, guest_phone, total, check_in))

        conn.commit()
        cursor.execute('SELECT * FROM reservations WHERE id = ?', (res_id,))
        res = dict(cursor.fetchone())
        res['addons'] = json.loads(res['addons_json']) if res['addons_json'] else []
        conn.close()

        # Synchronize to Supabase if connected
        if supabase:
            try:
                supabase.table('reservations').insert({
                    'id': res_id,
                    'code': code,
                    'guest_id': user_id,
                    'guest_name': guest_name,
                    'guest_email': guest_email,
                    'guest_phone': guest_phone,
                    'accommodation_id': accommodation_id,
                    'accommodation_name': accommodation_name,
                    'category': category,
                    'check_in': check_in,
                    'check_out': check_out,
                    'nights': nights,
                    'guests_count': guests_count,
                    'subtotal': subtotal,
                    'tax': tax,
                    'discount': discount,
                    'total': total,
                    'paid': paid,
                    'balance': balance,
                    'status': status,
                    'special_requests': special_requests
                }).execute()
            except Exception as sb_err:
                pass

        return jsonify({'success': True, 'reservation': res})

    # GET reservations
    user_id = session.get('user_id')
    user_role = session.get('user_role')
    filter_role = request.args.get('all')

    if user_role == 'customer' and filter_role != 'true':
        cursor.execute('SELECT * FROM reservations WHERE guest_id = ? OR LOWER(guest_email) = (SELECT LOWER(email) FROM users WHERE id = ?) ORDER BY created_at DESC', (user_id, user_id))
    else:
        cursor.execute('SELECT * FROM reservations ORDER BY created_at DESC')
    
    rows = cursor.fetchall()
    reservations = []
    for r in rows:
        d = dict(r)
        d['addons'] = json.loads(d['addons_json']) if d['addons_json'] else []
        reservations.append(d)
    
    conn.close()
    return jsonify({'success': True, 'reservations': reservations})

@app.route('/api/reservations/<res_id>/status', methods=['PUT'])
def api_update_reservation_status(res_id):
    data = request.get_json() or {}
    new_status = data.get('status')
    if not new_status:
        return jsonify({'success': False, 'message': 'New status required'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('UPDATE reservations SET status = ? WHERE id = ? OR code = ?', (new_status, res_id, res_id))
    conn.commit()
    cursor.execute('SELECT * FROM reservations WHERE id = ? OR code = ?', (res_id, res_id))
    row = cursor.fetchone()
    conn.close()

    if row:
        d = dict(row)
        d['addons'] = json.loads(d['addons_json']) if d['addons_json'] else []
        if supabase:
            try:
                supabase.table('reservations').update({'status': new_status}).eq('id', res_id).execute()
            except Exception as sb_err:
                pass
        return jsonify({'success': True, 'reservation': d})
    return jsonify({'success': False, 'message': 'Reservation not found'}), 404

# ==================== GUESTS CRM APIS ====================

@app.route('/api/guests', methods=['GET', 'POST'])
def api_guests():
    conn = get_db()
    cursor = conn.cursor()

    if request.method == 'POST':
        data = request.get_json() or {}
        new_id = f"gst-{int(datetime.now().timestamp())}"
        cursor.execute('''
            INSERT INTO guests (id, name, email, phone, address, tier, total_stays, total_spent, last_stay, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (new_id, data.get('name'), data.get('email'), data.get('phone'), data.get('address', 'Manila, Philippines'),
              data.get('tier', 'Standard Guest'), int(data.get('total_stays', 0)), float(data.get('total_spent', 0)),
              str(date.today()), 'Active'))
        conn.commit()
        cursor.execute('SELECT * FROM guests WHERE id = ?', (new_id,))
        item = dict(cursor.fetchone())
        conn.close()
        return jsonify({'success': True, 'guest': item})

    cursor.execute('SELECT * FROM guests ORDER BY total_spent DESC')
    items = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return jsonify({'success': True, 'guests': items})

# ==================== INVENTORY APIS ====================

@app.route('/api/inventory', methods=['GET'])
def api_inventory():
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM inventory ORDER BY name ASC')
    items = [dict(r) for r in cursor.fetchall()]

    cursor.execute('SELECT * FROM inventory_history ORDER BY id DESC LIMIT 20')
    history = [dict(r) for r in cursor.fetchall()]
    conn.close()

    return jsonify({'success': True, 'inventory': items, 'history': history})

@app.route('/api/inventory/adjust', methods=['POST'])
def api_inventory_adjust():
    data = request.get_json() or {}
    item_id = data.get('item_id')
    amount = int(data.get('amount', 0))
    action_type = data.get('action', 'add') # 'add' or 'deduct'
    staff_name = data.get('staff_name', 'Arthur Pendelton')

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM inventory WHERE id = ?', (item_id,))
    item = cursor.fetchone()
    if not item:
        conn.close()
        return jsonify({'success': False, 'message': 'Inventory item not found'}), 404

    current_stock = item['in_stock']
    min_thresh = item['min_threshold']

    if action_type == 'add':
        new_stock = current_stock + amount
        action_text = f"Added {amount} {item['unit']}"
    else:
        new_stock = max(0, current_stock - amount)
        action_text = f"Deducted {amount} {item['unit']}"

    # Determine status
    if new_stock == 0:
        new_status = 'Out of Stock'
    elif new_stock <= min_thresh:
        new_status = 'Low Stock'
    else:
        new_status = 'In Stock'

    cursor.execute('UPDATE inventory SET in_stock = ?, status = ? WHERE id = ?', (new_stock, new_status, item_id))
    cursor.execute('''
        INSERT INTO inventory_history (item_name, action, staff, date)
        VALUES (?, ?, ?, ?)
    ''', (item['name'], action_text, staff_name, str(date.today())))

    conn.commit()
    cursor.execute('SELECT * FROM inventory WHERE id = ?', (item_id,))
    updated_item = dict(cursor.fetchone())
    conn.close()

    if supabase:
        try:
            supabase.table('inventory').update({'in_stock': new_stock, 'status': new_status}).eq('id', item_id).execute()
        except Exception as sb_err:
            pass

    return jsonify({'success': True, 'item': updated_item, 'action': action_text})

@app.route('/api/config', methods=['GET'])
def api_config():
    return jsonify({
        'success': True,
        'supabase_url': SUPABASE_URL,
        'supabase_connected': supabase is not None,
        'database_mode': 'hybrid_supabase_sqlite'
    })

# ==================== STATS APIS ====================

@app.route('/api/stats', methods=['GET'])
def api_stats():
    conn = get_db()
    cursor = conn.cursor()

    # Revenue & Reservations
    cursor.execute('SELECT SUM(total) as revenue, COUNT(*) as count FROM reservations WHERE status != "Cancelled"')
    rev_row = cursor.fetchone()
    total_revenue = rev_row['revenue'] or 0
    total_reservations = rev_row['count'] or 0
    avg_booking_val = round(total_revenue / total_reservations) if total_reservations > 0 else 0

    cursor.execute('SELECT COUNT(*) as count FROM reservations WHERE status = "Checked-out"')
    completed_stays = cursor.fetchone()['count'] or 0

    # Today's check-ins & check-outs
    today_str = str(date.today())
    cursor.execute('SELECT COUNT(*) as count FROM reservations WHERE check_in = ? AND status != "Cancelled"', (today_str,))
    today_checkins = cursor.fetchone()['count'] or 0

    cursor.execute('SELECT COUNT(*) as count FROM reservations WHERE check_out = ? AND status != "Cancelled"', (today_str,))
    today_checkouts = cursor.fetchone()['count'] or 0

    # Total guests
    cursor.execute('SELECT COUNT(*) as count FROM guests')
    total_guests = cursor.fetchone()['count'] or 0

    # Inventory metrics
    cursor.execute('SELECT COUNT(*) as low FROM inventory WHERE status = "Low Stock"')
    low_stock = cursor.fetchone()['low'] or 0
    cursor.execute('SELECT COUNT(*) as out_of FROM inventory WHERE status = "Out of Stock"')
    out_of_stock = cursor.fetchone()['out_of'] or 0
    cursor.execute('SELECT COUNT(*) as total FROM inventory')
    total_inv_items = cursor.fetchone()['total'] or 0

    conn.close()

    return jsonify({
        'success': True,
        'stats': {
            'totalRevenue': total_revenue,
            'totalReservations': total_reservations,
            'avgBookingValue': avg_booking_val,
            'completedStays': completed_stays,
            'todayCheckIns': today_checkins,
            'todayCheckOuts': today_checkouts,
            'totalGuests': total_guests,
            'lowStockCount': low_stock,
            'outOfStockCount': out_of_stock,
            'totalInventoryItems': total_inv_items,
            'occupiedRooms': 18,
            'totalRooms': 24,
            'occupancyRate': 75
        }
    })

# ==================== STATIC & UNIFIED ROUTES ====================

@app.route('/')
def route_index():
    return send_from_directory(APP_DIR, 'index.html')

@app.route('/customer')
@app.route('/customer.html')
def route_customer():
    return send_from_directory(APP_DIR, 'customer.html')

@app.route('/staff')
@app.route('/staff.html')
def route_staff():
    return send_from_directory(APP_DIR, 'staff.html')

@app.route('/admin')
@app.route('/admin.html')
def route_admin():
    return send_from_directory(APP_DIR, 'admin.html')

@app.route('/<path:filename>')
def route_static(filename):
    return send_from_directory(APP_DIR, filename)

if __name__ == '__main__':
    init_db()
    port = int(os.environ.get('PORT', 5000))
    print(f">> Surambaw Beach Resort Python Backend Server starting on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=False)
