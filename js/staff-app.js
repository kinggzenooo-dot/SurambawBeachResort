/**
 * Surambaw Beach Resort - Staff Interface Application JavaScript
 * Controls Staff Dashboard, Front Desk Booking Wizard, Reservation Status Workflow,
 * Guest CRM directory, Accommodations Inspector, and Logout modal.
 */

document.addEventListener('DOMContentLoaded', () => {
  // App State
  const state = {
    currentView: 'dashboard',
    reservations: [...STAFF_DATA.reservations],
    guests: [...STAFF_DATA.guests],
    accommodations: [...STAFF_DATA.accommodations],
    addons: [...STAFF_DATA.addons],

    // Reservation Desk Form State
    deskBooking: {
      guestId: '',
      guestName: '',
      accommodationId: '',
      checkIn: '2026-08-20',
      checkOut: '2026-08-23',
      nights: 3,
      quantity: 1,
      guestsCount: 2,
      selectedAddons: [],
      specialRequests: '',
      discountCode: '',
      discountPercent: 0,
      paymentAmount: 0
    },

    // Reservation Filters
    resSearchQuery: '',
    resStatusFilter: 'all',

    // Guest CRM Filters
    guestSearchQuery: '',

    // Accommodations Filters
    accSearchQuery: '',
    accStatusFilter: 'all'
  };

  // SVG Icons Store
  const SVG_ICONS = {
    home: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
    desk: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M19 21V5a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v16"/><path d="M3 21h18"/><path d="M9 7h6"/><path d="M9 11h6"/></svg>`,
    calendar: `<svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    users: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    hotel: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>`,
    logout: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    check: `<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
    plus: `<svg class="icon icon-sm" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    edit: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    qr: `<svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`
  };

  // DOM Elements
  const navLinks = document.querySelectorAll('.nav-link');
  const viewSections = document.querySelectorAll('.view-section');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const centerNav = document.getElementById('centerNav');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalFooter = document.getElementById('modalFooter');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const toastContainer = document.getElementById('toastContainer');

  function init() {
    setupNavigation();
    setupMobileMenu();

    renderStaffHeader();
    renderDashboardView();
    renderReservationDeskView();
    renderReservationsView();
    renderGuestsView();
    renderAccommodationsView();
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
        switchView(btn.getAttribute('data-target-view'));
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

  function renderStaffHeader() {
    const avatar = document.getElementById('headerStaffAvatar');
    const name = document.getElementById('headerStaffName');
    const role = document.getElementById('headerStaffRole');

    if (avatar) avatar.src = STAFF_DATA.staffUser.avatar;
    if (name) name.textContent = STAFF_DATA.staffUser.name;
    if (role) role.textContent = STAFF_DATA.staffUser.role;
  }

  /* -------------------------------------------------------------
     STAFF PAGE 1: DASHBOARD
     (Recent reservations, Today's check-ins, Today's check-outs, Recent guests, Reservation summary)
     ------------------------------------------------------------- */
  function renderDashboardView() {
    const checkInsContainer = document.getElementById('dashCheckInsQueue');
    const checkOutsContainer = document.getElementById('dashCheckOutsQueue');
    const recentResContainer = document.getElementById('dashRecentResList');
    const recentGuestsContainer = document.getElementById('dashRecentGuestsList');

    // 1. Today's Check-ins Queue
    if (checkInsContainer) {
      checkInsContainer.innerHTML = STAFF_DATA.todaysCheckIns.map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; border-bottom: 1px solid rgba(36,59,83,0.08);">
          <div>
            <strong style="display: block; font-size: 0.95rem;">${item.guestName}</strong>
            <span style="font-size: 0.8rem; color: var(--color-muted);">${item.accommodation} | ETA: ${item.eta}</span>
          </div>
          <button class="btn btn-sand btn-sm checkin-action-btn" data-res-id="${item.id}">
            Process Check-in
          </button>
        </div>
      `).join('');

      checkInsContainer.querySelectorAll('.checkin-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-res-id');
          updateReservationStatus(id, 'Checked-in');
        });
      });
    }

    // 2. Today's Check-outs Queue
    if (checkOutsContainer) {
      checkOutsContainer.innerHTML = STAFF_DATA.todaysCheckOuts.map(item => `
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; border-bottom: 1px solid rgba(36,59,83,0.08);">
          <div>
            <strong style="display: block; font-size: 0.95rem;">${item.guestName}</strong>
            <span style="font-size: 0.8rem; color: var(--color-muted);">${item.accommodation} | Balance: ₱${item.balance.toLocaleString()}</span>
          </div>
          <button class="btn btn-outline btn-sm checkout-action-btn" data-res-id="${item.id}">
            Complete Check-out
          </button>
        </div>
      `).join('');

      checkOutsContainer.querySelectorAll('.checkout-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-res-id');
          updateReservationStatus(id, 'Checked-out');
        });
      });
    }

    // 3. Recent Reservations Table
    if (recentResContainer) {
      const recent = state.reservations.slice(0, 5);
      recentResContainer.innerHTML = recent.map(res => `
        <tr>
          <td><strong style="font-family: Outfit;">${res.id}</strong></td>
          <td>${res.guestName}</td>
          <td>${res.accommodationName}</td>
          <td>${res.checkIn} to ${res.checkOut}</td>
          <td><span class="res-status-badge ${getStatusBadgeClass(res.status)}">${res.status}</span></td>
          <td>₱${res.totalAmount.toLocaleString()}</td>
        </tr>
      `).join('');
    }

    // 4. Recent Guests List
    if (recentGuestsContainer) {
      const recentG = state.guests.slice(0, 4);
      recentGuestsContainer.innerHTML = recentG.map(g => `
        <div style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border-bottom: 1px solid rgba(36,59,83,0.08);">
          <div style="width: 38px; height: 38px; border-radius: 50%; background: var(--color-secondary); color: #fff; display: flex; align-items: center; justify-content: center; font-weight: 700;">
            ${g.firstName.charAt(0)}
          </div>
          <div style="flex: 1;">
            <strong style="font-size: 0.9rem; display: block;">${g.fullName}</strong>
            <span style="font-size: 0.78rem; color: var(--color-muted);">${g.phone} | ${g.vipLevel}</span>
          </div>
        </div>
      `).join('');
    }
  }

  /* -------------------------------------------------------------
     STAFF PAGE 2: RESERVATION DESK
     (Search accommodations/guests, Select/Add guest, Select accommodation/add-ons, Select dates/nights/qty, Special requests, Calculations, Record payment, Calculate balance, Confirm)
     ------------------------------------------------------------- */
  function renderReservationDeskView() {
    const guestSelect = document.getElementById('deskGuestSelect');
    const accSelect = document.getElementById('deskAccSelect');
    const addonsList = document.getElementById('deskAddonsChecklist');
    const form = document.getElementById('deskBookingForm');

    if (!form) return;

    // Populate Guests Dropdown
    if (guestSelect) {
      guestSelect.innerHTML = `<option value="">-- Select Existing Guest --</option>` +
        state.guests.map(g => `<option value="${g.id}">${g.fullName} (${g.phone}) - ${g.vipLevel}</option>`).join('');
    }

    // Populate Accommodations Dropdown
    if (accSelect) {
      accSelect.innerHTML = `<option value="">-- Select Accommodation --</option>` +
        state.accommodations.map(a => `<option value="${a.id}">${a.name} (₱${a.ratePerNight.toLocaleString()}/night) - ${a.status}</option>`).join('');
    }

    // Populate Addons Checkbox List
    if (addonsList) {
      addonsList.innerHTML = state.addons.map(addon => `
        <label style="display: flex; align-items: center; justify-content: space-between; padding: 0.5rem 0.75rem; background: var(--color-bg); border-radius: var(--radius-sm); font-size: 0.88rem; cursor: pointer;">
          <span>
            <input type="checkbox" class="desk-addon-cb" value="${addon.id}" data-price="${addon.price}" />
            <strong>${addon.name}</strong>
          </span>
          <span style="color: var(--color-secondary); font-weight: 700;">+₱${addon.price.toLocaleString()}</span>
        </label>
      `).join('');
    }

    // Calculations Live Listener
    form.addEventListener('input', calculateDeskSummary);
    form.addEventListener('change', calculateDeskSummary);

    // Add New Guest Quick Button Listener
    document.getElementById('deskAddNewGuestBtn')?.addEventListener('click', () => {
      openAddGuestModal();
    });

    // Form Submit (Confirm Reservation)
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      confirmDeskBooking();
    });

    calculateDeskSummary();
  }

  function calculateDeskSummary() {
    const accId = document.getElementById('deskAccSelect')?.value;
    const checkInVal = document.getElementById('deskCheckIn')?.value || '2026-08-20';
    const checkOutVal = document.getElementById('deskCheckOut')?.value || '2026-08-23';
    const qtyVal = parseInt(document.getElementById('deskQuantity')?.value || 1);
    const discountCodeVal = document.getElementById('deskDiscountCode')?.value.trim().toUpperCase();
    const paymentVal = parseFloat(document.getElementById('deskPaymentInput')?.value || 0);

    // Calculate Nights
    const d1 = new Date(checkInVal);
    const d2 = new Date(checkOutVal);
    const diffDays = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24));
    const nights = diffDays > 0 ? diffDays : 1;
    if (document.getElementById('deskNightsDisplay')) {
      document.getElementById('deskNightsDisplay').textContent = `${nights} Nights`;
    }

    let subtotal = 0;
    const acc = state.accommodations.find(a => a.id === accId);
    if (acc) {
      subtotal += acc.ratePerNight * nights * qtyVal;
    }

    // Addons cost
    document.querySelectorAll('.desk-addon-cb:checked').forEach(cb => {
      subtotal += parseFloat(cb.getAttribute('data-price'));
    });

    const serviceFee = subtotal * 0.05;
    const tax = subtotal * 0.12;
    let discountAmount = 0;
    if (discountCodeVal === 'SURAMBAW10' || discountCodeVal === 'STAFF10') {
      discountAmount = subtotal * 0.10;
    }

    const totalAmount = subtotal + serviceFee + tax - discountAmount;
    const balance = totalAmount - paymentVal;

    // Render to Summary UI Elements
    if (document.getElementById('deskSubtotalText')) document.getElementById('deskSubtotalText').textContent = `₱${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (document.getElementById('deskFeeText')) document.getElementById('deskFeeText').textContent = `₱${serviceFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (document.getElementById('deskTaxText')) document.getElementById('deskTaxText').textContent = `₱${tax.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (document.getElementById('deskDiscountText')) document.getElementById('deskDiscountText').textContent = `-₱${discountAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (document.getElementById('deskTotalText')) document.getElementById('deskTotalText').textContent = `₱${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
    if (document.getElementById('deskBalanceText')) {
      const el = document.getElementById('deskBalanceText');
      el.textContent = `₱${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
      el.style.color = balance <= 0 ? 'var(--color-success)' : 'var(--color-primary)';
    }
  }

  function confirmDeskBooking() {
    const guestId = document.getElementById('deskGuestSelect').value;
    const accId = document.getElementById('deskAccSelect').value;
    const checkIn = document.getElementById('deskCheckIn').value;
    const checkOut = document.getElementById('deskCheckOut').value;
    const qty = parseInt(document.getElementById('deskQuantity').value);
    const guestsCount = parseInt(document.getElementById('deskGuestsCount').value);
    const requests = document.getElementById('deskRequests').value;
    const payment = parseFloat(document.getElementById('deskPaymentInput').value || 0);

    if (!guestId || !accId) {
      showToast("Please select both a Guest and an Accommodation.", "info");
      return;
    }

    const guest = state.guests.find(g => g.id === guestId);
    const acc = state.accommodations.find(a => a.id === accId);

    const d1 = new Date(checkIn);
    const d2 = new Date(checkOut);
    const nights = Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)) || 1;

    let subtotal = acc.ratePerNight * nights * qty;
    document.querySelectorAll('.desk-addon-cb:checked').forEach(cb => {
      subtotal += parseFloat(cb.getAttribute('data-price'));
    });

    const taxAndFees = (subtotal * 0.05) + (subtotal * 0.12);
    const totalAmount = subtotal + taxAndFees;
    const balance = totalAmount - payment;
    let paymentStatus = "Unpaid";
    if (payment >= totalAmount) paymentStatus = "Paid in Full";
    else if (payment > 0) paymentStatus = "Partial Deposit";

    const newRes = {
      id: `RES-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      guestId: guest.id,
      guestName: guest.fullName,
      accommodationId: acc.id,
      accommodationName: acc.name,
      checkIn: checkIn,
      checkOut: checkOut,
      nights: nights,
      guests: guestsCount,
      quantity: qty,
      subtotal: subtotal,
      discount: 0,
      taxAndFees: taxAndFees,
      totalAmount: totalAmount,
      paymentRecorded: payment,
      balance: balance,
      paymentStatus: paymentStatus,
      status: "Confirmed",
      specialRequests: requests,
      bookingDate: new Date().toISOString().split('T')[0]
    };

    state.reservations.unshift(newRes);
    acc.status = 'Occupied';

    // Synchronize to Python Flask SQLite Backend
    if (window.ResortAPI && typeof ResortAPI.createReservation === 'function') {
      ResortAPI.createReservation({
        guest_name: guest.fullName,
        guest_email: guest.email,
        guest_phone: guest.phone,
        accommodation_id: acc.id,
        accommodation_name: acc.name,
        category: acc.category || 'Villas',
        check_in: checkIn,
        check_out: checkOut,
        nights: nights,
        guests_count: guestsCount,
        subtotal: subtotal,
        tax: taxAndFees,
        discount: 0,
        total: totalAmount,
        paid: payment,
        status: "Confirmed",
        special_requests: requests
      }).then(() => {
        if (window.parent && window.parent !== window) {
          window.parent.postMessage({ action: 'reservationCreated' }, '*');
        }
      });
    }

    renderDashboardView();
    renderReservationsView();
    renderAccommodationsView();

    showToast(`Reservation ${newRes.id} confirmed for ${guest.fullName}!`, "success");
    switchView('reservations');
  }

  /* -------------------------------------------------------------
     STAFF PAGE 3: RESERVATIONS MANAGER
     (View, Search, Filter by Status, Reservation details modal, Update status, Cancel reservation, Booking history)
     ------------------------------------------------------------- */
  function renderReservationsView() {
    const tableBody = document.getElementById('staffReservationsTableBody');
    const searchInput = document.getElementById('resSearchInput');
    const statusSelect = document.getElementById('resStatusFilterSelect');

    if (!tableBody) return;

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.resSearchQuery = e.target.value.toLowerCase().trim();
        applyReservationsFilter();
      });
    }

    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        state.resStatusFilter = e.target.value;
        applyReservationsFilter();
      });
    }

    applyReservationsFilter();
  }

  function applyReservationsFilter() {
    const tableBody = document.getElementById('staffReservationsTableBody');
    if (!tableBody) return;

    let filtered = state.reservations;

    if (state.resStatusFilter !== 'all') {
      filtered = filtered.filter(r => r.status.toLowerCase() === state.resStatusFilter.toLowerCase());
    }

    if (state.resSearchQuery) {
      filtered = filtered.filter(r =>
        r.id.toLowerCase().includes(state.resSearchQuery) ||
        r.guestName.toLowerCase().includes(state.resSearchQuery) ||
        r.accommodationName.toLowerCase().includes(state.resSearchQuery)
      );
    }

    if (filtered.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem; color: var(--color-muted);">No matching reservations found.</td></tr>`;
      return;
    }

    tableBody.innerHTML = filtered.map(res => `
      <tr>
        <td><strong style="font-family: Outfit;">${res.id}</strong></td>
        <td>${res.guestName}</td>
        <td>${res.accommodationName}</td>
        <td>${res.checkIn} to ${res.checkOut} (${res.nights}N)</td>
        <td>
          <select class="res-status-updater form-input" data-res-id="${res.id}" style="padding: 0.25rem 0.5rem; font-size: 0.8rem; font-weight:700;">
            <option value="Pending" ${res.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="Confirmed" ${res.status === 'Confirmed' ? 'selected' : ''}>Confirmed</option>
            <option value="Checked-in" ${res.status === 'Checked-in' ? 'selected' : ''}>Checked-in</option>
            <option value="Checked-out" ${res.status === 'Checked-out' ? 'selected' : ''}>Checked-out</option>
            <option value="Cancelled" ${res.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
        <td>
          <div>₱${res.totalAmount.toLocaleString()}</div>
          <small style="font-size:0.75rem; color: ${res.balance <= 0 ? 'var(--color-success)' : 'var(--color-primary)'}">
            ${res.balance <= 0 ? 'Paid' : `Bal: ₱${res.balance.toLocaleString()}`}
          </small>
        </td>
        <td>
          <button class="btn btn-sand btn-sm view-res-details-btn" data-res-id="${res.id}">Details</button>
        </td>
      </tr>
    `).join('');

    // Attach status update listener
    tableBody.querySelectorAll('.res-status-updater').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = select.getAttribute('data-res-id');
        const newStatus = e.target.value;
        updateReservationStatus(id, newStatus);
      });
    });

    // Attach Details modal listener
    tableBody.querySelectorAll('.view-res-details-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-res-id');
        openReservationDetailsModal(id);
      });
    });
  }

  function updateReservationStatus(resId, newStatus) {
    const res = state.reservations.find(r => r.id === resId);
    if (!res) return;

    res.status = newStatus;

    // Synchronize status with Python Flask Backend
    if (window.ResortAPI && typeof ResortAPI.updateReservationStatus === 'function') {
      ResortAPI.updateReservationStatus(resId, newStatus);
    }

    showToast(`Reservation ${resId} status updated to "${newStatus}"`, "success");

    renderDashboardView();
    renderReservationsView();
  }

  function openReservationDetailsModal(resId) {
    const res = state.reservations.find(r => r.id === resId);
    if (!res) return;

    showModal(`Reservation Details: ${res.id}`, `
      <div style="font-size: 0.95rem; line-height: 1.6;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; padding-bottom: 0.75rem; border-bottom: 1px solid rgba(36,59,83,0.1);">
          <div>
            <strong style="font-size: 1.1rem; display: block;">${res.guestName}</strong>
            <span style="color: var(--color-muted);">Booking Date: ${res.bookingDate}</span>
          </div>
          <span class="res-status-badge ${getStatusBadgeClass(res.status)}">${res.status}</span>
        </div>

        <p style="margin-bottom: 0.4rem;"><strong>Accommodation:</strong> ${res.accommodationName}</p>
        <p style="margin-bottom: 0.4rem;"><strong>Dates:</strong> ${res.checkIn} to ${res.checkOut} (${res.nights} Nights)</p>
        <p style="margin-bottom: 0.4rem;"><strong>Guests Count:</strong> ${res.guests} Guests</p>
        <p style="margin-bottom: 0.4rem;"><strong>Special Requests:</strong> ${res.specialRequests || 'None'}</p>

        <div style="background: var(--color-bg); padding: 1rem; border-radius: var(--radius-md); margin: 1rem 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
            <span>Subtotal:</span> <strong>₱${res.subtotal.toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem;">
            <span>Taxes & Fees:</span> <strong>₱${res.taxAndFees.toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.4rem; font-size: 1.1rem; color: var(--color-secondary);">
            <span>Total Amount:</span> <strong>₱${res.totalAmount.toLocaleString()}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; font-weight: 700; color: ${res.balance <= 0 ? 'var(--color-success)' : 'var(--color-primary)'}">
            <span>Remaining Balance:</span> <span>₱${res.balance.toLocaleString()}</span>
          </div>
        </div>
      </div>
    `, `
      <button class="btn btn-primary btn-sm" onclick="document.getElementById('modalBackdrop').classList.remove('active');">Close</button>
    `);
  }

  /* -------------------------------------------------------------
     STAFF PAGE 4: GUEST CRM (Search, Add, View, Edit, Profile, History)
     ------------------------------------------------------------- */
  function renderGuestsView() {
    const tableBody = document.getElementById('staffGuestsTableBody');
    const searchInput = document.getElementById('guestSearchInput');

    if (!tableBody) return;

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.guestSearchQuery = e.target.value.toLowerCase().trim();
        applyGuestsFilter();
      });
    }

    document.getElementById('addNewGuestModalBtn')?.addEventListener('click', () => {
      openAddGuestModal();
    });

    applyGuestsFilter();
  }

  function applyGuestsFilter() {
    const tableBody = document.getElementById('staffGuestsTableBody');
    if (!tableBody) return;

    let filtered = state.guests;
    if (state.guestSearchQuery) {
      filtered = filtered.filter(g =>
        g.fullName.toLowerCase().includes(state.guestSearchQuery) ||
        g.email.toLowerCase().includes(state.guestSearchQuery) ||
        g.phone.toLowerCase().includes(state.guestSearchQuery)
      );
    }

    tableBody.innerHTML = filtered.map(g => `
      <tr>
        <td><strong style="font-family: Outfit;">${g.id}</strong></td>
        <td>${g.fullName}</td>
        <td>${g.email}<br/><small style="color:var(--color-muted)">${g.phone}</small></td>
        <td><span class="res-status-badge status-confirmed">${g.vipLevel}</span></td>
        <td>${g.totalStays} Stays</td>
        <td>
          <button class="btn btn-sand btn-sm view-guest-btn" data-guest-id="${g.id}">View Profile</button>
        </td>
      </tr>
    `).join('');

    tableBody.querySelectorAll('.view-guest-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-guest-id');
        openGuestProfileModal(id);
      });
    });
  }

  function openAddGuestModal() {
    showModal("Add New Guest Record", `
      <form id="newGuestForm" class="form-grid">
        <div class="form-group">
          <label class="form-label">First Name</label>
          <input type="text" id="addGFirstName" class="form-input" required />
        </div>
        <div class="form-group">
          <label class="form-label">Last Name</label>
          <input type="text" id="addGLastName" class="form-input" required />
        </div>
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input type="email" id="addGEmail" class="form-input" required />
        </div>
        <div class="form-group">
          <label class="form-label">Phone Number</label>
          <input type="tel" id="addGPhone" class="form-input" required />
        </div>
        <div class="form-group" style="grid-column: 1 / -1;">
          <label class="form-label">Special Notes / Preferences</label>
          <input type="text" id="addGNotes" class="form-input" placeholder="Dietary, room location preferences..." />
        </div>
      </form>
    `, `
      <button class="btn btn-primary" id="saveNewGuestBtn">Save Guest Record</button>
      <button class="btn btn-outline" onclick="document.getElementById('modalBackdrop').classList.remove('active');">Cancel</button>
    `);

    document.getElementById('saveNewGuestBtn')?.addEventListener('click', () => {
      const fName = document.getElementById('addGFirstName').value.trim();
      const lName = document.getElementById('addGLastName').value.trim();
      const email = document.getElementById('addGEmail').value.trim();
      const phone = document.getElementById('addGPhone').value.trim();
      const notes = document.getElementById('addGNotes').value.trim();

      if (!fName || !lName || !phone) {
        alert("Please fill in First Name, Last Name, and Phone.");
        return;
      }

      const newG = {
        id: `GUEST-${Math.floor(100 + Math.random() * 900)}`,
        firstName: fName,
        lastName: lName,
        fullName: `${fName} ${lName}`,
        email: email,
        phone: phone,
        address: "Manila",
        vipLevel: "Standard Guest",
        totalStays: 0,
        notes: notes || "New walk-in guest.",
        createdDate: new Date().toISOString().split('T')[0]
      };

      state.guests.unshift(newG);
      renderGuestsView();
      renderReservationDeskView();
      modalBackdrop.classList.remove('active');
      showToast(`Guest ${newG.fullName} added successfully!`, "success");
    });
  }

  function openGuestProfileModal(guestId) {
    const g = state.guests.find(item => item.id === guestId);
    if (!g) return;

    const guestStays = state.reservations.filter(r => r.guestId === g.id || r.guestName.includes(g.firstName));

    showModal(`Guest CRM Profile: ${g.fullName}`, `
      <div style="font-size: 0.92rem; line-height: 1.6;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; border-bottom: 1px solid rgba(36,59,83,0.1); padding-bottom: 0.75rem;">
          <div>
            <strong style="font-size: 1.2rem;">${g.fullName}</strong>
            <div style="color: var(--color-muted);">${g.email} | ${g.phone}</div>
          </div>
          <span class="res-status-badge status-confirmed">${g.vipLevel}</span>
        </div>

        <p style="margin-bottom: 0.4rem;"><strong>Address:</strong> ${g.address}</p>
        <p style="margin-bottom: 0.4rem;"><strong>Member Since:</strong> ${g.createdDate}</p>
        <p style="margin-bottom: 0.8rem;"><strong>Preferences & Notes:</strong> ${g.notes}</p>

        <h4 style="font-size: 1rem; margin: 1.25rem 0 0.5rem; color: var(--color-secondary);">Reservation & Stay History (${guestStays.length})</h4>
        ${guestStays.length === 0 ? '<p style="color:var(--color-muted);">No stay history recorded yet.</p>' : `
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${guestStays.map(s => `
              <div style="background: var(--color-bg); padding: 0.75rem; border-radius: var(--radius-sm); font-size: 0.85rem; display: flex; justify-content: space-between;">
                <div>
                  <strong>${s.id}</strong> - ${s.accommodationName} (${s.checkIn} to ${s.checkOut})
                </div>
                <span class="res-status-badge ${getStatusBadgeClass(s.status)}">${s.status}</span>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `, `
      <button class="btn btn-primary btn-sm" onclick="document.getElementById('modalBackdrop').classList.remove('active');">Close</button>
    `);
  }

  /* -------------------------------------------------------------
     STAFF PAGE 5: ACCOMMODATIONS INSPECTOR
     (Search, View details, Check availability, View rates, capacity, amenities)
     ------------------------------------------------------------- */
  function renderAccommodationsView() {
    const container = document.getElementById('staffAccommodationsGrid');
    const searchInput = document.getElementById('accSearchInput');
    const statusSelect = document.getElementById('accStatusSelect');

    if (!container) return;

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        state.accSearchQuery = e.target.value.toLowerCase().trim();
        applyAccommodationsFilter();
      });
    }

    if (statusSelect) {
      statusSelect.addEventListener('change', (e) => {
        state.accStatusFilter = e.target.value;
        applyAccommodationsFilter();
      });
    }

    applyAccommodationsFilter();
  }

  function applyAccommodationsFilter() {
    const container = document.getElementById('staffAccommodationsGrid');
    if (!container) return;

    let filtered = state.accommodations;

    if (state.accStatusFilter !== 'all') {
      filtered = filtered.filter(a => a.status.toLowerCase() === state.accStatusFilter.toLowerCase());
    }

    if (state.accSearchQuery) {
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(state.accSearchQuery) ||
        a.code.toLowerCase().includes(state.accSearchQuery) ||
        a.category.toLowerCase().includes(state.accSearchQuery)
      );
    }

    container.innerHTML = filtered.map(acc => `
      <div class="card" style="padding: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.75rem;">
          <div>
            <span class="card-tag" style="position: static; font-size: 0.65rem;">${acc.code} | ${acc.category}</span>
            <h3 style="font-size: 1.15rem; margin-top: 0.25rem;">${acc.name}</h3>
          </div>
          <span class="res-status-badge ${getAccStatusClass(acc.status)}">${acc.status}</span>
        </div>

        <div style="font-size: 0.88rem; line-height: 1.6; margin-bottom: 1rem;">
          <p><strong>Nightly Rate:</strong> ₱${acc.ratePerNight.toLocaleString()}</p>
          <p><strong>Max Capacity:</strong> ${acc.capacityText}</p>
          <p><strong>Floor Area:</strong> ${acc.size}</p>
          <p><strong>Housekeeper On Duty:</strong> ${acc.housekeeper}</p>
        </div>

        <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 1rem;">
          ${acc.amenities.map(am => `<span style="background: var(--color-bg); font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px;">${am}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  function getAccStatusClass(status) {
    if (status === 'Available') return 'status-confirmed';
    if (status === 'Occupied') return 'status-pending';
    return 'status-completed';
  }

  function getStatusBadgeClass(status) {
    if (status === 'Confirmed') return 'status-confirmed';
    if (status === 'Pending') return 'status-pending';
    if (status === 'Checked-in') return 'status-confirmed';
    return 'status-completed';
  }

  function promptLogoutModal() {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ action: 'logout' }, '*');
      return;
    }
    showModal("Confirm Staff Session Logout", `
      <p style="line-height: 1.6;">Are you sure you want to end your Staff Portal session (${STAFF_DATA.staffUser.name})?</p>
    `, `
      <button class="btn btn-primary" onclick="if(window.ResortAPI) ResortAPI.logout(); window.location.href='/';">Log Out to Home</button>
      <button class="btn btn-outline" onclick="document.getElementById('modalBackdrop').classList.remove('active');">Cancel</button>
    `);
  }

  function showModal(title, bodyHTML, footerHTML) {
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = bodyHTML;
    if (modalFooter) modalFooter.innerHTML = footerHTML || '';
    if (modalBackdrop) modalBackdrop.classList.add('active');
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', () => modalBackdrop.classList.remove('active'));
  if (modalBackdrop) modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) modalBackdrop.classList.remove('active');
  });

  function showToast(message, type = 'info') {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `<svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg> <span>${message}</span>`;
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
