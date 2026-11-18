/**
 * Surambaw Beach Resort - Executive Admin Data Store
 * KPI Metrics, Performance Analytics, Inventory Stock, Category Definitions,
 * Rate Schedules, Financial Reports, and Staff Access Control.
 */

const ADMIN_DATA = {
  // Logged-in Executive Admin
  adminUser: {
    name: "Victor Ramirez",
    role: "General Manager / Administrator",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    email: "victor.ramirez@surambaw-resort.com"
  },

  // 1. Dashboard Financial & KPI Overview
  revenueOverview: {
    totalRevenue: 1842500,
    totalReservations: 142,
    avgBookingValue: 12975,
    completedStays: 118
  },

  // Accommodation Performance Data
  accommodationPerformance: {
    bestPerforming: "Surambaw Royal Overwater Villa",
    mostBookedCategory: "Villas",
    rankings: [
      { rank: 1, name: "Surambaw Royal Overwater Villa", category: "Villas", bookings: 48, revenue: 888000, occupancyRate: "92%" },
      { rank: 2, name: "Sunset Beachfront Villa", category: "Villas", bookings: 36, revenue: 511200, occupancyRate: "85%" },
      { rank: 3, name: "Traditional Nipa Beach Cottage", category: "Cottages", bookings: 28, revenue: 210000, occupancyRate: "78%" },
      { rank: 4, name: "Premier Lagoon Access Room", category: "Rooms", bookings: 18, revenue: 124200, occupancyRate: "70%" },
      { rank: 5, name: "Deluxe Ocean View Room", category: "Rooms", bookings: 12, revenue: 69600, occupancyRate: "62%" }
    ]
  },

  // Inventory Stock Overview
  inventoryOverview: {
    totalItemsCount: 48,
    lowStockCount: 3,
    outOfStockCount: 1,
    items: [
      { id: "INV-101", name: "Surambaw Luxury Beach Towels", category: "Linens", inStock: 140, minThreshold: 30, status: "In Stock", unit: "pieces" },
      { id: "INV-102", name: "Premium Coconut Body Oil (500ml)", category: "Spa", inStock: 8, minThreshold: 15, status: "Low Stock", unit: "bottles" },
      { id: "INV-103", name: "Snorkel & Mask Sets", category: "Water Sports", inStock: 45, minThreshold: 10, status: "In Stock", unit: "sets" },
      { id: "INV-104", name: "Moët & Chandon Champagne", category: "Dining", inStock: 4, minThreshold: 10, status: "Low Stock", unit: "bottles" },
      { id: "INV-105", name: "Surambaw Branded Sunscreen SPF50", category: "Amenities", inStock: 0, minThreshold: 20, status: "Out of Stock", unit: "tubes" },
      { id: "INV-106", name: "Ocean Kayak Paddles", category: "Water Sports", inStock: 24, minThreshold: 6, status: "In Stock", unit: "paddles" },
      { id: "INV-107", name: "Eucalyptus Aromatherapy Oil", category: "Spa", inStock: 5, minThreshold: 12, status: "Low Stock", unit: "bottles" }
    ],
    history: [
      { date: "2026-08-19", item: "Premium Coconut Body Oil", action: "Deducted 4 bottles", staff: "Maria Santos" },
      { date: "2026-08-18", item: "Luxury Beach Towels", action: "Added 50 pieces", staff: "Victor Ramirez" },
      { date: "2026-08-16", item: "Snorkel & Mask Sets", action: "Deducted 2 sets", staff: "Maria Santos" }
    ]
  },

  // Guest CRM Analytics Overview
  guestOverview: {
    totalGuests: 320,
    newGuests: 45,
    returningGuests: 275,
    topGuests: [
      { name: "Alexander Wright", visits: 6, totalSpent: 168000, tier: "Surambaw Gold VIP" },
      { name: "Capt. Roberto Fernandez", visits: 4, totalSpent: 124000, tier: "Surambaw Silver VIP" },
      { name: "Dr. Kenneth Vance", visits: 3, totalSpent: 62000, tier: "Standard Guest" },
      { name: "Samantha Miller", visits: 2, totalSpent: 54000, tier: "Standard Guest" }
    ]
  },

  // Recent System Activity Log
  recentActivity: [
    { type: "reservation", title: "New Reservation Confirmed", desc: "Ref RES-2026-9011 created for Capt. Roberto Fernandez", time: "10 mins ago" },
    { type: "guest", title: "New Guest Registered", desc: "Guest profile created for Samantha Miller", time: "35 mins ago" },
    { type: "inventory", title: "Stock Warning Alert", desc: "Surambaw Branded Sunscreen SPF50 reached 0 stock", time: "1 hour ago" },
    { type: "transaction", title: "Payment Processed", desc: "₱79,180 recorded via Speedboat Terminal payment", time: "2 hours ago" }
  ],

  // Categories Master List
  categories: [
    { id: "CAT-1", name: "Overwater Bungalow / Villa", code: "OW-VILLA", description: "Ultra-luxury overwater glass-bottom structures with private ocean access.", totalUnits: 6, avgRate: 18500 },
    { id: "CAT-2", name: "Family Villa", code: "FAM-VILLA", description: "Multi-bedroom beachfront villas with private gardens and kitchenettes.", totalUnits: 4, avgRate: 14200 },
    { id: "CAT-3", name: "Beachfront Cottage", code: "BEACH-COT", description: "Eco-friendly bamboo nipa cottages situated directly on white sand.", totalUnits: 8, avgRate: 7500 },
    { id: "CAT-4", name: "Deluxe Room", code: "DELUXE-RM", description: "Modern ocean view hotel rooms in the central resort wing.", totalUnits: 4, avgRate: 5800 },
    { id: "CAT-5", name: "Standard Room", code: "STD-RM", description: "Cozy tropical garden view rooms with full resort amenities.", totalUnits: 2, avgRate: 4500 },
    { id: "CAT-6", name: "Amenities / Add-ons", code: "ADDONS", description: "Speedboat transfers, spa sessions, island scuba tours, and dining packages.", totalUnits: 12, avgRate: 4500 }
  ],

  // Rates Schedule
  rates: [
    { category: "Overwater Bungalow", standardRate: 18500, peakSeasonRate: 22000, lowSeasonRate: 15500, status: "Active" },
    { category: "Family Villa", standardRate: 14200, peakSeasonRate: 17500, lowSeasonRate: 12000, status: "Active" },
    { category: "Beachfront Cottage", standardRate: 7500, peakSeasonRate: 9500, lowSeasonRate: 6000, status: "Active" },
    { category: "Deluxe Room", standardRate: 5800, peakSeasonRate: 7200, lowSeasonRate: 4800, status: "Active" },
    { category: "Standard Room", standardRate: 4500, peakSeasonRate: 5500, lowSeasonRate: 3800, status: "Active" }
  ],

  // Financial Revenue Breakdowns
  revenueBreakdown: {
    today: 128500,
    thisWeek: 542000,
    thisMonth: 1842500,
    byCategory: [
      { category: "Villas", amount: 1240000, percentage: 67 },
      { category: "Cottages", amount: 320000, percentage: 17 },
      { category: "Rooms", amount: 182500, percentage: 10 },
      { category: "Add-ons & Spa", amount: 100000, percentage: 6 }
    ]
  },

  // Staff Accounts & Access Control Matrix
  staffAccounts: [
    { id: "STF-01", name: "Victor Ramirez", email: "victor.ramirez@surambaw-resort.com", role: "Administrator", status: "Active", accessLevel: "Full System Access" },
    { id: "STF-02", name: "Maria Santos", email: "maria.santos@surambaw-resort.com", role: "Senior Desk Supervisor", status: "Active", accessLevel: "Front Desk & Guests" },
    { id: "STF-03", name: "Juan Perez", email: "juan.perez@surambaw-resort.com", role: "Inventory Manager", status: "Active", accessLevel: "Inventory & Stock" },
    { id: "STF-04", name: "Rosalie Mendoza", email: "rosalie.m@surambaw-resort.com", role: "Housekeeping Lead", status: "Active", accessLevel: "Accommodations Only" }
  ],

  // System Notifications
  notifications: [
    { id: 1, title: "Low Stock Alert", body: "Surambaw Sunscreen SPF50 is out of stock.", time: "1 hour ago", unread: true },
    { id: 2, title: "High Occupancy Warning", body: "Weekend occupancy reached 96%.", time: "3 hours ago", unread: true },
    { id: 3, title: "Monthly Tax Report Ready", body: "July 12% VAT tax breakdown generated.", time: "1 day ago", unread: false }
  ],

  // General Resort Property Settings
  settings: {
    resortName: "Surambaw Beach Resort",
    currency: "PHP (₱)",
    vatTaxRate: 12,
    serviceFeeRate: 5,
    contactEmail: "reservations@surambaw-beach-resort.com",
    contactPhone: "+63 (2) 8888 9900",
    address: "Surambaw Island, Palawan, Philippines"
  }
};
