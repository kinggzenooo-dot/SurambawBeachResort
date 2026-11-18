/**
 * Surambaw Beach Resort - Executive Admin Portal Application JavaScript
 * SPA Routing & Logic for Dashboard, Reservations, Guests CRM, Accommodations,
 * Categories, Rates, Inventory, Revenue, Reports, Performance, Staff/Users, Notifications, Settings.
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  const state = {
    currentView: 'dashboard',
    inventoryItems: [...ADMIN_DATA.inventoryOverview.items],
    inventoryHistory: [...ADMIN_DATA.inventoryOverview.history],
    categories: [...ADMIN_DATA.categories],
    rates: [...ADMIN_DATA.rates],
    staffAccounts: [...ADMIN_DATA.staffAccounts],
    notifications: [...ADMIN_DATA.notifications],
    settings: { ...ADMIN_DATA.settings },

    // Filters
    invFilter: 'all',
    revFilter: 'month'
  };

  // SVG Icons Store (No emojis used)
  const SVG_ICONS = {
    dashboard: `<svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>`,
    calendar: `<svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    users: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    hotel: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M18 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"/><path d="M9 22v-4h6v4"/></svg>`,
    tag: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>`,
    dollar: `<svg class="icon icon-sm" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
    box: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>`,
    trending: `<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`,
    barChart: `<svg class="icon icon-sm" viewBox="0 0 24 24"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>`,
    lock: `<svg class="icon icon-sm" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    bell: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>`,
    settings: `<svg class="icon icon-sm" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    logout: `<svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    check: `<svg class="icon icon-sm" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`,
    plus: `<svg class="icon icon-sm" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
  };

  // DOM Elements
  const navLinks = document.querySelectorAll('.admin-nav-link');
  const viewSections = document.querySelectorAll('.view-section');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const modalFooter = document.getElementById('modalFooter');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const toastContainer = document.getElementById('toastContainer');

  function init() {
    setupNavigation();
    renderAdminHeader();

    // Render Admin Page Views
    renderDashboardView();
    renderInventoryView();
    renderCategoriesView();
    renderRatesView();
    renderRevenueView();
    renderReportsView();
    renderPerformanceView();
    renderStaffUsersView();
    renderNotificationsView();
    renderSettingsView();
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
      });
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

  function renderAdminHeader() {
    const avatar = document.getElementById('headerAdminAvatar');
    const name = document.getElementById('headerAdminName');
    if (avatar) avatar.src = ADMIN_DATA.adminUser.avatar;
    if (name) name.textContent = ADMIN_DATA.adminUser.name;
  }

  /* -------------------------------------------------------------
     1. ADMIN DASHBOARD
     (Revenue Overview, Accommodation Performance, Inventory Overview, Guest Overview, Recent Activity)
     ------------------------------------------------------------- */
  function renderDashboardView() {
    const rankContainer = document.getElementById('dashRankingsList');
    const activityContainer = document.getElementById('dashRecentActivityList');
    const topGuestsContainer = document.getElementById('dashTopGuestsList');

    // 1. Accommodation Rankings Table
    if (rankContainer) {
      rankContainer.innerHTML = ADMIN_DATA.accommodationPerformance.rankings.map(r => `
        <tr>
          <td><strong style="color: var(--color-primary);">#${r.rank}</strong></td>
          <td><strong>${r.name}</strong></td>
          <td><span class="res-status-badge status-confirmed">${r.category}</span></td>
          <td>${r.bookings} Bookings</td>
          <td>₱${r.revenue.toLocaleString()}</td>
          <td><strong style="color: var(--color-success);">${r.occupancyRate}</strong></td>
        </tr>
      `).join('');
    }

    // 2. Recent System Activity Stream
    if (activityContainer) {
      activityContainer.innerHTML = ADMIN_DATA.recentActivity.map(act => `
        <div style="display: flex; gap: 0.85rem; padding: 0.75rem 0; border-bottom: 1px solid rgba(36,59,83,0.08);">
          <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(255,127,106,0.15); color: var(--color-primary); display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
            ${SVG_ICONS.bell}
          </div>
          <div style="flex: 1;">
            <strong style="font-size: 0.9rem; display: block;">${act.title}</strong>
            <p style="font-size: 0.82rem; color: var(--color-muted);">${act.desc}</p>
            <span style="font-size: 0.75rem; color: var(--color-muted);">${act.time}</span>
          </div>
        </div>
      `).join('');
    }

    // 3. Top Guests List
    if (topGuestsContainer) {
      topGuestsContainer.innerHTML = ADMIN_DATA.guestOverview.topGuests.map(g => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.65rem 0; border-bottom: 1px solid rgba(36,59,83,0.08);">
          <div>
            <strong style="display: block; font-size: 0.9rem;">${g.name}</strong>
            <span style="font-size: 0.78rem; color: var(--color-muted);">${g.visits} Stays | ${g.tier}</span>
          </div>
          <span style="font-weight: 800; font-family: Outfit; color: var(--color-secondary);">₱${g.totalSpent.toLocaleString()}</span>
        </div>
      `).join('');
    }
  }

  /* -------------------------------------------------------------
     2. INVENTORY MANAGER (All Items, Low Stock, Out of Stock, Add/Deduct Stock modal, Stock History)
     ------------------------------------------------------------- */
  function renderInventoryView() {
    const tableBody = document.getElementById('adminInventoryTableBody');
    const filterTabs = document.querySelectorAll('.inv-filter-tab');

    if (!tableBody) return;

    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        state.invFilter = tab.getAttribute('data-inv');
        applyInventoryFilter();
      });
    });

    document.getElementById('openAddStockModalBtn')?.addEventListener('click', () => {
      openStockModal('add');
    });

    applyInventoryFilter();
    renderStockHistoryLog();
  }

  function applyInventoryFilter() {
    const tableBody = document.getElementById('adminInventoryTableBody');
    if (!tableBody) return;

    let filtered = state.inventoryItems;
    if (state.invFilter === 'low') {
      filtered = filtered.filter(i => i.status === 'Low Stock');
    } else if (state.invFilter === 'out') {
      filtered = filtered.filter(i => i.status === 'Out of Stock');
    }

    tableBody.innerHTML = filtered.map(item => `
      <tr>
        <td><strong style="font-family: Outfit;">${item.id}</strong></td>
        <td><strong>${item.name}</strong></td>
        <td>${item.category}</td>
        <td><span style="font-size: 1.1rem; font-weight: 800;">${item.inStock}</span> ${item.unit}</td>
        <td><span class="res-status-badge ${getInvBadgeClass(item.status)}">${item.status}</span></td>
        <td>
          <button class="btn btn-sand btn-sm adjust-stock-btn" data-inv-id="${item.id}" data-action="add">+ Add</button>
          <button class="btn btn-outline btn-sm adjust-stock-btn" data-inv-id="${item.id}" data-action="deduct">- Deduct</button>
        </td>
      </tr>
    `).join('');

    tableBody.querySelectorAll('.adjust-stock-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-inv-id');
        const action = btn.getAttribute('data-action');
        openStockAdjustmentModal(id, action);
      });
    });
  }

  function getInvBadgeClass(status) {
    if (status === 'In Stock') return 'status-confirmed';
    if (status === 'Low Stock') return 'status-pending';
    return 'status-completed';
  }

  function openStockAdjustmentModal(itemId, action) {
    const item = state.inventoryItems.find(i => i.id === itemId);
    if (!item) return;

    showModal(`${action === 'add' ? 'Add' : 'Deduct'} Inventory Stock: ${item.name}`, `
      <div style="font-size: 0.95rem; margin-bottom: 1rem;">
        Current Stock Level: <strong>${item.inStock} ${item.unit}</strong>
      </div>
      <div class="form-group">
        <label class="form-label">Quantity to ${action === 'add' ? 'Add' : 'Deduct'}</label>
        <input type="number" id="adjustQtyInput" class="form-input" min="1" value="10" required />
      </div>
    `, `
      <button class="btn btn-primary" id="confirmStockAdjustBtn">Confirm Adjustment</button>
      <button class="btn btn-outline" onclick="document.getElementById('modalBackdrop').classList.remove('active');">Cancel</button>
    `);

    document.getElementById('confirmStockAdjustBtn')?.addEventListener('click', () => {
      const qty = parseInt(document.getElementById('adjustQtyInput').value);
      if (!qty || qty <= 0) return;

      if (action === 'add') {
        item.inStock += qty;
      } else {
        item.inStock = Math.max(0, item.inStock - qty);
      }

      if (item.inStock === 0) item.status = 'Out of Stock';
      else if (item.inStock <= item.minThreshold) item.status = 'Low Stock';
      else item.status = 'In Stock';

      state.inventoryHistory.unshift({
        date: new Date().toISOString().split('T')[0],
        item: item.name,
        action: `${action === 'add' ? 'Added' : 'Deducted'} ${qty} ${item.unit}`,
        staff: ADMIN_DATA.adminUser.name
      });

      // Synchronize with Python Flask Backend
      if (window.ResortAPI && typeof ResortAPI.adjustInventory === 'function') {
        ResortAPI.adjustInventory(item.id, qty, action, ADMIN_DATA.adminUser.name);
      }

      renderInventoryView();
      modalBackdrop.classList.remove('active');
      showToast(`Stock updated for "${item.name}". New Level: ${item.inStock}`, 'success');
    });
  }

  function renderStockHistoryLog() {
    const historyContainer = document.getElementById('adminStockHistoryLog');
    if (!historyContainer) return;

    historyContainer.innerHTML = state.inventoryHistory.map(h => `
      <div style="display: flex; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid rgba(36,59,83,0.08); font-size: 0.85rem;">
        <div>
          <strong>${h.item}</strong> - ${h.action}
          <div style="font-size: 0.78rem; color: var(--color-muted);">Logged by ${h.staff}</div>
        </div>
        <span style="color: var(--color-muted);">${h.date}</span>
      </div>
    `).join('');
  }

  /* -------------------------------------------------------------
     3. CATEGORIES MANAGER (Standard Room, Deluxe Room, Beachfront Cottage, Family Villa, Overwater Bungalow, Add-ons)
     ------------------------------------------------------------- */
  function renderCategoriesView() {
    const container = document.getElementById('adminCategoriesGrid');
    if (!container) return;

    container.innerHTML = state.categories.map(c => `
      <div class="card" style="padding: 1.5rem;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 0.5rem;">
          <span class="card-tag" style="position: static;">${c.code}</span>
          <strong style="font-size: 1.2rem; font-family: Outfit; color: var(--color-secondary);">₱${c.avgRate.toLocaleString()}/nt</strong>
        </div>
        <h3 style="font-size: 1.2rem; margin-bottom: 0.5rem;">${c.name}</h3>
        <p style="font-size: 0.88rem; color: var(--color-muted); margin-bottom: 1rem; line-height: 1.5;">${c.description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid rgba(36,59,83,0.08); padding-top: 0.75rem; font-size: 0.85rem;">
          <span>Inventory Units: <strong>${c.totalUnits} Units</strong></span>
          <button class="btn btn-outline btn-sm" onclick="alert('Category ${c.name} details editable.')">Edit Category</button>
        </div>
      </div>
    `).join('');

    document.getElementById('addCategoryModalBtn')?.addEventListener('click', () => {
      showModal("Add New Resort Category", `
        <form class="form-grid">
          <div class="form-group">
            <label class="form-label">Category Name</label>
            <input type="text" id="catName" class="form-input" placeholder="e.g. Presidential Bungalow" required />
          </div>
          <div class="form-group">
            <label class="form-label">Category Code</label>
            <input type="text" id="catCode" class="form-input" placeholder="e.g. PRES-BUNG" required />
          </div>
          <div class="form-group">
            <label class="form-label">Base Rate (₱)</label>
            <input type="number" id="catRate" class="form-input" value="12000" required />
          </div>
          <div class="form-group">
            <label class="form-label">Total Units</label>
            <input type="number" id="catUnits" class="form-input" value="5" required />
          </div>
          <div class="form-group" style="grid-column: 1 / -1;">
            <label class="form-label">Description</label>
            <textarea id="catDesc" class="form-input" rows="2"></textarea>
          </div>
        </form>
      `, `
        <button class="btn btn-primary" id="saveCatBtn">Save Category</button>
        <button class="btn btn-outline" onclick="document.getElementById('modalBackdrop').classList.remove('active');">Cancel</button>
      `);

      document.getElementById('saveCatBtn')?.addEventListener('click', () => {
        const name = document.getElementById('catName').value;
        const code = document.getElementById('catCode').value;
        const rate = parseFloat(document.getElementById('catRate').value);
        const units = parseInt(document.getElementById('catUnits').value);
        const desc = document.getElementById('catDesc').value;

        if (!name || !code) return;

        state.categories.push({
          id: `CAT-${state.categories.length + 1}`,
          name, code, description: desc || 'Resort category', totalUnits: units, avgRate: rate
        });

        renderCategoriesView();
        modalBackdrop.classList.remove('active');
        showToast(`Category "${name}" created!`, "success");
      });
    });
  }

  /* -------------------------------------------------------------
     4. RATES MANAGER (Accommodation Rates, Seasonal Pricing, Add-on Pricing)
     ------------------------------------------------------------- */
  function renderRatesView() {
    const container = document.getElementById('adminRatesTableBody');
    if (!container) return;

    container.innerHTML = state.rates.map(r => `
      <tr>
        <td><strong>${r.category}</strong></td>
        <td>₱${r.standardRate.toLocaleString()}</td>
        <td><strong style="color: var(--color-primary);">₱${r.peakSeasonRate.toLocaleString()}</strong></td>
        <td><span style="color: var(--color-success);">₱${r.lowSeasonRate.toLocaleString()}</span></td>
        <td><span class="res-status-badge status-confirmed">${r.status}</span></td>
        <td><button class="btn btn-sand btn-sm" onclick="alert('Rate schedule updated.');">Adjust Rates</button></td>
      </tr>
    `).join('');
  }

  /* -------------------------------------------------------------
     5. FINANCE & REVENUE (Today, This Week, This Month, Custom Date Range)
     ------------------------------------------------------------- */
  function renderRevenueView() {
    const barContainer = document.getElementById('adminRevenueCategoryBars');
    if (!barContainer) return;

    barContainer.innerHTML = ADMIN_DATA.revenueBreakdown.byCategory.map(c => `
      <div style="margin-bottom: 1.25rem;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem; font-size: 0.9rem;">
          <span><strong>${c.category}</strong></span>
          <span>₱${c.amount.toLocaleString()} (${c.percentage}%)</span>
        </div>
        <div style="height: 12px; background: var(--color-bg); border-radius: var(--radius-full); overflow: hidden;">
          <div style="width: ${c.percentage}%; height: 100%; background: linear-gradient(90deg, var(--color-secondary), var(--color-primary)); border-radius: var(--radius-full);"></div>
        </div>
      </div>
    `).join('');
  }

  /* -------------------------------------------------------------
     6. REPORTS & PERFORMANCE (Revenue, Occupancy, Reservation, Guest, Inventory Reports)
     ------------------------------------------------------------- */
  function renderReportsView() {
    document.querySelectorAll('.generate-report-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.getAttribute('data-report');
        showToast(`Generated & downloaded ${type.toUpperCase()} Report PDF summary.`, "success");
      });
    });
  }

  function renderPerformanceView() {
    const perfContainer = document.getElementById('adminPerformanceMatrix');
    if (!perfContainer) return;

    perfContainer.innerHTML = `
      <div class="card" style="padding: 1.5rem;">
        <h3 style="font-size: 1.15rem; margin-bottom: 1rem;">Category Revenue Share</h3>
        ${ADMIN_DATA.revenueBreakdown.byCategory.map(c => `
          <div style="display: flex; justify-content: space-between; padding: 0.6rem 0; border-bottom: 1px solid rgba(36,59,83,0.08); font-size: 0.9rem;">
            <span>${c.category}</span>
            <strong>₱${c.amount.toLocaleString()}</strong>
          </div>
        `).join('')}
      </div>
    `;
  }

  /* -------------------------------------------------------------
     7. STAFF / USERS MANAGER (Staff Accounts, Roles & Access)
     ------------------------------------------------------------- */
  function renderStaffUsersView() {
    const tableBody = document.getElementById('adminStaffTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = state.staffAccounts.map(s => `
      <tr>
        <td><strong style="font-family: Outfit;">${s.id}</strong></td>
        <td><strong>${s.name}</strong></td>
        <td>${s.email}</td>
        <td><span class="res-status-badge status-confirmed">${s.role}</span></td>
        <td>${s.accessLevel}</td>
        <td><span class="res-status-badge status-confirmed">${s.status}</span></td>
        <td><button class="btn btn-outline btn-sm" onclick="alert('Roles updated.');">Manage Role</button></td>
      </tr>
    `).join('');

    document.getElementById('addStaffModalBtn')?.addEventListener('click', () => {
      showModal("Add Staff Account", `
        <form class="form-grid">
          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input type="text" id="stfName" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" id="stfEmail" class="form-input" required />
          </div>
          <div class="form-group">
            <label class="form-label">Staff Role</label>
            <select id="stfRole" class="form-input">
              <option value="Senior Desk Supervisor">Front Desk Supervisor</option>
              <option value="Inventory Manager">Inventory Manager</option>
              <option value="Housekeeping Lead">Housekeeping Lead</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>
        </form>
      `, `
        <button class="btn btn-primary" id="saveStaffBtn">Create Staff Account</button>
        <button class="btn btn-outline" onclick="document.getElementById('modalBackdrop').classList.remove('active');">Cancel</button>
      `);

      document.getElementById('saveStaffBtn')?.addEventListener('click', () => {
        const name = document.getElementById('stfName').value;
        const email = document.getElementById('stfEmail').value;
        const role = document.getElementById('stfRole').value;

        if (!name || !email) return;

        state.staffAccounts.push({
          id: `STF-0${state.staffAccounts.length + 1}`,
          name, email, role, status: 'Active', accessLevel: 'Role Standard Access'
        });

        renderStaffUsersView();
        modalBackdrop.classList.remove('active');
        showToast(`Staff account for ${name} created!`, "success");
      });
    });
  }

  /* -------------------------------------------------------------
     8. NOTIFICATIONS & SETTINGS
     ------------------------------------------------------------- */
  function renderNotificationsView() {
    const list = document.getElementById('adminNotificationsList');
    if (!list) return;

    list.innerHTML = state.notifications.map(n => `
      <div style="display: flex; gap: 1rem; align-items: flex-start; padding: 1rem; background: var(--color-card); border-radius: var(--radius-md); margin-bottom: 0.75rem; border-left: 4px solid ${n.unread ? 'var(--color-primary)' : 'var(--color-secondary)'};">
        <div style="flex: 1;">
          <strong style="display: block; font-size: 1rem;">${n.title}</strong>
          <p style="font-size: 0.88rem; color: var(--color-muted);">${n.body}</p>
          <span style="font-size: 0.75rem; color: var(--color-muted);">${n.time}</span>
        </div>
      </div>
    `).join('');
  }

  function renderSettingsView() {
    const form = document.getElementById('adminSettingsForm');
    if (!form) return;

    form.innerHTML = `
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">Resort Name</label>
          <input type="text" id="setResortName" class="form-input" value="${state.settings.resortName}" />
        </div>
        <div class="form-group">
          <label class="form-label">Currency Symbol</label>
          <input type="text" id="setCurrency" class="form-input" value="${state.settings.currency}" />
        </div>
        <div class="form-group">
          <label class="form-label">VAT Tax Rate (%)</label>
          <input type="number" id="setVat" class="form-input" value="${state.settings.vatTaxRate}" />
        </div>
        <div class="form-group">
          <label class="form-label">Service Fee Rate (%)</label>
          <input type="number" id="setFee" class="form-input" value="${state.settings.serviceFeeRate}" />
        </div>
      </div>
      <button type="submit" class="btn btn-primary" style="margin-top: 1rem;">Save Property Settings</button>
    `;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast("Resort property settings updated successfully!", "success");
    });
  }

  function promptLogoutModal() {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ action: 'logout' }, '*');
      return;
    }
    showModal("Confirm Executive Logout", `
      <p style="line-height: 1.6;">Are you sure you want to end your Admin Portal session (${ADMIN_DATA.adminUser.name})?</p>
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
