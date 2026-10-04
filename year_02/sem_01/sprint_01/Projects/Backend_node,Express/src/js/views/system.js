/**
 * SmartLibrary - System View
 * Reports, Notifications page, and Settings.
 */

import { store } from '../store.js';
import { auth } from '../auth.js';
import {
  icons, toast, escapeHtml, formatDate, statusBadge, confirmDialog, closeModal
} from '../ui.js';

export const systemView = {
  render(container, view) {
    switch (view) {
      case 'reports': this.renderReports(container); break;
      case 'notifications': this.renderNotifications(container); break;
      case 'settings': this.renderSettings(container); break;
    }
  },

  // ---- REPORTS ----
  renderReports(container) {
    const borrowings = store.getBorrowings();
    const members = store.getMembers();
    const books = store.getBooks();

    // Borrowing trends (by month)
    const monthlyData = {};
    borrowings.forEach(b => {
      const month = b.issueDate.substring(0, 7);
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    const sortedMonths = Object.keys(monthlyData).sort();
    const maxMonthly = Math.max(...Object.values(monthlyData), 1);

    // Popular books
    const bookCounts = {};
    borrowings.forEach(b => {
      bookCounts[b.bookId] = (bookCounts[b.bookId] || 0) + 1;
    });
    const popularBooks = Object.entries(bookCounts)
      .map(([bookId, count]) => ({ book: store.getBook(bookId), count }))
      .filter(item => item.book)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    const maxBookCount = popularBooks.length > 0 ? popularBooks[0].count : 1;

    // Member activity
    const memberActivity = members.map(m => ({
      ...m,
      totalBorrowed: borrowings.filter(b => b.memberId === m.id).length
    })).sort((a, b) => b.totalBorrowed - a.totalBorrowed).slice(0, 10);
    const maxMemberActivity = memberActivity.length > 0 ? memberActivity[0].totalBorrowed : 1;

    // Overdue stats
    const overdueBooks = borrowings.filter(b => {
      if (b.status === 'returned') return false;
      const due = new Date(b.dueDate);
      const now = new Date();
      return due < now;
    });
    const totalFines = overdueBooks.reduce((sum, b) => {
      const due = new Date(b.dueDate);
      const now = new Date();
      const days = Math.floor((now - due) / (1000 * 60 * 60 * 24));
      return sum + (days > 0 ? days * 5 : 0);
    }, 0);

    container.innerHTML = `
      <div class="content-header">
        <div class="content-title">
          <h1>Reports</h1>
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-icon blue">${icons.borrow}</div>
          <div><div class="stat-value">${borrowings.length}</div><div class="stat-label">Total Borrowings</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red">${icons.alert}</div>
          <div><div class="stat-value">${overdueBooks.length}</div><div class="stat-label">Overdue Books</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">${icons.fine}</div>
          <div><div class="stat-value">$${totalFines}</div><div class="stat-label">Potential Fines</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">${icons.members}</div>
          <div><div class="stat-value">${members.length}</div><div class="stat-label">Total Members</div></div>
        </div>
      </div>

      <div class="section">
        <div class="section-header"><h3>Borrowing Trends</h3></div>
        <div class="section-body">
          ${this.renderBarChart(sortedMonths, monthlyData, maxMonthly)}
        </div>
      </div>

      <div class="section">
        <div class="section-header"><h3>Most Borrowed Books</h3></div>
        <div class="section-body">
          ${popularBooks.length === 0 ? '<div class="empty-state"><div class="empty-state-title">No data</div></div>' : `
            ${popularBooks.map(item => `
              <div class="chart-hbar">
                <div class="chart-hbar-label">${escapeHtml(item.book.title)}</div>
                <div class="chart-hbar-track">
                  <div class="chart-hbar-fill" style="width:${(item.count / maxBookCount) * 100}%">${item.count}</div>
                </div>
              </div>
            `).join('')}
          `}
        </div>
      </div>

      <div class="section">
        <div class="section-header"><h3>Member Activity</h3></div>
        <div class="section-body no-pad">
          <div class="data-table-wrap">
            <table class="data-table">
              <thead><tr><th>Member</th><th>Role</th><th>Books Borrowed</th><th>Activity</th></tr></thead>
              <tbody>
                ${memberActivity.map(m => `
                  <tr>
                    <td><span style="font-weight:500;">${escapeHtml(m.name)}</span></td>
                    <td style="text-transform:capitalize;">${m.role}</td>
                    <td>${m.totalBorrowed}</td>
                    <td style="width:200px;">
                      <div class="chart-hbar-track" style="height:16px;">
                        <div class="chart-hbar-fill" style="width:${(m.totalBorrowed / maxMemberActivity) * 100}%"></div>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header"><h3>Overdue Statistics</h3></div>
        <div class="section-body no-pad">
          ${overdueBooks.length === 0 ? '<div class="empty-state"><div class="empty-state-title">No overdue books</div></div>' : `
            <div class="data-table-wrap">
              <table class="data-table">
                <thead><tr><th>Book</th><th>Member</th><th>Due Date</th><th>Days Overdue</th><th>Estimated Fine</th></tr></thead>
                <tbody>
                  ${overdueBooks.map(b => {
                    const book = store.getBook(b.bookId);
                    const member = store.getMember(b.memberId);
                    const due = new Date(b.dueDate);
                    const now = new Date();
                    const days = Math.floor((now - due) / (1000 * 60 * 60 * 24));
                    const fine = days > 0 ? days * 5 : 0;
                    return `
                      <tr>
                        <td><span style="font-weight:500;">${escapeHtml(book.title)}</span></td>
                        <td>${escapeHtml(member.name)}</td>
                        <td>${formatDate(b.dueDate)}</td>
                        <td><span class="text-danger">${days}</span></td>
                        <td><span class="fine-amount">$${fine}</span></td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          `}
        </div>
      </div>
    `;
  },

  renderBarChart(labels, data, maxVal) {
    if (labels.length === 0) {
      return '<div class="empty-state"><div class="empty-state-title">No borrowing data</div></div>';
    }
    return `
      <div class="chart-bar-container">
        ${labels.map(label => {
          const value = data[label] || 0;
          const heightPct = (value / maxVal) * 100;
          const shortLabel = label.substring(5) + '/' + label.substring(2, 4);
          return `
            <div class="chart-bar-group">
              <div class="chart-bar-value">${value}</div>
              <div class="chart-bar" style="height:${heightPct}%"></div>
              <div class="chart-bar-label">${shortLabel}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  // ---- NOTIFICATIONS PAGE ----
  renderNotifications(container) {
    const member = auth.getCurrentMember();
    const notifications = store.getNotificationsByMember(member.id).sort((a, b) => b.date.localeCompare(a.date));
    const unreadCount = notifications.filter(n => !n.read).length;

    container.innerHTML = `
      <div class="content-header">
        <div class="content-title">
          <h1>Notifications</h1>
          <span class="count-badge">${unreadCount} unread</span>
        </div>
        <button class="btn btn-sm btn-secondary" id="markAllReadPage">Mark All Read</button>
      </div>
      <div class="section">
        <div class="section-body no-pad">
          ${notifications.length === 0 ? `
            <div class="empty-state">
              <div class="empty-state-icon">${icons.bell}</div>
              <div class="empty-state-title">No notifications</div>
              <div class="empty-state-message">You have no notifications at this time.</div>
            </div>
          ` : `
            ${notifications.map(n => `
              <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}" style="cursor:pointer;">
                <div class="notif-dot ${n.read ? 'read' : ''}"></div>
                <div class="notif-content">
                  <div class="notif-title">${escapeHtml(n.title)}</div>
                  <div class="notif-message">${escapeHtml(n.message)}</div>
                  <div class="notif-date">${formatDate(n.date)}</div>
                </div>
                ${!n.read ? `<button class="icon-btn" data-mark="${n.id}" title="Mark as read">${icons.check}</button>` : ''}
              </div>
            `).join('')}
          `}
        </div>
      </div>
    `;

    const markAllBtn = document.getElementById('markAllReadPage');
    if (markAllBtn) {
      markAllBtn.addEventListener('click', () => {
        store.markAllRead(member.id);
        toast('All notifications marked as read.', 'success');
        this.renderNotifications(container);
        document.dispatchEvent(new CustomEvent('sl:update-notifications'));
      });
    }

    container.querySelectorAll('[data-mark]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        store.markNotificationRead(btn.dataset.mark);
        this.renderNotifications(container);
        document.dispatchEvent(new CustomEvent('sl:update-notifications'));
      });
    });

    container.querySelectorAll('.notif-item[data-id]').forEach(el => {
      el.addEventListener('click', () => {
        if (!el.querySelector('[data-mark]')) return;
        store.markNotificationRead(el.dataset.id);
        this.renderNotifications(container);
        document.dispatchEvent(new CustomEvent('sl:update-notifications'));
      });
    });
  },

  // ---- SETTINGS ----
  renderSettings(container) {
    const member = auth.getCurrentMember();
    const isLibrarian = auth.isLibrarian();

    container.innerHTML = `
      <div class="content-header">
        <div class="content-title">
          <h1>Settings</h1>
        </div>
      </div>

      <div class="section">
        <div class="section-header"><h3>Account Information</h3></div>
        <div class="section-body">
          <div class="book-detail-meta">
            <div class="book-detail-meta-item">
              <div class="book-detail-meta-label">Name</div>
              <div class="book-detail-meta-value">${escapeHtml(member.name)}</div>
            </div>
            <div class="book-detail-meta-item">
              <div class="book-detail-meta-label">Email</div>
              <div class="book-detail-meta-value">${escapeHtml(member.email)}</div>
            </div>
            <div class="book-detail-meta-item">
              <div class="book-detail-meta-label">Membership ID</div>
              <div class="book-detail-meta-value">${member.membershipId}</div>
            </div>
            <div class="book-detail-meta-item">
              <div class="book-detail-meta-label">Role</div>
              <div class="book-detail-meta-value" style="text-transform:capitalize;">${member.role}</div>
            </div>
            <div class="book-detail-meta-item">
              <div class="book-detail-meta-label">Member Since</div>
              <div class="book-detail-meta-value">${formatDate(member.joinedDate)}</div>
            </div>
            <div class="book-detail-meta-item">
              <div class="book-detail-meta-label">Status</div>
              <div class="book-detail-meta-value">${statusBadge(member.status)}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header"><h3>Preferences</h3></div>
        <div class="section-body">
          <div style="display:flex;flex-direction:column;gap:12px;">
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" id="pref-notif" checked />
              <span>Email notifications for due dates</span>
            </label>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" id="pref-overdue" checked />
              <span>Notify me about overdue books</span>
            </label>
            <label style="display:flex;align-items:center;gap:8px;cursor:pointer;">
              <input type="checkbox" id="pref-reservations" checked />
              <span>Notify me when reserved books are available</span>
            </label>
          </div>
        </div>
      </div>

      <div class="section">
        <div class="section-header"><h3>Data Management</h3></div>
        <div class="section-body">
          <p style="font-size:13px;color:var(--color-text-muted);margin-bottom:12px;">Reset all local data to the original demo state. This will clear all borrowings, reservations, fines, and notifications.</p>
          <button class="btn btn-danger btn-sm" id="resetData">${icons.trash} Reset All Data</button>
        </div>
      </div>

      <div class="section">
        <div class="section-header"><h3>About</h3></div>
        <div class="section-body">
          <p style="font-size:13px;color:var(--color-text-secondary);line-height:1.6;">
            <strong>SmartLibrary</strong> — College Library Management System<br/>
            Version 1.0.0<br/>
            Built with HTML5, CSS3, and Vanilla JavaScript.<br/>
            Frontend prepared for Node.js + Express + MongoDB backend.
          </p>
        </div>
      </div>
    `;

    document.getElementById('resetData').addEventListener('click', () => {
      confirmDialog(
        'Reset all data to demo state? This will clear all changes you have made.',
        () => {
          store.resetData();
          toast('All data has been reset to demo state.', 'success');
          document.dispatchEvent(new CustomEvent('sl:navigate', { detail: 'library' }));
        },
        { danger: true, confirmLabel: 'Reset Data', title: 'Reset All Data' }
      );
    });

    // Preferences save on change
    ['pref-notif', 'pref-overdue', 'pref-reservations'].forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('change', () => {
          toast('Preference updated.', 'info');
        });
      }
    });
  }
};
