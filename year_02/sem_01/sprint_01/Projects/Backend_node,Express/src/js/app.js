/**
 * SmartLibrary - Main Application Logic
 * Router, sidebar, topbar, notifications, and view orchestration.
 */

import { auth } from './auth.js';
import { store } from './store.js';
import { icons, toast, closeModal, getInitials, escapeHtml, formatDate } from './ui.js';
import { initializeSocket } from './api.js';

import { catalogView } from './views/catalog.js';
import { dashboardView } from './views/dashboard.js';
import { circulationView } from './views/circulation.js';
import { managementView } from './views/management.js';
import { systemView } from './views/system.js';

// ---- Navigation Config ----
const navConfig = [
  {
    section: 'CATALOG',
    items: [
      { id: 'library', label: 'Library', icon: 'library', view: 'catalog' },
      { id: 'browse', label: 'Browse Books', icon: 'browse', view: 'catalog' },
      { id: 'collections', label: 'Collections', icon: 'collection', view: 'catalog' }
    ]
  },
  {
    section: 'CIRCULATION',
    items: [
      { id: 'borrowing', label: 'Borrowing', icon: 'borrow', view: 'borrowing' },
      { id: 'reservations', label: 'Reservations', icon: 'reservation', view: 'reservations' },
      { id: 'returns', label: 'Returns', icon: 'return', view: 'returns' }
    ]
  },
  {
    section: 'MANAGEMENT',
    items: [
      { id: 'members', label: 'Members', icon: 'members', view: 'members', librarianOnly: true },
      { id: 'books', label: 'Books', icon: 'book', view: 'book-mgmt', librarianOnly: true },
      { id: 'fines', label: 'Fines', icon: 'fine', view: 'fines' }
    ]
  },
  {
    section: 'ANALYTICS',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: 'dashboard', view: 'dashboard' },
      { id: 'reports', label: 'Reports', icon: 'report', view: 'reports' }
    ]
  },
  {
    section: 'SYSTEM',
    items: [
      { id: 'notifications', label: 'Notifications', icon: 'bell', view: 'notifications' },
      { id: 'settings', label: 'Settings', icon: 'settings', view: 'settings' },
      { id: 'logout', label: 'Logout', icon: 'logout', view: 'logout' }
    ]
  }
];

// ---- App State ----
let currentView = 'catalog';
let currentNavItem = 'library';

const app = {
  init() {
    auth.init();
    if (!auth.requireAuth()) return;
    initializeSocket();
    this.buildSidebar();
    this.buildTopbar();
    this.bindEvents();
    this.updateNotifications();

    // Route from URL hash
    const hash = window.location.hash.slice(1);
    if (hash) {
      this.navigate(hash);
    } else {
      this.navigate('library');
    }

    // Listen for hash changes
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.slice(1);
      if (h) this.navigate(h);
    });
  },

  buildSidebar() {
    const nav = document.getElementById('sidebarNav');
    const member = auth.getCurrentMember();

    let html = '';
    navConfig.forEach(section => {
      const items = section.items.filter(item => {
        if (item.librarianOnly && !auth.isLibrarian()) return false;
        return true;
      });
      if (items.length === 0) return;

      html += `<div class="nav-section">${section.section}</div>`;
      items.forEach(item => {
        html += `
          <div class="nav-item" data-nav="${item.id}" data-view="${item.view}">
            ${icons[item.icon] || ''}
            <span>${item.label}</span>
          </div>
        `;
      });
    });
    nav.innerHTML = html;

    // Sidebar user
    const userEl = document.getElementById('sidebarUser');
    if (member) {
      userEl.innerHTML = `
        <div class="sidebar-user-avatar">${getInitials(member.name)}</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${escapeHtml(member.name)}</div>
          <div class="sidebar-user-role">${member.role}</div>
        </div>
      `;
    }

    // Bind nav clicks
    nav.querySelectorAll('.nav-item').forEach(el => {
      el.addEventListener('click', () => {
        const navId = el.dataset.nav;
        if (navId === 'logout') {
          auth.logout();
          return;
        }
        this.navigate(navId);
        // Close mobile sidebar
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebarBackdrop').classList.remove('show');
      });
    });

    // Logo icon
    document.getElementById('sidebarLogoIcon').innerHTML = icons.book;
    document.getElementById('sidebarClose').innerHTML = icons.close;
  },

  buildTopbar() {
    const member = auth.getCurrentMember();
    document.getElementById('searchIcon').innerHTML = icons.search;
    document.getElementById('notifIcon').innerHTML = icons.bell;
    document.getElementById('menuToggle').innerHTML = icons.menu;

    const userEl = document.getElementById('topbarUser');
    if (member) {
      userEl.innerHTML = `
        <div class="topbar-user-avatar">${getInitials(member.name)}</div>
        <div class="topbar-user-info">
          <div class="topbar-user-name">${escapeHtml(member.name)}</div>
          <div class="topbar-user-role">${member.role}</div>
        </div>
        <span class="topbar-user-chevron">${icons.chevronDown}</span>
        <div class="user-dropdown" id="userDropdown">
          <div class="user-dropdown-header">
            <div class="user-dropdown-name">${escapeHtml(member.name)}</div>
            <div class="user-dropdown-email">${escapeHtml(member.email)}</div>
          </div>
          <div class="user-dropdown-divider"></div>
          <div class="user-dropdown-item" data-action="profile">${icons.user} My Profile</div>
          <div class="user-dropdown-item" data-action="settings">${icons.settings} Settings</div>
          <div class="user-dropdown-divider"></div>
          <div class="user-dropdown-item danger" data-action="logout">${icons.logout} Logout</div>
        </div>
      `;

      // Dropdown toggle
      userEl.addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('userDropdown').classList.toggle('show');
      });

      userEl.querySelector('[data-action="logout"]').addEventListener('click', (e) => {
        e.stopPropagation();
        auth.logout();
      });
      userEl.querySelector('[data-action="settings"]').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('userDropdown').classList.remove('show');
        this.navigate('settings');
      });
      userEl.querySelector('[data-action="profile"]').addEventListener('click', (e) => {
        e.stopPropagation();
        document.getElementById('userDropdown').classList.remove('show');
        this.navigate('dashboard');
      });
    }
  },

  bindEvents() {
    // Menu toggle (mobile)
    document.getElementById('menuToggle').addEventListener('click', () => {
      document.getElementById('sidebar').classList.add('open');
      document.getElementById('sidebarBackdrop').classList.add('show');
    });
    document.getElementById('sidebarClose').addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebarBackdrop').classList.remove('show');
    });
    document.getElementById('sidebarBackdrop').addEventListener('click', () => {
      document.getElementById('sidebar').classList.remove('open');
      document.getElementById('sidebarBackdrop').classList.remove('show');
    });

    // Notification button
    document.getElementById('notifBtn').addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleNotifications();
    });

    // Mark all read
    const markAllBtn = document.getElementById('markAllRead');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const member = auth.getCurrentMember();
        if (member) {
          store.markAllRead(member.id);
          this.updateNotifications();
          this.renderNotificationDropdown();
        }
      });
    }

    // Close dropdowns on outside click
    document.addEventListener('click', (e) => {
      const dropdown = document.getElementById('userDropdown');
      const userEl = document.getElementById('topbarUser');
      if (dropdown && !userEl.contains(e.target)) {
        dropdown.classList.remove('show');
      }
      const notifDrop = document.getElementById('notifDropdown');
      const notifBtn = document.getElementById('notifBtn');
      if (notifDrop && !notifBtn.contains(e.target) && notifDrop.style.display !== 'none') {
        if (!notifDrop.contains(e.target)) {
          notifDrop.style.display = 'none';
        }
      }
    });

    // Global search
    const searchInput = document.getElementById('globalSearch');
    searchInput.addEventListener('input', (e) => {
      if (currentView === 'catalog') {
        catalogView.setSearch(e.target.value);
      } else {
        // Navigate to catalog and search
        this.navigate('library');
        setTimeout(() => catalogView.setSearch(e.target.value), 50);
      }
    });

    // Escape closes everything
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.getElementById('sidebar').classList.remove('open');
        document.getElementById('sidebarBackdrop').classList.remove('show');
      }
    });

    // Custom events from views (avoids circular imports)
    document.addEventListener('sl:update-notifications', () => this.updateNotifications());
    document.addEventListener('sl:navigate', (e) => this.navigate(e.detail));
  },

  navigate(navId) {
    // Find nav item
    let foundItem = null;
    let foundSection = null;
    for (const section of navConfig) {
      const item = section.items.find(i => i.id === navId);
      if (item) { foundItem = item; foundSection = section; break; }
    }
    if (!foundItem) {
      // Default to library
      foundItem = { id: 'library', view: 'catalog' };
    }

    // Check librarian access
    if (foundItem.librarianOnly && !auth.isLibrarian()) {
      toast('Librarian access required for this page.', 'error');
      return;
    }

    currentView = foundItem.view;
    currentNavItem = navId;

    // Update URL hash
    window.location.hash = navId;

    // Update active nav state
    document.querySelectorAll('.nav-item').forEach(el => {
      el.classList.toggle('active', el.dataset.nav === navId);
    });

    // Clear search if navigating away from catalog
    if (foundItem.view !== 'catalog') {
      const search = document.getElementById('globalSearch');
      if (search) search.value = '';
    }

    // Render the view
    this.renderView(foundItem);
  },

  renderView(item) {
    const content = document.getElementById('content');
    content.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

    // Close any open modals
    closeModal();

    // Defer render to show loading state
    requestAnimationFrame(() => {
      switch (item.view) {
        case 'catalog':
          catalogView.render(content, item.id);
          break;
        case 'dashboard':
          dashboardView.render(content);
          break;
        case 'borrowing':
        case 'reservations':
        case 'returns':
        case 'fines':
          circulationView.render(content, item.view);
          break;
        case 'members':
        case 'book-mgmt':
          managementView.render(content, item.view);
          break;
        case 'reports':
        case 'notifications':
        case 'settings':
          systemView.render(content, item.view);
          break;
        default:
          content.innerHTML = '<div class="empty-state"><div class="empty-state-title">Page not found</div></div>';
      }
    });
  },

  updateNotifications() {
    const member = auth.getCurrentMember();
    if (!member) return;
    const unread = store.getUnreadCount(member.id);
    const badge = document.getElementById('notifBadge');
    if (unread > 0) {
      badge.textContent = unread > 9 ? '9+' : unread;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  },

  toggleNotifications() {
    const dropdown = document.getElementById('notifDropdown');
    const isVisible = dropdown.style.display === 'block';
    if (isVisible) {
      dropdown.style.display = 'none';
    } else {
      dropdown.style.display = 'block';
      this.renderNotificationDropdown();
    }
  },

  renderNotificationDropdown() {
    const member = auth.getCurrentMember();
    if (!member) return;
    const notifications = store.getNotificationsByMember(member.id);
    const body = document.getElementById('notifDropdownBody');

    if (notifications.length === 0) {
      body.innerHTML = '<div class="notif-empty">No notifications</div>';
      return;
    }

    // Sort by date descending
    const sorted = [...notifications].sort((a, b) => b.date.localeCompare(a.date));

    body.innerHTML = sorted.map(n => `
      <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
        <div class="notif-dot ${n.read ? 'read' : ''}"></div>
        <div class="notif-content">
          <div class="notif-title">${escapeHtml(n.title)}</div>
          <div class="notif-message">${escapeHtml(n.message)}</div>
          <div class="notif-date">${formatDate(n.date)}</div>
        </div>
      </div>
    `).join('');

    body.querySelectorAll('.notif-item').forEach(el => {
      el.addEventListener('click', () => {
        store.markNotificationRead(el.dataset.id);
        this.updateNotifications();
        this.renderNotificationDropdown();
      });
    });
  },

  refresh() {
    this.renderView({ view: currentView, id: currentNavItem });
    this.updateNotifications();
  }
};

// ---- Initialize ----
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});

export { app };
