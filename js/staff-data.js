/**
 * Surambaw Beach Resort - Staff Portal Data Store
 * Operational data for front desk, reservations, guest CRM, and accommodations status.
 */

const STAFF_DATA = {
  // Staff member on duty
  staffUser: {
    name: "Maria Santos",
    role: "Senior Desk Supervisor",
    shift: "Morning / Afternoon Shift",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
  },

  // Today's Operational Queue Metrics
  todayMetrics: {
    checkInsCount: 4,
    checkOutsCount: 3,
    occupiedRooms: 18,
    totalRooms: 24,
    occupancyRate: 75,
    pendingPayments: 2
  },

  // Today's Check-ins Queue
  todaysCheckIns: [
    {
      id: "RES-2026-9011",
      guestName: "Capt. Roberto Fernandez",
      guestPhone: "+63 918 222 3344",
      accommodation: "Surambaw Royal Overwater Villa",
      checkIn: "2026-08-20",
      checkOut: "2026-08-24",
      nights: 4,
      status: "Confirmed",
      eta: "02:00 PM",
      balance: 0,
      paymentStatus: "Paid in Full"
    },
    {
      id: "RES-2026-9014",
      guestName: "Samantha Miller",
      guestPhone: "+63 917 888 1122",
      accommodation: "Sunset Beachfront Villa",
      checkIn: "2026-08-20",
      checkOut: "2026-08-23",
      nights: 3,
      status: "Confirmed",
      eta: "03:30 PM",
      balance: 5000,
      paymentStatus: "Partial Deposit"
    },
    {
      id: "RES-2026-9019",
      guestName: "Dr. Kenneth Vance",
      guestPhone: "+63 920 444 5566",
      accommodation: "Deluxe Ocean View Room",
      checkIn: "2026-08-20",
      checkOut: "2026-08-22",
      nights: 2,
      status: "Pending",
      eta: "05:00 PM",
      balance: 11600,
      paymentStatus: "Unpaid"
    }
  ],

  // Today's Check-outs Queue
  todaysCheckOuts: [
    {
      id: "RES-2026-8801",
      guestName: "David & Jessica Tan",
      guestPhone: "+63 917 333 4411",
      accommodation: "Traditional Nipa Beach Cottage",
      checkOut: "2026-08-20",
      status: "Checked-in",
      keyCardReturned: false,
      incidentals: 1200,
      balance: 1200
    },
    {
      id: "RES-2026-8805",
      guestName: "Grace Hopper",
      guestPhone: "+63 919 777 8899",
      accommodation: "Premier Lagoon Access Room",
      checkOut: "2026-08-20",
      status: "Checked-out",
      keyCardReturned: true,
      incidentals: 0,
      balance: 0
    }
  ],

  // Guests Directory (CRM)
  guests: [
    {
      id: "GUEST-101",
      firstName: "Alexander",
      lastName: "Wright",
      fullName: "Alexander Wright",
      email: "alexander.wright@surambaw-vip.com",
      phone: "+63 917 555 8920",
      address: "88 Ocean Drive, Manila",
      vipLevel: "Surambaw Gold VIP",
      totalStays: 6,
      notes: "Prefers high-floor ocean view and non-dairy milk for coffee.",
      createdDate: "2024-03-15"
    },
    {
      id: "GUEST-102",
      firstName: "Roberto",
      lastName: "Fernandez",
      fullName: "Capt. Roberto Fernandez",
      email: "r.fernandez@maritime-group.ph",
      phone: "+63 918 222 3344",
      address: "12 Harbor Way, Cebu City",
      vipLevel: "Surambaw Silver VIP",
      totalStays: 3,
      notes: "Requests speedboat transfer from Terminal 2.",
      createdDate: "2025-01-10"
    },
    {
      id: "GUEST-103",
      firstName: "Samantha",
      lastName: "Miller",
      fullName: "Samantha Miller",
      email: "samantha.m@techventures.io",
      phone: "+63 917 888 1122",
      address: "45 Bonifacio High, Taguig",
      vipLevel: "Standard Guest",
      totalStays: 1,
      notes: "Honeymoon couple. Arrange welcome fruit basket.",
      createdDate: "2026-07-22"
    },
    {
      id: "GUEST-104",
      firstName: "Kenneth",
      lastName: "Vance",
      fullName: "Dr. Kenneth Vance",
      email: "dr.vance@wellness-clinic.com",
      phone: "+63 920 444 5566",
      address: "102 Ortigas Center, Pasig",
      vipLevel: "Standard Guest",
      totalStays: 2,
      notes: "Booked spa treatment package for 2.",
      createdDate: "2026-06-05"
    }
  ],

  // Full Reservation Database
  reservations: [
    {
      id: "RES-2026-9011",
      guestId: "GUEST-102",
      guestName: "Capt. Roberto Fernandez",
      accommodationId: "villa-overwater-01",
      accommodationName: "Surambaw Royal Overwater Villa",
      checkIn: "2026-08-20",
      checkOut: "2026-08-24",
      nights: 4,
      guests: 2,
      quantity: 1,
      subtotal: 74000,
      discount: 7400,
      taxAndFees: 12580,
      totalAmount: 79180,
      paymentRecorded: 79180,
      balance: 0,
      paymentStatus: "Paid in Full",
      status: "Confirmed",
      specialRequests: "Arriving by private yacht. Requires late check-in.",
      bookingDate: "2026-08-10"
    },
    {
      id: "RES-2026-9014",
      guestId: "GUEST-103",
      guestName: "Samantha Miller",
      accommodationId: "villa-sunset-02",
      accommodationName: "Sunset Beachfront Villa",
      checkIn: "2026-08-20",
      checkOut: "2026-08-23",
      nights: 3,
      guests: 2,
      quantity: 1,
      subtotal: 42600,
      discount: 0,
      taxAndFees: 7242,
      totalAmount: 49842,
      paymentRecorded: 44842,
      balance: 5000,
      paymentStatus: "Partial Deposit",
      status: "Confirmed",
      specialRequests: "Honeymoon setup with flower petals.",
      bookingDate: "2026-08-12"
    },
    {
      id: "RES-2026-9019",
      guestId: "GUEST-104",
      guestName: "Dr. Kenneth Vance",
      accommodationId: "room-deluxe-05",
      accommodationName: "Deluxe Ocean View Room",
      checkIn: "2026-08-20",
      checkOut: "2026-08-22",
      nights: 2,
      guests: 2,
      quantity: 1,
      subtotal: 11600,
      discount: 0,
      taxAndFees: 1972,
      totalAmount: 13572,
      paymentRecorded: 0,
      balance: 13572,
      paymentStatus: "Unpaid",
      status: "Pending",
      specialRequests: "Quiet room away from elevator.",
      bookingDate: "2026-08-18"
    },
    {
      id: "RES-2026-8801",
      guestId: "GUEST-101",
      guestName: "Alexander Wright",
      accommodationId: "cottage-beach-03",
      accommodationName: "Traditional Nipa Beach Cottage",
      checkIn: "2026-08-16",
      checkOut: "2026-08-20",
      nights: 4,
      guests: 2,
      quantity: 1,
      subtotal: 30000,
      discount: 3000,
      taxAndFees: 4590,
      totalAmount: 31590,
      paymentRecorded: 31590,
      balance: 0,
      paymentStatus: "Paid in Full",
      status: "Checked-in",
      specialRequests: "Extra pillows and daily fruit basket.",
      bookingDate: "2026-08-01"
    },
    {
      id: "RES-2026-8805",
      guestId: "GUEST-101",
      guestName: "Grace Hopper",
      accommodationId: "room-lagoon-06",
      accommodationName: "Premier Lagoon Access Room",
      checkIn: "2026-08-15",
      checkOut: "2026-08-20",
      nights: 5,
      guests: 2,
      quantity: 1,
      subtotal: 34500,
      discount: 0,
      taxAndFees: 5865,
      totalAmount: 40365,
      paymentRecorded: 40365,
      balance: 0,
      paymentStatus: "Paid in Full",
      status: "Checked-out",
      specialRequests: "Near pool ladder access.",
      bookingDate: "2026-07-28"
    },
    {
      id: "RES-2026-7710",
      guestId: "GUEST-103",
      guestName: "Marcus Vance",
      accommodationId: "villa-overwater-01",
      accommodationName: "Surambaw Royal Overwater Villa",
      checkIn: "2026-08-01",
      checkOut: "2026-08-04",
      nights: 3,
      guests: 4,
      quantity: 1,
      subtotal: 55500,
      discount: 0,
      taxAndFees: 9435,
      totalAmount: 64935,
      paymentRecorded: 0,
      balance: 64935,
      paymentStatus: "Canceled",
      status: "Cancelled",
      specialRequests: "Canceled due to flight schedule change.",
      bookingDate: "2026-07-15"
    }
  ],

  // Resort Accommodations Inventory for Staff Desk
  accommodations: [
    {
      id: "villa-overwater-01",
      code: "V-101",
      name: "Surambaw Royal Overwater Villa",
      category: "Villas",
      status: "Occupied",
      ratePerNight: 18500,
      capacity: 4,
      capacityText: "4 Guests",
      size: "160 sqm",
      amenities: ["Private Pool", "Butler Service", "Ocean Deck", "Glass Floor"],
      housekeeper: "Rosalie M."
    },
    {
      id: "villa-sunset-02",
      code: "V-102",
      name: "Sunset Beachfront Villa",
      category: "Villas",
      status: "Available",
      ratePerNight: 14200,
      capacity: 2,
      capacityText: "2 Guests",
      size: "110 sqm",
      amenities: ["Beachfront Hammock", "Outdoor Rain Shower", "King Bed"],
      housekeeper: "Juan P."
    },
    {
      id: "cottage-beach-03",
      code: "C-201",
      name: "Traditional Nipa Beach Cottage",
      category: "Cottages",
      status: "Occupied",
      ratePerNight: 7500,
      capacity: 2,
      capacityText: "2 Guests",
      size: "65 sqm",
      amenities: ["Bamboo Deck", "Sea View", "Hammock", "Ceiling Fan"],
      housekeeper: "Rosalie M."
    },
    {
      id: "cottage-family-04",
      code: "C-202",
      name: "Surambaw Family Palm Cottage",
      category: "Cottages",
      status: "Available",
      ratePerNight: 9200,
      capacity: 6,
      capacityText: "6 Guests",
      size: "120 sqm",
      amenities: ["2 Bedrooms", "Private Garden", "Outdoor Dining"],
      housekeeper: "Juan P."
    },
    {
      id: "room-deluxe-05",
      code: "R-301",
      name: "Deluxe Ocean View Room",
      category: "Rooms",
      status: "Available",
      ratePerNight: 5800,
      capacity: 2,
      capacityText: "2 Guests",
      size: "45 sqm",
      amenities: ["Ocean Balcony", "Aircon", "Smart TV"],
      housekeeper: "Elena B."
    },
    {
      id: "room-lagoon-06",
      code: "R-302",
      name: "Premier Lagoon Access Room",
      category: "Rooms",
      status: "Maintenance",
      ratePerNight: 6900,
      capacity: 3,
      capacityText: "3 Guests",
      size: "55 sqm",
      amenities: ["Direct Pool Deck", "Espresso Machine", "Rain Shower"],
      housekeeper: "Elena B."
    }
  ],

  // Available Add-ons for Staff Desk Booking
  addons: [
    { id: "add-1", name: "VIP Speedboat Airport Transfer", price: 3500 },
    { id: "add-2", name: "Floating Champagne Breakfast", price: 2800 },
    { id: "add-3", name: "Guided Coral Reef Scuba Dive", price: 5200 },
    { id: "add-4", name: "Sunset Ocean Massage & Spa", price: 4800 },
    { id: "add-5", name: "Romantic Beach Dinner Setup", price: 6500 }
  ]
};
