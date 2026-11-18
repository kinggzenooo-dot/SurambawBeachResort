/**
 * Surambaw Beach Resort - Centralized Backend Synchronization & Auth Engine
 * Connects Customer, Staff, and Admin portals to Python Flask SQLite Backend.
 */

window.ResortAPI = {
  baseUrl: '',

  async request(endpoint, options = {}) {
    options.headers = options.headers || {};
    options.headers['Content-Type'] = 'application/json';
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn(`[ResortAPI] Network error on ${endpoint}:`, err);
      return { success: false, message: err.message };
    }
  },

  // Auth
  async getMe() {
    return this.request('/api/auth/me', { method: 'GET' });
  },

  async login(credentials) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  },

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  },

  async logout() {
    return this.request('/api/auth/logout', { method: 'POST' });
  },

  // Accommodations & Addons
  async getAccommodations() {
    return this.request('/api/accommodations', { method: 'GET' });
  },

  async createAccommodation(data) {
    return this.request('/api/accommodations', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  async getAddons() {
    return this.request('/api/addons', { method: 'GET' });
  },

  // Reservations
  async getReservations(all = true) {
    return this.request(`/api/reservations?all=${all ? 'true' : 'false'}`, { method: 'GET' });
  },

  async createReservation(resData) {
    return this.request('/api/reservations', {
      method: 'POST',
      body: JSON.stringify(resData)
    });
  },

  async updateReservationStatus(resId, status) {
    return this.request(`/api/reservations/${resId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
  },

  // Guests
  async getGuests() {
    return this.request('/api/guests', { method: 'GET' });
  },

  async createGuest(data) {
    return this.request('/api/guests', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Inventory
  async getInventory() {
    return this.request('/api/inventory', { method: 'GET' });
  },

  async adjustInventory(itemId, amount, action, staffName) {
    return this.request('/api/inventory/adjust', {
      method: 'POST',
      body: JSON.stringify({ item_id: itemId, amount, action, staff_name: staffName })
    });
  },

  // Stats
  async getStats() {
    return this.request('/api/stats', { method: 'GET' });
  }
};

/**
 * Universal Portal Controller
 * Coordinates single-link switching, universal auth bar, sign-in/logout modals, and data sync.
 */
class UniversalPortalManager {
  constructor() {
    this.currentUser = null;
    this.currentRole = 'customer'; // 'customer' | 'staff' | 'admin'
    this.init();
  }

  async init() {
    this.bindEvents();
    await this.checkAuthStatus();
    await this.syncAllData();
  }

  async checkAuthStatus() {
    const res = await ResortAPI.getMe();
    if (res && res.authenticated && res.user) {
      this.currentUser = res.user;
      this.currentRole = res.user.role || 'customer';
    } else {
      // Default to guest / customer mode with demo user
      this.currentUser = {
        name: "Alexander Wright",
        email: "guest@surambaw.com",
        role: "customer",
        tier: "Surambaw Gold VIP",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
      };
      this.currentRole = 'customer';
    }
    this.updateUI();
  }

  updateUI() {
    // 1. Update Top Universal Bar Badge & Active Role Button
    const badgeText = document.getElementById('uCurrentRoleText');
    const roleDot = document.querySelector('.u-role-dot');
    const roleButtons = document.querySelectorAll('.u-role-btn');

    roleButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.role === this.currentRole);
    });

    if (badgeText) {
      const roleLabels = {
        customer: 'Guest (Customer)',
        staff: 'Staff (Front Desk)',
        admin: 'Admin (Executive)'
      };
      badgeText.textContent = `Mode: ${roleLabels[this.currentRole] || this.currentRole}`;
    }

    if (roleDot) {
      const roleColors = {
        customer: 'var(--color-primary)',
        staff: '#3BAA7C',
        admin: '#A855F7'
      };
      roleDot.style.backgroundColor = roleColors[this.currentRole] || 'var(--color-primary)';
      roleDot.style.boxShadow = `0 0 8px ${roleColors[this.currentRole] || 'var(--color-primary)'}`;
    }

    // 2. Update Auth Actions Widget
    const authActions = document.getElementById('uAuthActions');
    if (authActions) {
      if (this.currentUser) {
        authActions.innerHTML = `
          <div class="u-user-chip">
            <img src="${this.currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}" class="u-user-avatar" alt="Avatar" />
            <span class="u-user-name">${this.currentUser.name}</span>
          </div>
          <button class="u-btn-auth" id="uQuickSwitchBtn" title="Switch Account or Role">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            Sign In / Switch
          </button>
          <button class="u-btn-logout" id="uLogoutBtn" title="Log Out Session">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Logout
          </button>
        `;
        document.getElementById('uQuickSwitchBtn')?.addEventListener('click', () => this.openAuthModal());
        document.getElementById('uLogoutBtn')?.addEventListener('click', () => this.openLogoutModal());
      } else {
        authActions.innerHTML = `
          <button class="u-btn-auth" id="uSignInBtn">
            <svg class="icon icon-sm" viewBox="0 0 24 24"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Sign In / Register
          </button>
        `;
        document.getElementById('uSignInBtn')?.addEventListener('click', () => this.openAuthModal());
      }
    }

    // 3. Switch Portals Container
    const customerPortal = document.getElementById('portal-customer');
    const staffPortal = document.getElementById('portal-staff');
    const adminPortal = document.getElementById('portal-admin');

    if (customerPortal) customerPortal.classList.toggle('active', this.currentRole === 'customer');
    if (staffPortal) staffPortal.classList.toggle('active', this.currentRole === 'staff');
    if (adminPortal) adminPortal.classList.toggle('active', this.currentRole === 'admin');

    // Sync active user in portals
    if (this.currentUser) {
      if (document.getElementById('headerUserName')) {
        document.getElementById('headerUserName').textContent = this.currentUser.name;
      }
      if (document.getElementById('headerUserStatus')) {
        document.getElementById('headerUserStatus').textContent = this.currentUser.tier || 'Resort Member';
      }
      if (document.getElementById('headerUserAvatar')) {
        document.getElementById('headerUserAvatar').src = this.currentUser.avatar || document.getElementById('headerUserAvatar').src;
      }
    }
  }

  async switchRole(targetRole) {
    if (this.currentRole === targetRole) return;
    this.currentRole = targetRole;

    // Automatically assign mock user for demo if switching role
    if (targetRole === 'admin' && (!this.currentUser || this.currentUser.role !== 'admin')) {
      await this.loginWithCredentials({ role: 'admin' }, false);
    } else if (targetRole === 'staff' && (!this.currentUser || this.currentUser.role !== 'staff')) {
      await this.loginWithCredentials({ role: 'staff' }, false);
    } else if (targetRole === 'customer' && (!this.currentUser || this.currentUser.role !== 'customer')) {
      await this.loginWithCredentials({ role: 'customer' }, false);
    }

    this.updateUI();
    this.showToast(`Switched to ${targetRole.toUpperCase()} Interface`, 'success');
    await this.syncAllData();
  }

  bindEvents() {
    // Role switcher buttons in universal header
    document.querySelectorAll('.u-role-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const role = btn.dataset.role;
        if (role) this.switchRole(role);
      });
    });

    // Intercept native logouts across customer, staff, and admin views
    document.querySelectorAll('.logout-btn, [data-view="logout"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.openLogoutModal();
      });
    });
  }

  openAuthModal(tab = 'signin') {
    let modal = document.getElementById('universalAuthModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'universalAuthModal';
      modal.className = 'modal-backdrop active';
      modal.innerHTML = `
        <div class="modal-container" style="max-width: 500px;">
          <div class="modal-header">
            <h3 class="modal-title">Sign In & Role Access</h3>
            <button class="modal-close-btn" onclick="document.getElementById('universalAuthModal').classList.remove('active')">
              <svg class="icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-body">
            
            <!-- Quick Demo 1-Click Role Accounts -->
            <div class="quick-demo-section">
              <div class="quick-demo-title">⚡ Instant Demo 1-Click Login:</div>
              <div class="quick-demo-cards">
                <div class="demo-account-card" onclick="window.PortalManager.quickLogin('customer')">
                  <div class="demo-card-role">🏖️ Guest</div>
                  <div class="demo-card-name">Alexander Wright</div>
                  <div class="demo-card-email">guest@surambaw.com</div>
                </div>
                <div class="demo-account-card" onclick="window.PortalManager.quickLogin('staff')">
                  <div class="demo-card-role">🛎️ Staff</div>
                  <div class="demo-card-name">Maria Santos</div>
                  <div class="demo-card-email">staff@surambaw.com</div>
                </div>
                <div class="demo-account-card" onclick="window.PortalManager.quickLogin('admin')">
                  <div class="demo-card-role">👑 Admin</div>
                  <div class="demo-card-name">Arthur Pendelton</div>
                  <div class="demo-card-email">admin@surambaw.com</div>
                </div>
              </div>
            </div>

            <!-- Tab Switcher -->
            <div class="auth-tabs">
              <button class="auth-tab-btn ${tab === 'signin' ? 'active' : ''}" id="tabBtnSignIn" onclick="window.PortalManager.switchAuthTab('signin')">Sign In</button>
              <button class="auth-tab-btn ${tab === 'signup' ? 'active' : ''}" id="tabBtnSignUp" onclick="window.PortalManager.switchAuthTab('signup')">Create Guest Account</button>
            </div>

            <!-- Sign In Form -->
            <form id="formSignIn" style="${tab === 'signin' ? 'display:block;' : 'display:none;'}">
              <div class="form-group" style="margin-bottom: 1rem;">
                <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Email Address</label>
                <input type="email" id="authEmail" class="form-input" style="width:100%; padding:0.6rem 0.8rem; border-radius:8px; border:1px solid var(--color-border);" placeholder="guest@surambaw.com" required value="guest@surambaw.com" />
              </div>
              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Password</label>
                <input type="password" id="authPassword" class="form-input" style="width:100%; padding:0.6rem 0.8rem; border-radius:8px; border:1px solid var(--color-border);" placeholder="••••••••" required value="guest123" />
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; padding:0.75rem;">
                Sign In to Surambaw
              </button>
            </form>

            <!-- Sign Up Form -->
            <form id="formSignUp" style="${tab === 'signup' ? 'display:block;' : 'display:none;'}">
              <div class="form-group" style="margin-bottom: 0.85rem;">
                <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Full Name</label>
                <input type="text" id="regName" class="form-input" style="width:100%; padding:0.6rem 0.8rem; border-radius:8px; border:1px solid var(--color-border);" placeholder="Juan dela Cruz" required />
              </div>
              <div class="form-group" style="margin-bottom: 0.85rem;">
                <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Email Address</label>
                <input type="email" id="regEmail" class="form-input" style="width:100%; padding:0.6rem 0.8rem; border-radius:8px; border:1px solid var(--color-border);" placeholder="juan@example.com" required />
              </div>
              <div class="form-group" style="margin-bottom: 0.85rem;">
                <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Phone Number</label>
                <input type="tel" id="regPhone" class="form-input" style="width:100%; padding:0.6rem 0.8rem; border-radius:8px; border:1px solid var(--color-border);" placeholder="+63 917 123 4567" />
              </div>
              <div class="form-group" style="margin-bottom: 1.25rem;">
                <label style="display:block; font-size:0.85rem; font-weight:600; margin-bottom:0.35rem;">Password</label>
                <input type="password" id="regPassword" class="form-input" style="width:100%; padding:0.6rem 0.8rem; border-radius:8px; border:1px solid var(--color-border);" placeholder="Create a secure password" required />
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; padding:0.75rem;">
                Register & Enter Resort
              </button>
            </form>

          </div>
        </div>
      `;
      document.body.appendChild(modal);

      document.getElementById('formSignIn').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        await this.loginWithCredentials({ email, password }, true);
      });

      document.getElementById('formSignUp').addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const password = document.getElementById('regPassword').value;
        await this.registerNewUser({ name, email, phone, password });
      });
    } else {
      modal.classList.add('active');
    }
  }

  switchAuthTab(tab) {
    const btnIn = document.getElementById('tabBtnSignIn');
    const btnUp = document.getElementById('tabBtnSignUp');
    const formIn = document.getElementById('formSignIn');
    const formUp = document.getElementById('formSignUp');

    if (btnIn) btnIn.classList.toggle('active', tab === 'signin');
    if (btnUp) btnUp.classList.toggle('active', tab === 'signup');
    if (formIn) formIn.style.display = tab === 'signin' ? 'block' : 'none';
    if (formUp) formUp.style.display = tab === 'signup' ? 'block' : 'none';
  }

  async quickLogin(role) {
    await this.loginWithCredentials({ role }, true);
  }

  async loginWithCredentials(creds, showToastMsg = true) {
    const res = await ResortAPI.login(creds);
    if (res && res.success && res.user) {
      this.currentUser = res.user;
      this.currentRole = res.user.role || 'customer';
      document.getElementById('universalAuthModal')?.classList.remove('active');
      this.updateUI();
      if (showToastMsg) {
        this.showToast(`Signed in successfully as ${res.user.name} (${this.currentRole.toUpperCase()})`, 'success');
      }
      await this.syncAllData();
    } else {
      this.showToast(res.message || 'Login failed', 'error');
    }
  }

  async registerNewUser(userData) {
    const res = await ResortAPI.register(userData);
    if (res && res.success && res.user) {
      this.currentUser = res.user;
      this.currentRole = 'customer';
      document.getElementById('universalAuthModal')?.classList.remove('active');
      this.updateUI();
      this.showToast(`Welcome to Surambaw, ${res.user.name}! Account registered.`, 'success');
      await this.syncAllData();
    } else {
      this.showToast(res.message || 'Registration failed', 'error');
    }
  }

  openLogoutModal() {
    let modal = document.getElementById('universalLogoutModal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'universalLogoutModal';
      modal.className = 'modal-backdrop active';
      modal.innerHTML = `
        <div class="modal-container" style="max-width: 440px;">
          <div class="modal-header">
            <h3 class="modal-title">Confirm Logout</h3>
            <button class="modal-close-btn" onclick="document.getElementById('universalLogoutModal').classList.remove('active')">
              <svg class="icon" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <p style="color: var(--color-text); line-height: 1.6; font-size: 0.95rem;">
              Are you sure you want to end your active <strong>${this.currentRole.toUpperCase()}</strong> session?
            </p>
            <p style="color: var(--color-muted); font-size: 0.85rem; margin-top: 0.5rem;">
              You can log in again anytime or switch roles.
            </p>
          </div>
          <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:0.75rem;">
            <button class="btn btn-outline" onclick="document.getElementById('universalLogoutModal').classList.remove('active')">Cancel</button>
            <button class="btn btn-primary" onclick="window.PortalManager.performLogout()">Yes, Log Out</button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    } else {
      modal.classList.add('active');
    }
  }

  async performLogout() {
    await ResortAPI.logout();
    this.currentUser = null;
    this.currentRole = 'customer';
    document.getElementById('universalLogoutModal')?.classList.remove('active');
    this.updateUI();
    this.showToast('Logged out successfully. Returning to guest view.', 'info');
    this.openAuthModal('signin');
  }

  async syncAllData() {
    try {
      // 1. Fetch live reservations
      const res = await ResortAPI.getReservations(true);
      if (res && res.success && res.reservations) {
        window.__LIVE_RESERVATIONS = res.reservations;
        
        // Update Customer Reservations
        if (typeof renderReservationsList === 'function' && window.RESORT_DATA) {
          window.RESORT_DATA.reservations = res.reservations;
          renderReservationsList();
        }

        // Update Staff Tables
        if (typeof renderStaffDashboardReservations === 'function' && window.STAFF_DATA) {
          window.STAFF_DATA.recentReservations = res.reservations;
          renderStaffDashboardReservations();
        }
        if (typeof renderReservationsManagementTable === 'function') {
          renderReservationsManagementTable();
        }

        // Update Admin Table
        if (typeof renderAdminReservationsTable === 'function' && window.ADMIN_DATA) {
          window.ADMIN_DATA.reservations = res.reservations;
          renderAdminReservationsTable();
        }
      }

      // 2. Fetch live inventory
      const inv = await ResortAPI.getInventory();
      if (inv && inv.success && inv.inventory && window.ADMIN_DATA) {
        window.ADMIN_DATA.inventoryOverview.items = inv.inventory;
        window.ADMIN_DATA.inventoryOverview.history = inv.history || [];
        if (typeof renderInventoryTable === 'function') renderInventoryTable();
      }

      // 3. Fetch live stats
      const stats = await ResortAPI.getStats();
      if (stats && stats.success && stats.stats && window.ADMIN_DATA) {
        window.ADMIN_DATA.revenueOverview = {
          totalRevenue: stats.stats.totalRevenue,
          totalReservations: stats.stats.totalReservations,
          avgBookingValue: stats.stats.avgBookingValue,
          completedStays: stats.stats.completedStays
        };
        if (typeof updateAdminDashboardKPIs === 'function') {
          updateAdminDashboardKPIs();
        }
      }
    } catch (e) {
      console.warn('[UniversalPortal] Sync warning:', e);
    }
  }

  showToast(message, type = 'info') {
    let container = document.getElementById('toastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      background: #0B3954;
      color: #FFFFFF;
      padding: 0.8rem 1.2rem;
      border-radius: 10px;
      margin-bottom: 0.5rem;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-left: 4px solid ${type === 'success' ? '#3BAA7C' : type === 'error' ? '#FF7F6A' : '#F4E3C1'};
      animation: fadeIn 0.3s ease;
    `;
    toast.innerHTML = `<span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Instantiate Global Portal Manager on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.PortalManager = new UniversalPortalManager();
});
