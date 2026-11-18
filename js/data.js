/**
 * Surambaw Beach Resort - Expanded Data Store
 * Contains catalog items matching: Rooms, Cottages, Villas, Amenities/Add-ons
 * Active & Previous Reservations history, detailed User Profile, and Cart state.
 */

const RESORT_DATA = {
  // User Profile matching Personal, Contact, and Account Information
  user: {
    // Personal Information
    firstName: "Alexander",
    lastName: "Wright",
    gender: "Male",
    birthdate: "1992-06-15",

    // Contact Information
    email: "alexander.wright@surambaw-vip.com",
    phone: "+63 917 555 8920",
    address: "88 Ocean Drive, Waterfront District, Manila, Philippines",
    emergencyContact: "Elena Wright (+63 917 555 8921)",

    // Account Information
    username: "alex_wright_vip",
    memberId: "SBM-VIP-9942",
    tier: "Surambaw Gold VIP",
    loyaltyPoints: 12400,
    dietaryPreference: "Seafood & Gluten-Free",
    transferPreference: "Private Speedboat Transfer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
  },

  // Featured Amenities & Add-ons showcased on Home & Browse
  featuredAmenities: [
    {
      id: "addon-transfer-01",
      title: "Luxury Speedboat Airport Transfer",
      category: "addons",
      price: 3500,
      pricePeriod: "per roundtrip",
      icon: "ship",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=600&q=80",
      description: "Direct 25-minute VIP speedboat ride from mainland airport terminal straight to Surambaw private dock."
    },
    {
      id: "addon-breakfast-02",
      title: "Floating Champagne Breakfast",
      category: "addons",
      price: 2800,
      pricePeriod: "per tray for 2",
      icon: "coffee",
      image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80",
      description: "Handcrafted gourmet breakfast served on a wicker floating tray in your private villa pool with fresh fruit & Moët champagne."
    },
    {
      id: "addon-scuba-03",
      title: "Guided Coral Reef Scuba Dive",
      category: "addons",
      price: 5200,
      pricePeriod: "per diver",
      icon: "compass",
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80",
      description: "PADI certified dive trip to Surambaw Marine Sanctuary exploring vibrant coral reefs, sea turtles, and marine life."
    },
    {
      id: "addon-spa-04",
      title: "Sunset Ocean Massage & Hot Stone Spa",
      category: "addons",
      price: 4800,
      pricePeriod: "per 90 min session",
      icon: "heart",
      image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=80",
      description: "Relaxing full body coconut oil and warm basalt stone massage in an open-air beachfront pavilion."
    }
  ],

  // Full Catalog of Rooms, Cottages, Villas, and Amenities/Add-ons
  accommodations: [
    {
      id: "villa-overwater-01",
      title: "Surambaw Royal Overwater Villa",
      category: "villas",
      type: "Villa",
      tag: "Signature Villa",
      price: 18500,
      pricePeriod: "per night",
      rating: 4.98,
      reviewsCount: 124,
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      description: "Direct ocean access villa with a private infinity glass pool, glass floor viewing pane, wrap-around sundeck, and 24/7 personal butler service.",
      capacity: 4,
      capacityText: "4 Guests",
      size: "160 sqm",
      amenities: ["Private Pool", "Butler Service", "Ocean Deck", "Free Breakfast"],
      available: true
    },
    {
      id: "villa-sunset-02",
      title: "Sunset Beachfront Villa",
      category: "villas",
      type: "Villa",
      tag: "Best Sunset View",
      price: 14200,
      pricePeriod: "per night",
      rating: 4.92,
      reviewsCount: 98,
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
      description: "Nestled right on powdery white sands with panoramic sunset views, private hammocks, outdoor rain shower, and beachfront lounge beds.",
      capacity: 2,
      capacityText: "2 Guests",
      size: "110 sqm",
      amenities: ["Beach Access", "Outdoor Shower", "King Bed", "Mini Bar"],
      available: true
    },
    {
      id: "cottage-beach-03",
      title: "Traditional Nipa Beach Cottage",
      category: "cottages",
      type: "Cottage",
      tag: "Eco-Luxury",
      price: 7500,
      pricePeriod: "per night",
      rating: 4.88,
      reviewsCount: 112,
      image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80",
      description: "Charming tropical wooden cottage with bamboo accents, oceanfront veranda, natural sea breeze ventilation, and cozy daybeds.",
      capacity: 2,
      capacityText: "2 Guests",
      size: "65 sqm",
      amenities: ["Veranda Daybed", "Sea View", "Hammock", "Free WiFi"],
      available: true
    },
    {
      id: "cottage-family-04",
      title: "Surambaw Family Palm Cottage",
      category: "cottages",
      type: "Cottage",
      tag: "Family Choice",
      price: 9200,
      pricePeriod: "per night",
      rating: 4.84,
      reviewsCount: 76,
      image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
      description: "Two-bedroom spacious cottage nestled among coconut palms, featuring private garden courtyard and outdoor dining table.",
      capacity: 6,
      capacityText: "6 Guests",
      size: "120 sqm",
      amenities: ["2 Bedrooms", "Private Garden", "Outdoor Dining", "Kitchenette"],
      available: true
    },
    {
      id: "room-deluxe-05",
      title: "Deluxe Ocean View Room",
      category: "rooms",
      type: "Room",
      tag: "Great Value",
      price: 5800,
      pricePeriod: "per night",
      rating: 4.81,
      reviewsCount: 165,
      image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
      description: "Modern room located in the main resort wing with private balcony overlooking the turquoise sea and central garden.",
      capacity: 2,
      capacityText: "2 Guests",
      size: "45 sqm",
      amenities: ["Ocean Balcony", "Aircon", "Smart TV", "Work Desk"],
      available: true
    },
    {
      id: "room-lagoon-06",
      title: "Premier Lagoon Access Room",
      category: "rooms",
      type: "Room",
      tag: "Direct Pool Access",
      price: 6900,
      pricePeriod: "per night",
      rating: 4.89,
      reviewsCount: 140,
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      description: "Ground floor room with private deck stepping straight into the lagoon swimming pool. Includes complimentary morning espresso.",
      capacity: 3,
      capacityText: "3 Guests",
      size: "55 sqm",
      amenities: ["Pool Deck Access", "Espresso Machine", "Rain Shower", "King Bed"],
      available: true
    },
    {
      id: "addon-jetski-07",
      title: "Guided Island Hopping & Jet Ski Safari",
      category: "addons",
      type: "Amenity/Add-on",
      tag: "Water Activity",
      price: 4500,
      pricePeriod: "per session",
      rating: 4.96,
      reviewsCount: 210,
      image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
      description: "2-Hour adrenaline guided jet ski safari exploring nearby pristine coral coves, sandbars, and turtle sanctuaries.",
      capacity: 2,
      capacityText: "2 Persons",
      size: "2 Hours",
      amenities: ["Instructor Included", "Safety Vests", "GoPro Photos", "Refreshments"],
      available: true
    },
    {
      id: "addon-dinner-08",
      title: "Private Candlelight Beach Dinner",
      category: "addons",
      type: "Amenity/Add-on",
      tag: "Dining Add-on",
      price: 6500,
      pricePeriod: "per couple",
      rating: 4.99,
      reviewsCount: 132,
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      description: "Exclusive 4-course lobster & grilled seafood dinner setup under a lit tiki canopy with personal server and acoustic music.",
      capacity: 2,
      capacityText: "2 Persons",
      size: "3 Hours",
      amenities: ["4-Course Menu", "Wine Bottle", "Private Server", "Tiki Torch Setup"],
      available: true
    }
  ],

  // Current & Previous Reservations History
  reservations: {
    current: [
      {
        id: "RES-2026-8891",
        title: "Surambaw Royal Overwater Villa",
        type: "Accommodation",
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
        checkIn: "2026-09-12",
        checkOut: "2026-09-15",
        nights: 3,
        guests: "2 Adults, 1 Child",
        quantity: 1,
        totalPrice: 55500,
        status: "Confirmed",
        paymentStatus: "Paid in Full",
        voucherCode: "SBM-8891-VIP",
        qrImage: "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=SURAMBAW-RES-2026-8891-ALEXANDER"
      },
      {
        id: "RES-2026-4412",
        title: "Sunset Beachfront Villa",
        type: "Accommodation",
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80",
        checkIn: "2026-10-05",
        checkOut: "2026-10-08",
        nights: 3,
        guests: "2 Adults",
        quantity: 1,
        totalPrice: 42600,
        status: "Pending",
        paymentStatus: "Deposit Received",
        voucherCode: "SBM-4412-DEP",
        qrImage: "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=SURAMBAW-RES-2026-4412-ALEXANDER"
      }
    ],
    previous: [
      {
        id: "RES-2025-1102",
        title: "Deluxe Ocean View Room & Scuba Package",
        type: "Accommodation + Add-on",
        image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=600&q=80",
        checkIn: "2025-11-20",
        checkOut: "2025-11-24",
        nights: 4,
        guests: "2 Adults",
        quantity: 1,
        totalPrice: 28400,
        status: "Completed",
        paymentStatus: "Paid in Full",
        voucherCode: "SBM-1102-COMP",
        qrImage: "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=SURAMBAW-RES-2025-1102-ALEXANDER"
      },
      {
        id: "RES-2025-0518",
        title: "Traditional Nipa Beach Cottage",
        type: "Accommodation",
        image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=600&q=80",
        checkIn: "2025-05-18",
        checkOut: "2025-05-21",
        nights: 3,
        guests: "2 Adults",
        quantity: 1,
        totalPrice: 22500,
        status: "Completed",
        paymentStatus: "Paid in Full",
        voucherCode: "SBM-0518-COMP",
        qrImage: "https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=SURAMBAW-RES-2025-0518-ALEXANDER"
      }
    ]
  },

  // Initial Booking Cart with explicit Accommodations & Add-ons, quantity, guests
  cart: [
    {
      id: "cart-item-1",
      accommodationId: "villa-sunset-02",
      itemType: "Accommodation",
      title: "Sunset Beachfront Villa",
      image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=400&q=80",
      pricePerUnit: 14200,
      pricePeriod: "per night",
      checkIn: "2026-08-28",
      checkOut: "2026-08-31",
      nights: 3,
      guests: 2,
      quantity: 1
    },
    {
      id: "cart-item-2",
      accommodationId: "addon-transfer-01",
      itemType: "Add-on",
      title: "Luxury Speedboat Airport Transfer",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=400&q=80",
      pricePerUnit: 3500,
      pricePeriod: "flat rate",
      checkIn: "2026-08-28",
      checkOut: "2026-08-31",
      nights: 3,
      guests: 2,
      quantity: 1
    }
  ]
};
