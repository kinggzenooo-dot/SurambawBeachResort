/**
 * Surambaw Beach Resort - Customer Dashboard Application JavaScript
 * Fully compliant with detailed page specifications for:
 * - Home (Resort overview, Featured accommodations, Featured amenities/add-ons, Quick booking access)
 * - Browse (Rooms, Cottages, Villas, Amenities/Add-ons, Search, Filter by Category, Price, & Capacity, Details modal)
 * - Booking Cart (Selected accommodations, Selected add-ons, Check-in/out, Guests, Nights, Quantity, Subtotal, Discount, Total, Checkout)
 * - My Reservations (Current vs Previous reservations, Status, Details, Booking history, E-Voucher QR)
 * - Profile (Personal Info, Contact Info, Account Info, Update profile)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentView: 'home',
    cart: [...RESORT_DATA.cart],
    reservationsCurrent: [...RESORT_DATA.reservations.current],
    reservationsPrevious: [...RESORT_DATA.reservations.previous],
    accommodations: [...RESORT_DATA.accommodations],
    featuredAmenities: [...RESORT_DATA.featuredAmenities],
    user: { ...RESORT_DATA.user },
    
    // Browse Filters
    activeCategoryFilter: 'all',
    priceFilter: 'all',
    capacityFilter: 'all',
    searchQuery: '',

    // Cart Discount
    discountCode: '',
    discountPercent: 0,

    // Reservations Subtab
    resTab: 'current'
  };

  // SVG Icons Store (No emojis used)
  const SVG_ICONS = {
    star: `<svg class="icon icon-sm" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    check: `<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
    user: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    calendar: `<svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    trash: `<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    eye: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    qr: `<svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    users: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    plus: `<svg class="icon icon-sm" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    minus: `<svg class="icon icon-sm" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/></svg>`
  };

  // DOM Handles
  const navLinks = document.querySelectorAll('.nav-link');
  const viewSections = document.querySelectorAll('.view-section');
  const cartBadge = document.getElementById('cartBadgeCount');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const centerNav = document.getElementById('centerNav');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalFooter = document.getElementById('modalFooter');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const toastContainer = document.getElementById('toastContainer');

  // Initialize App
  function init() {
    setupNavigation();
    setupMobileMenu();
    renderUserHeader();
    
    // Page Renderers
    renderHomeView();
    renderBrowseView();
    renderCartView();
    renderReservationsView();
    renderProfileView();

    updateCartBadge();
  }

  /* -------------------------------------------------------------
     Navigation Controller
     ------------------------------------------------------------- */
  function setupNavigation() {
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-view');
        if (targetView === 'logout') {
          promptLogoutModal();
          return;
        }

        switchView(targetView);
        if (centerNav.classList.contains('mobile-active')) {
          centerNav.classList.remove('mobile-active');
        }
      });
    });

    document.body.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-target-view]');
      if (btn) {
        const view = btn.getAttribute('data-target-view');
        switchView(view);
      }
    });
  }

  function switchView(viewName) {
    state.currentView = viewName;

    navLinks.forEach(link => {
      if (link.getAttribute('data-view') === viewName) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    viewSections.forEach(section => {
      if (section.id === `view-${viewName}`) {
        section.classList.add('active');
      } else {
        section.classList.remove('active');
      }
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function setupMobileMenu() {
    if (mobileMenuBtn) {
      mobileMenuBtn.addEventListener('click', () => {
        centerNav.classList.toggle('mobile-active');
      });
    }
  }

  function renderUserHeader() {
    const userAvatarEl = document.getElementById('headerUserAvatar');
    const userNameEl = document.getElementById('headerUserName');
    const userStatusEl = document.getElementById('headerUserStatus');

    if (userAvatarEl) userAvatarEl.src = state.user.avatar;
    if (userNameEl) userNameEl.textContent = `${state.user.firstName} ${state.user.lastName}`;
    if (userStatusEl) userStatusEl.textContent = state.user.tier;
  }

  /* -------------------------------------------------------------
     PAGE 1: HOME (Resort Overview, Featured Accommodations, Featured Amenities/Add-ons, Quick Booking Access)
     ------------------------------------------------------------- */
  function renderHomeView() {
    const homeContainer = document.getElementById('view-home');
    if (!homeContainer) return;

    // Quick Booking Access Form listener
    const quickBookingForm = document.getElementById('quickBookingForm');
    if (quickBookingForm) {
      quickBookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const category = document.getElementById('quickCategorySelect').value;
        const guests = document.getElementById('quickGuestsSelect').value;
        
        state.activeCategoryFilter = category;
        state.capacityFilter = guests;

        // Sync Browse filters
        const categoryTabs = document.querySelectorAll('.filter-tab');
        categoryTabs.forEach(tab => {
          if (tab.getAttribute('data-category') === category) {
            tab.classList.add('active');
          } else {
            tab.classList.remove('active');
          }
        });

        const capacitySelect = document.getElementById('filterCapacitySelect');
        if (capacitySelect) capacitySelect.value = guests;

        switchView('browse');
        applyBrowseFilters();
        showToast(`Filtered Browse for ${category.toUpperCase()} and ${guests} guests`, 'info');
      });
    }

    // Render Featured Accommodations (Villas / Cottages / Rooms)
    const homeFeaturedGrid = document.getElementById('homeFeaturedGrid');
    if (homeFeaturedGrid) {
      const topItems = state.accommodations.filter(i => i.category !== 'addons').slice(0, 3);
      homeFeaturedGrid.innerHTML = topItems.map(item => createResortCardHTML(item)).join('');
    }

    // Render Featured Amenities & Add-ons Grid
    const homeAmenitiesGrid = document.getElementById('homeAmenitiesGrid');
    if (homeAmenitiesGrid) {
      homeAmenitiesGrid.innerHTML = state.featuredAmenities.map(addon => `
        <div class="card card-hover" style="padding: 1.25rem; display: flex; gap: 1rem; align-items: center;">
          <img src="${addon.image}" alt="${addon.title}" style="width: 90px; height: 80px; border-radius: var(--radius-sm); object-fit: cover;" />
          <div style="flex: 1;">
            <span class="card-tag" style="position: static; font-size: 0.68rem; padding: 0.2rem 0.5rem;">Add-on Experience</span>
            <h4 style="font-size: 1.05rem; margin: 0.3rem 0 0.2rem;">${addon.title}</h4>
            <p style="font-size: 0.82rem; color: var(--color-muted); line-height: 1.4;">${addon.description}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0.6rem;">
              <span style="font-weight: 800; font-family: Outfit; color: var(--color-secondary);">₱${addon.price.toLocaleString()} <small style="font-size: 0.75rem; color: var(--color-muted);">${addon.pricePeriod}</small></span>
              <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${addon.id}">Add to Cart</button>
            </div>
          </div>
        </div>
      `).join('');
    }
  }

  /* -------------------------------------------------------------
     PAGE 2: BROWSE (Rooms, Cottages, Villas, Amenities/Add-ons, Search, Filter by category, price, capacity, details modal)
     ------------------------------------------------------------- */
  function renderBrowseView() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const searchInput = document.getElementById('browseSearchInput');
    const priceSelect = document.getElementById('filterPriceSelect');
    const capacitySelect = document.getElementById('filterCapacitySelect');

    // Category Tabs Filter
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.activeCategoryFilter = tab.getAttribute('data-category');
        applyBrowseFilters();
      });
    });

    // Search Input Filter
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.searchQuery = e.target.value.toLowerCase().trim();
        applyBrowseFilters();
      });
    }

    // Price Select Filter
    if (priceSelect) {
      priceSelect.addEventListener('change', (e) => {
        state.priceFilter = e.target.value;
        applyBrowseFilters();
      });
    }

    // Capacity Select Filter
    if (capacitySelect) {
      capacitySelect.addEventListener('change', (e) => {
        state.capacityFilter = e.target.value;
        applyBrowseFilters();
      });
    }

    applyBrowseFilters();
  }

  function applyBrowseFilters() {
    const browseGrid = document.getElementById('browseGrid');
    if (!browseGrid) return;

    let filtered = state.accommodations;

    // 1. Category Filter (Rooms, Cottages, Villas, Amenities/Add-ons)
    if (state.activeCategoryFilter !== 'all') {
      filtered = filtered.filter(item => item.category === state.activeCategoryFilter);
    }

    // 2. Search Query Filter
    if (state.searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(state.searchQuery) ||
        item.description.toLowerCase().includes(state.searchQuery) ||
        item.tag.toLowerCase().includes(state.searchQuery)
      );
    }

    // 3. Filter by Price
    if (state.priceFilter === 'low') {
      filtered = filtered.filter(item => item.price < 7000);
    } else if (state.priceFilter === 'medium') {
      filtered = filtered.filter(item => item.price >= 7000 && item.price <= 12000);
    } else if (state.priceFilter === 'high') {
      filtered = filtered.filter(item => item.price > 12000);
    }

    // 4. Filter by Capacity
    if (state.capacityFilter === '2') {
      filtered = filtered.filter(item => item.capacity <= 2);
    } else if (state.capacityFilter === '4') {
      filtered = filtered.filter(item => item.capacity >= 3 && item.capacity <= 4);
    } else if (state.capacityFilter === '6') {
      filtered = filtered.filter(item => item.capacity >= 5);
    }

    if (filtered.length === 0) {
      browseGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem; background: var(--color-card); border-radius: var(--radius-lg);">
          <svg class="icon icon-xl" style="color: var(--color-muted); margin-bottom: 1rem;" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <h3 style="margin-bottom: 0.5rem;">No matching resort accommodations or add-ons found</h3>
          <p style="color: var(--color-muted); margin-bottom: 1rem;">Try clearing your price, capacity, or search query filters.</p>
          <button class="btn btn-outline btn-sm" id="resetBrowseFiltersBtn">Reset Filters</button>
        </div>
      `;

      document.getElementById('resetBrowseFiltersBtn')?.addEventListener('click', () => {
        state.activeCategoryFilter = 'all';
        state.priceFilter = 'all';
        state.capacityFilter = 'all';
        state.searchQuery = '';

        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        document.querySelector('.filter-tab[data-category="all"]')?.classList.add('active');
        if (document.getElementById('browseSearchInput')) document.getElementById('browseSearchInput').value = '';
        if (document.getElementById('filterPriceSelect')) document.getElementById('filterPriceSelect').value = 'all';
        if (document.getElementById('filterCapacitySelect')) document.getElementById('filterCapacitySelect').value = 'all';

        applyBrowseFilters();
      });
      return;
    }

    browseGrid.innerHTML = filtered.map(item => createResortCardHTML(item)).join('');
  }

  function createResortCardHTML(item) {
    const formattedPrice = item.price.toLocaleString('en-US');
    return `
      <div class="card resort-card card-hover" data-id="${item.id}">
        <div class="card-img-container">
          <img src="${item.image}" alt="${item.title}" class="card-img" loading="lazy" />
          <span class="card-tag">${item.tag}</span>
          <span class="card-badge-available">${SVG_ICONS.check} Available</span>
        </div>
        <div class="card-body">
          <div class="card-rating">
            ${SVG_ICONS.star} <span>${item.rating}</span>
            <span class="card-rating-count">(${item.reviewsCount} reviews)</span>
          </div>
          <h3 class="card-title">${item.title}</h3>
          <p class="card-description">${item.description}</p>
          <div class="card-amenities">
            ${item.amenities.slice(0, 3).map(am => `<span class="amenity-item">${SVG_ICONS.check} ${am}</span>`).join('')}
          </div>
          <div class="card-footer">
            <div class="card-price-group">
              <span class="price-amount">₱${formattedPrice}</span>
              <span class="price-unit">${item.pricePeriod}</span>
            </div>
            <button class="btn btn-primary btn-sm add-to-cart-btn" data-id="${item.id}">
              <svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
              Book Now
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Delegated Card Click (Details Modal) & Add to Cart
  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-to-cart-btn');
    if (addBtn) {
      e.stopPropagation();
      const itemId = addBtn.getAttribute('data-id');
      addToCart(itemId);
      return;
    }

    const card = e.target.closest('.resort-card');
    if (card && !e.target.closest('.btn')) {
      const itemId = card.getAttribute('data-id');
      openResortModal(itemId);
    }
  });

  /* -------------------------------------------------------------
     PAGE 3: BOOKING CART (Selected Accommodations & Add-ons, Dates, Guests, Nights, Quantity, Subtotal, Discount, Total, Checkout)
     ------------------------------------------------------------- */
  function addToCart(itemId) {
    let found = state.accommodations.find(a => a.id === itemId);
    if (!found) {
      found = state.featuredAmenities.find(a => a.id === itemId);
    }
    if (!found) return;

    const existing = state.cart.find(c => c.accommodationId === itemId);
    if (existing) {
      existing.quantity += 1;
      updateCartBadge();
      renderCartView();
      showToast(`Increased quantity for "${found.title}" to ${existing.quantity}`, 'info');
      switchView('cart');
      return;
    }

    const today = new Date();
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + 7);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 3);

    const newItem = {
      id: 'cart-' + Date.now(),
      accommodationId: found.id,
      itemType: found.type || (found.category === 'addons' ? 'Add-on' : 'Accommodation'),
      title: found.title,
      image: found.image,
      pricePerUnit: found.price,
      pricePeriod: found.pricePeriod,
      checkIn: checkIn.toISOString().split('T')[0],
      checkOut: checkOut.toISOString().split('T')[0],
      nights: 3,
      guests: 2,
      quantity: 1
    };

    state.cart.push(newItem);
    updateCartBadge();
    renderCartView();
    showToast(`Added "${found.title}" to Booking Cart!`, 'success');
  }

  function updateCartBadge() {
    if (cartBadge) {
      const count = state.cart.reduce((sum, i) => sum + i.quantity, 0);
      cartBadge.textContent = count;
      cartBadge.style.display = count === 0 ? 'none' : 'inline-block';
    }
  }

  function renderCartView() {
    const cartList = document.getElementById('cartItemsList');
    const cartSummary = document.getElementById('cartSummaryContainer');
    if (!cartList) return;

    if (state.cart.length === 0) {
      cartList.innerHTML = `
        <div class="card" style="padding: 3.5rem 1.5rem; text-align: center;">
          <svg class="icon icon-xl" style="color: var(--color-muted); margin-bottom: 1rem;" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          <h3 style="margin-bottom: 0.5rem;">Your Booking Cart is empty</h3>
          <p style="color: var(--color-muted); margin-bottom: 1.5rem;">Browse our ocean villas, beach cottages, rooms, and resort add-ons to select your stay.</p>
          <button class="btn btn-primary" data-target-view="browse">Browse Accommodations & Add-ons</button>
        </div>
      `;

      if (cartSummary) {
        cartSummary.innerHTML = `
          <div class="cart-summary-card">
            <h3 class="summary-title">Summary</h3>
            <p style="color: var(--color-muted); font-size: 0.9rem;">No items currently in your cart.</p>
          </div>
        `;
      }
      return;
    }

    // Separate Selected Accommodations and Selected Add-ons
    const accommodationsInCart = state.cart.filter(i => i.itemType !== 'Add-on');
    const addonsInCart = state.cart.filter(i => i.itemType === 'Add-on');

    let cartHTML = '';

    if (accommodationsInCart.length > 0) {
      cartHTML += `<h3 style="font-size: 1.15rem; margin-bottom: 0.75rem; color: var(--color-secondary);">Selected Accommodations (${accommodationsInCart.length})</h3>`;
      cartHTML += accommodationsInCart.map(item => createCartItemRowHTML(item)).join('');
    }

    if (addonsInCart.length > 0) {
      cartHTML += `<h3 style="font-size: 1.15rem; margin: 1.5rem 0 0.75rem; color: var(--color-secondary);">Selected Amenities & Add-ons (${addonsInCart.length})</h3>`;
      cartHTML += addonsInCart.map(item => createCartItemRowHTML(item)).join('');
    }

    cartList.innerHTML = cartHTML;

    // Attach Event Handlers for Quantity, Guests, Dates, and Removal
    cartList.querySelectorAll('.cart-qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cartId = btn.getAttribute('data-cart-id');
        const action = btn.getAttribute('data-action');
        updateCartItemQuantity(cartId, action);
      });
    });

    cartList.querySelectorAll('.cart-guest-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const cartId = select.getAttribute('data-cart-id');
        const item = state.cart.find(c => c.id === cartId);
        if (item) item.guests = parseInt(e.target.value);
        renderCartSummary();
      });
    });

    cartList.querySelectorAll('.cart-date-input').forEach(input => {
      input.addEventListener('change', (e) => {
        const cartId = input.getAttribute('data-cart-id');
        const type = input.getAttribute('data-type');
        updateCartItemDates(cartId, type, e.target.value);
      });
    });

    cartList.querySelectorAll('.remove-cart-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const cartId = btn.getAttribute('data-cart-id');
        removeFromCart(cartId);
      });
    });

    renderCartSummary();
  }

  function createCartItemRowHTML(item) {
    return `
      <div class="cart-item-card" data-cart-id="${item.id}" style="margin-bottom: 1rem;">
        <img src="${item.image}" alt="${item.title}" class="cart-item-img" />
        <div class="cart-item-details">
          <div class="cart-item-header">
            <div>
              <span class="card-tag" style="position: static; font-size: 0.65rem; padding: 0.2rem 0.5rem; margin-bottom: 0.25rem;">${item.itemType}</span>
              <h4 class="cart-item-title">${item.title}</h4>
              <p class="cart-item-subtitle">₱${item.pricePerUnit.toLocaleString()} ${item.pricePeriod}</p>
            </div>
            <button class="remove-cart-btn" data-cart-id="${item.id}" title="Remove Item">
              ${SVG_ICONS.trash}
            </button>
          </div>

          <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 1rem; margin-top: 0.75rem; font-size: 0.85rem;">
            <!-- Dates & Nights -->
            <div class="cart-dates-row" style="margin: 0;">
              <span>${SVG_ICONS.calendar} <strong>Check-in:</strong> <input type="date" class="cart-date-input" data-cart-id="${item.id}" data-type="checkIn" value="${item.checkIn}" style="border:none; background:transparent; font-weight:600;" /></span>
              <span>-</span>
              <span><strong>Check-out:</strong> <input type="date" class="cart-date-input" data-cart-id="${item.id}" data-type="checkOut" value="${item.checkOut}" style="border:none; background:transparent; font-weight:600;" /></span>
              <span>(<strong>${item.nights} Nights</strong>)</span>
            </div>

            <!-- Guest Count -->
            <div style="display: flex; align-items: center; gap: 0.4rem;">
              ${SVG_ICONS.users}
              <span style="font-weight: 600;">Guests:</span>
              <select class="cart-guest-select form-input" data-cart-id="${item.id}" style="padding: 0.2rem 0.5rem; font-size: 0.85rem;">
                <option value="1" ${item.guests === 1 ? 'selected' : ''}>1 Guest</option>
                <option value="2" ${item.guests === 2 ? 'selected' : ''}>2 Guests</option>
                <option value="3" ${item.guests === 3 ? 'selected' : ''}>3 Guests</option>
                <option value="4" ${item.guests === 4 ? 'selected' : ''}>4 Guests</option>
                <option value="6" ${item.guests === 6 ? 'selected' : ''}>6 Guests</option>
              </select>
            </div>

            <!-- Quantity Selector -->
            <div style="display: flex; align-items: center; gap: 0.4rem; margin-left: auto;">
              <span style="font-weight: 600;">Qty:</span>
              <button class="btn btn-outline btn-sm cart-qty-btn" data-cart-id="${item.id}" data-action="decrease" style="padding: 0.25rem 0.5rem;">${SVG_ICONS.minus}</button>
              <span style="font-weight: 700; min-width: 20px; text-align: center;">${item.quantity}</span>
              <button class="btn btn-outline btn-sm cart-qty-btn" data-cart-id="${item.id}" data-action="increase" style="padding: 0.25rem 0.5rem;">${SVG_ICONS.plus}</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function updateCartItemQuantity(cartId, action) {
    const item = state.cart.find(c => c.id === cartId);
    if (!item) return;

    if (action === 'increase') {
      item.quantity += 1;
    } else if (action === 'decrease') {
      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        removeFromCart(cartId);
        return;
      }
    }

    updateCartBadge();
    renderCartView();
  }

  function updateCartItemDates(cartId, fieldType, newValue) {
    const item = state.cart.find(c => c.id === cartId);
    if (!item) return;

    if (fieldType === 'checkIn') item.checkIn = newValue;
    if (fieldType === 'checkOut') item.checkOut = newValue;

    const d1 = new Date(item.checkIn);
    const d2 = new Date(item.checkOut);
    const diffDays = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    item.nights = diffDays > 0 ? diffDays : 1;

    renderCartView();
  }

  function removeFromCart(cartId) {
    state.cart = state.cart.filter(c => c.id !== cartId);
    updateCartBadge();
    renderCartView();
    showToast("Item removed from booking cart.", "info");
  }

  function renderCartSummary() {
    const summaryContainer = document.getElementById('cartSummaryContainer');
    if (!summaryContainer) return;

    let subtotal = 0;
    state.cart.forEach(item => {
      if (item.itemType === 'Add-on') {
        subtotal += item.pricePerUnit * item.quantity;
      } else {
        subtotal += item.pricePerUnit * item.nights * item.quantity;
      }
    });

    const resortFee = subtotal * 0.05;
    const tax = subtotal * 0.12;
    const discountAmount = subtotal * state.discountPercent;
    const grandTotal = subtotal + resortFee + tax - discountAmount;

    summaryContainer.innerHTML = `
      <div class="cart-summary-card">
        <h3 class="summary-title">Booking Cart Summary</h3>

        <div class="summary-row">
          <span>Subtotal (${state.cart.length} line items)</span>
          <span>₱${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="summary-row">
          <span>Resort Service Fee (5%)</span>
          <span>₱${resortFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>
        <div class="summary-row">
          <span>VAT Tax (12%)</span>
          <span>₱${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>

        ${state.discountPercent > 0 ? `
          <div class="summary-row" style="color: var(--color-success); font-weight: 700;">
            <span>VIP Promo Code (${state.discountCode})</span>
            <span>-₱${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        ` : ''}

        <div style="margin: 1.25rem 0;">
          <label style="font-size: 0.82rem; font-weight: 600; color: var(--color-muted); display: block; margin-bottom: 0.35rem;">Have a Promo Code?</label>
          <div style="display: flex; gap: 0.5rem;">
            <input type="text" id="promoCodeInput" placeholder="Try SURAMBAW10" value="${state.discountCode}" class="form-input" style="padding: 0.5rem 0.8rem; font-size: 0.85rem;" />
            <button id="applyPromoBtn" class="btn btn-secondary btn-sm">Apply</button>
          </div>
        </div>

        <div class="summary-row total">
          <span>Total Price</span>
          <span style="color: var(--color-primary);">₱${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
        </div>

        <button id="checkoutBtn" class="btn btn-primary btn-lg" style="width: 100%;">
          <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Proceed to Checkout
        </button>
      </div>
    `;

    document.getElementById('applyPromoBtn')?.addEventListener('click', () => {
      const code = document.getElementById('promoCodeInput').value.trim().toUpperCase();
      if (code === 'SURAMBAW10' || code === 'GOLDVIP') {
        state.discountCode = code;
        state.discountPercent = 0.10;
        showToast("Promo Code Applied! 10% VIP Discount added.", "success");
        renderCartSummary();
      } else if (code) {
        showToast("Invalid Promo Code. Try 'SURAMBAW10'", "info");
      }
    });

    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
      processCheckout(grandTotal);
    });
  }

  function processCheckout(grandTotal) {
    if (state.cart.length === 0) return;

    state.cart.forEach(item => {
      const newRes = {
        id: `RES-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: item.title,
        type: item.itemType,
        image: item.image,
        checkIn: item.checkIn,
        checkOut: item.checkOut,
        nights: item.nights,
        guests: `${item.guests} Guests`,
        quantity: item.quantity,
        totalPrice: item.itemType === 'Add-on' ? item.pricePerUnit * item.quantity : item.pricePerUnit * item.nights * item.quantity,
        status: "Confirmed",
        paymentStatus: "Paid in Full",
        voucherCode: `SBM-${Math.floor(1000 + Math.random() * 9000)}-VIP`,
        qrImage: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=SURAMBAW-CONFIRMED-${item.title}`
      };
      state.reservationsCurrent.unshift(newRes);

      // Synchronize with Python Flask Backend
      if (window.ResortAPI && typeof ResortAPI.createReservation === 'function') {
        ResortAPI.createReservation({
          guest_name: `${state.user.firstName} ${state.user.lastName}`,
          guest_email: state.user.email,
          guest_phone: state.user.phone,
          accommodation_id: item.id,
          accommodation_name: item.title,
          category: item.itemType || 'Villas',
          check_in: item.checkIn,
          check_out: item.checkOut,
          nights: item.nights || 1,
          guests_count: item.guests || 2,
          subtotal: item.pricePerUnit * (item.nights || 1) * item.quantity,
          total: newRes.totalPrice,
          paid: newRes.totalPrice,
          status: "Confirmed"
        }).then(() => {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage({ action: 'reservationCreated' }, '*');
          }
        });
      }
    });

    state.cart = [];
    state.discountCode = '';
    state.discountPercent = 0;

    updateCartBadge();
    renderCartView();
    renderReservationsView();

    switchView('reservations');
    showModal("Checkout Completed Successfully!", `
      <div style="text-align: center; padding: 1rem 0;">
        <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(59, 170, 124, 0.15); color: var(--color-success); display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1rem;">
          ${SVG_ICONS.check}
        </div>
        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem;">Reservation Confirmed!</h3>
        <p style="color: var(--color-muted); margin-bottom: 1.25rem;">Thank you, ${state.user.firstName}! Your booking at Surambaw Beach Resort is locked in. Total paid: <strong>₱${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</strong>.</p>
        <p style="font-size: 0.88rem; background: var(--color-bg); padding: 0.75rem; border-radius: var(--radius-sm);">E-Vouchers & Digital Access QR codes are now active under <strong>Current Reservations</strong>.</p>
      </div>
    `, `
      <button class="btn btn-primary" onclick="document.getElementById('modalBackdrop').classList.remove('active');">View My Reservations</button>
    `);
  }

  /* -------------------------------------------------------------
     PAGE 4: MY RESERVATIONS (Current vs Previous reservations, Status, Details, Booking history, E-Voucher QR)
     ------------------------------------------------------------- */
  function renderReservationsView() {
    const resContainer = document.getElementById('reservationsList');
    if (!resContainer) return;

    // Subtabs: Current Reservations vs Previous Reservations History
    resContainer.innerHTML = `
      <div style="display: flex; gap: 0.5rem; margin-bottom: 1.5rem; border-bottom: 2px solid rgba(36,59,83,0.08); padding-bottom: 0.75rem;">
        <button class="filter-tab ${state.resTab === 'current' ? 'active' : ''}" id="resCurrentTabBtn">
          Current & Upcoming (${state.reservationsCurrent.length})
        </button>
        <button class="filter-tab ${state.resTab === 'previous' ? 'active' : ''}" id="resPreviousTabBtn">
          Previous Stays History (${state.reservationsPrevious.length})
        </button>
      </div>

      <div id="resTabContent"></div>
    `;

    document.getElementById('resCurrentTabBtn')?.addEventListener('click', () => {
      state.resTab = 'current';
      renderReservationsView();
    });

    document.getElementById('resPreviousTabBtn')?.addEventListener('click', () => {
      state.resTab = 'previous';
      renderReservationsView();
    });

    const contentContainer = document.getElementById('resTabContent');
    const itemsToRender = state.resTab === 'current' ? state.reservationsCurrent : state.reservationsPrevious;

    if (itemsToRender.length === 0) {
      contentContainer.innerHTML = `
        <div class="card" style="padding: 3rem 1.5rem; text-align: center;">
          <h3 style="margin-bottom: 0.5rem;">No ${state.resTab === 'current' ? 'Current' : 'Previous'} Reservations</h3>
          <p style="color: var(--color-muted); margin-bottom: 1.5rem;">You currently have no ${state.resTab === 'current' ? 'active or upcoming' : 'past completed'} resort bookings in your account history.</p>
          <button class="btn btn-primary" data-target-view="browse">Browse Accommodations</button>
        </div>
      `;
      return;
    }

    contentContainer.innerHTML = itemsToRender.map(res => `
      <div class="reservation-card" style="margin-bottom: 1.25rem;">
        <div class="reservation-header">
          <div class="res-id">
            ${SVG_ICONS.calendar} <span>Booking Reference: <strong>${res.id}</strong></span>
          </div>
          <span class="res-status-badge ${getReservationStatusClass(res.status)}">
            ${res.status}
          </span>
        </div>
        <div class="reservation-body">
          <img src="${res.image}" alt="${res.title}" class="res-img" />
          <div class="res-info">
            <span class="card-tag" style="position: static; font-size: 0.65rem; padding: 0.2rem 0.5rem; margin-bottom: 0.25rem;">${res.type}</span>
            <h3 class="res-title">${res.title}</h3>
            <div class="res-dates">
              <span class="res-date-item">${SVG_ICONS.calendar} Check-in: <strong>${res.checkIn}</strong></span>
              <span class="res-date-item">${SVG_ICONS.calendar} Check-out: <strong>${res.checkOut}</strong> (${res.nights} Nights)</span>
            </div>
            <div style="font-size: 0.85rem; color: var(--color-muted); margin-top: 0.4rem;">
              Payment: <strong style="color: var(--color-success);">${res.paymentStatus}</strong> | Guests: ${res.guests} | Qty: ${res.quantity} | Total: <strong>₱${res.totalPrice.toLocaleString()}</strong>
            </div>
          </div>
          <div class="res-actions">
            <button class="btn btn-sand btn-sm show-voucher-btn" data-res-id="${res.id}">
              ${SVG_ICONS.qr} View E-Voucher
            </button>
            ${state.resTab === 'current' ? `
              <button class="btn btn-outline btn-sm cancel-res-btn" data-res-id="${res.id}">
                Cancel Booking
              </button>
            ` : ''}
          </div>
        </div>
      </div>
    `).join('');

    // Wire Voucher & Cancel events
    contentContainer.querySelectorAll('.show-voucher-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-res-id');
        openVoucherModal(id);
      });
    });

    contentContainer.querySelectorAll('.cancel-res-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-res-id');
        cancelReservation(id);
      });
    });
  }

  function getReservationStatusClass(status) {
    if (status === 'Confirmed') return 'status-confirmed';
    if (status === 'Pending') return 'status-pending';
    return 'status-completed';
  }

  function openVoucherModal(resId) {
    let res = state.reservationsCurrent.find(r => r.id === resId);
    if (!res) res = state.reservationsPrevious.find(r => r.id === resId);
    if (!res) return;

    showModal(`Resort Access E-Voucher`, `
      <div class="voucher-box">
        <h4 style="font-size: 1.3rem; margin-bottom: 0.25rem; color: var(--color-highlight);">SURAMBAW BEACH RESORT</h4>
        <p style="font-size: 0.82rem; opacity: 0.85; text-transform: uppercase; letter-spacing: 1px;">Official Guest Access Voucher</p>
        
        <div class="qr-placeholder">
          <img src="${res.qrImage}" alt="QR Access Code" />
        </div>

        <p style="font-family: monospace; font-size: 1.1rem; letter-spacing: 2px; font-weight: 700;">${res.voucherCode}</p>
        <p style="font-size: 0.8rem; opacity: 0.8; margin-top: 0.5rem;">Present code at Surambaw Front Concierge desk upon arrival.</p>
      </div>

      <div style="font-size: 0.9rem; line-height: 1.6;">
        <p style="margin-bottom: 0.35rem;"><strong>Guest Name:</strong> ${state.user.firstName} ${state.user.lastName}</p>
        <p style="margin-bottom: 0.35rem;"><strong>Booked Item:</strong> ${res.title} (${res.type})</p>
        <p style="margin-bottom: 0.35rem;"><strong>Check-in / Out:</strong> ${res.checkIn} to ${res.checkOut} (${res.nights} Nights)</p>
        <p style="margin-bottom: 0.35rem;"><strong>Guest Party:</strong> ${res.guests}</p>
        <p><strong>Member Status:</strong> ${state.user.tier} (${state.user.memberId})</p>
      </div>
    `, `
      <button class="btn btn-secondary btn-sm" onclick="window.print();">Print E-Voucher</button>
      <button class="btn btn-primary btn-sm" onclick="document.getElementById('modalBackdrop').classList.remove('active');">Close</button>
    `);
  }

  function cancelReservation(resId) {
    if (confirm(`Are you sure you want to cancel reservation ${resId}? Free cancellation applies for Gold VIP members.`)) {
      state.reservationsCurrent = state.reservationsCurrent.filter(r => r.id !== resId);
      renderReservationsView();
      showToast(`Reservation ${resId} successfully canceled.`, 'info');
    }
  }

  /* -------------------------------------------------------------
     PAGE 5: PROFILE (Personal Information, Contact Information, Account Information, Update Profile)
     ------------------------------------------------------------- */
  function renderProfileView() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    form.innerHTML = `
      <!-- 1. Personal Information -->
      <div style="margin-bottom: 2rem;">
        <h4 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--color-secondary); display: flex; align-items: center; gap: 0.5rem;">
          ${SVG_ICONS.user} Personal Information
        </h4>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">First Name</label>
            <input type="text" id="profFirstName" class="form-input" value="${state.user.firstName}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Last Name</label>
            <input type="text" id="profLastName" class="form-input" value="${state.user.lastName}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Birth Date</label>
            <input type="date" id="profBirthdate" class="form-input" value="${state.user.birthdate}" />
          </div>
          <div class="form-group">
            <label class="form-label">Gender</label>
            <select id="profGender" class="form-input">
              <option value="Male" ${state.user.gender === 'Male' ? 'selected' : ''}>Male</option>
              <option value="Female" ${state.user.gender === 'Female' ? 'selected' : ''}>Female</option>
              <option value="Other" ${state.user.gender === 'Other' ? 'selected' : ''}>Other</option>
            </select>
          </div>
        </div>
      </div>

      <!-- 2. Contact Information -->
      <div style="margin-bottom: 2rem;">
        <h4 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--color-secondary); display: flex; align-items: center; gap: 0.5rem;">
          ${SVG_ICONS.calendar} Contact Information
        </h4>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="profEmail" class="form-input" value="${state.user.email}" required />
          </div>
          <div class="form-group">
            <label class="form-label">Mobile Phone Number</label>
            <input type="tel" id="profPhone" class="form-input" value="${state.user.phone}" required />
          </div>
          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Home Address</label>
            <input type="text" id="profAddress" class="form-input" value="${state.user.address}" />
          </div>
          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Emergency Contact Name & Phone</label>
            <input type="text" id="profEmergency" class="form-input" value="${state.user.emergencyContact}" />
          </div>
        </div>
      </div>

      <!-- 3. Account Information -->
      <div style="margin-bottom: 2rem;">
        <h4 style="font-size: 1.1rem; margin-bottom: 1rem; color: var(--color-secondary); display: flex; align-items: center; gap: 0.5rem;">
          ${SVG_ICONS.qr} Account Information
        </h4>
        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Username</label>
            <input type="text" id="profUsername" class="form-input" value="${state.user.username}" readonly style="background-color: var(--color-bg); opacity: 0.8;" />
          </div>
          <div class="form-group">
            <label class="form-label">Surambaw Member ID</label>
            <input type="text" class="form-input" value="${state.user.memberId}" readonly style="background-color: var(--color-bg); opacity: 0.8;" />
          </div>
          <div class="form-group">
            <label class="form-label">Membership VIP Tier</label>
            <input type="text" class="form-input" value="${state.user.tier}" readonly style="background-color: var(--color-bg); font-weight: 700; color: var(--color-primary);" />
          </div>
          <div class="form-group">
            <label class="form-label">Account Password</label>
            <input type="password" class="form-input" value="••••••••••••" placeholder="Enter new password to change" />
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-primary btn-lg">
        <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
        Update Profile Settings
      </button>
    `;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      state.user.firstName = document.getElementById('profFirstName').value;
      state.user.lastName = document.getElementById('profLastName').value;
      state.user.birthdate = document.getElementById('profBirthdate').value;
      state.user.gender = document.getElementById('profGender').value;
      state.user.email = document.getElementById('profEmail').value;
      state.user.phone = document.getElementById('profPhone').value;
      state.user.address = document.getElementById('profAddress').value;
      state.user.emergencyContact = document.getElementById('profEmergency').value;

      renderUserHeader();
      showToast("Profile settings updated successfully!", "success");
    });
  }

  /* -------------------------------------------------------------
     Modals & Toast Helpers
     ------------------------------------------------------------- */
  function openResortModal(itemId) {
    let item = state.accommodations.find(a => a.id === itemId);
    if (!item) item = state.featuredAmenities.find(a => a.id === itemId);
    if (!item) return;

    showModal(item.title, `
      <div style="margin-bottom: 1.25rem; height: 260px; overflow: hidden; border-radius: var(--radius-md);">
        <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 1rem;">
        <span class="card-tag" style="position: static;">${item.tag}</span>
        <div class="card-rating">${SVG_ICONS.star} ${item.rating || 4.9} (${item.reviewsCount || 100} reviews)</div>
      </div>
      <p style="margin-bottom: 1.25rem; line-height: 1.6; color: var(--color-text);">${item.description}</p>
      
      <div style="background: var(--color-bg); padding: 1rem; border-radius: var(--radius-md); margin-bottom: 1.25rem;">
        <h4 style="font-size: 0.95rem; margin-bottom: 0.5rem; color: var(--color-secondary);">Features & Highlights</h4>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; font-size: 0.88rem;">
          ${(item.amenities || []).map(a => `<div>${SVG_ICONS.check} ${a}</div>`).join('')}
          ${item.capacityText ? `<div>${SVG_ICONS.users} Capacity: ${item.capacityText}</div>` : ''}
          ${item.size ? `<div>${SVG_ICONS.check} Size / Duration: ${item.size}</div>` : ''}
        </div>
      </div>

      <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid rgba(36,59,83,0.1); padding-top: 1rem;">
        <div>
          <span style="font-size: 1.5rem; font-weight: 800; font-family: Outfit; color: var(--color-secondary);">₱${item.price.toLocaleString()}</span>
          <span style="font-size: 0.85rem; color: var(--color-muted);">${item.pricePeriod}</span>
        </div>
      </div>
    `, `
      <button class="btn btn-primary modal-add-cart-btn" data-id="${item.id}">Add to Booking Cart</button>
      <button class="btn btn-outline" onclick="document.getElementById('modalBackdrop').classList.remove('active');">Close</button>
    `);

    document.querySelector('.modal-add-cart-btn')?.addEventListener('click', () => {
      addToCart(item.id);
      modalBackdrop.classList.remove('active');
    });
  }

  function promptLogoutModal() {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ action: 'logout' }, '*');
      return;
    }
    showModal("Confirm Logout", `
      <p style="color: var(--color-text); line-height: 1.6;">Are you sure you want to log out of your Surambaw Beach Resort guest account?</p>
    `, `
      <button class="btn btn-primary" onclick="if(window.ResortAPI) ResortAPI.logout(); window.location.href='/';">Yes, Log Out</button>
      <button class="btn btn-outline" onclick="document.getElementById('modalBackdrop').classList.remove('active');">Cancel</button>
    `);
  }

  function showModal(title, bodyHTML, footerHTML) {
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = bodyHTML;
    if (modalFooter) modalFooter.innerHTML = footerHTML || '';
    if (modalBackdrop) modalBackdrop.classList.add('active');
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => modalBackdrop.classList.remove('active'));
  }
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) modalBackdrop.classList.remove('active');
    });
  }

  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
      <span>${message}</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  init();
});
