/**
 * SmartLibrary - Dashboard View
 * Student dashboard and librarian dashboard.
 */

import { store } from '../store.js';
import { auth } from '../auth.js';
import {
  icons, escapeHtml, formatDate, statusBadge, bookCover, daysOverdue
} from '../ui.js';

export const dashboardView = {
  render(container) {
    if (auth.isLibrarian()) {
      this.renderLibrarianDashboard(container);
    } else {
      this.renderStudentDashboard(container);
    }
  },

  renderStudentDashboard(container) {
    const member = auth.getCurrentMember();
    const borrowings = store.getBorrowingsByMember(member.id);
    const activeBorrowings = borrowings.filter(b => b.status === 'borrowed' || b.status === 'overdue');
    const history = borrowings.filter(b => b.status === 'returned');
    const reservations = store.getReservationsByMember(member.id);
    const fines = store.getFinesByMember(member.id).filter(f => f.status === 'unpaid' && f.amount > 0);
    const notifications = store.getNotificationsByMember(member.id).filter(n => !n.read);
    const totalFine = fines.reduce((sum, f) => sum + f.amount, 0);

    container.innerHTML = `
      <div class="content-header">
        <div class="content-title">
          <h1>My Dashboard</h1>
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-icon blue">${icons.borrow}</div>
          <div><div class="stat-value">${activeBorrowings.length}</div><div class="stat-label">Books Borrowed</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">${icons.reservation}</div>
          <div><div class="stat-value">${reservations.length}</div><div class="stat-label">Reservations</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon ${totalFine > 0 ? 'red' : 'green'}">${icons.fine}</div>
          <div><div class="stat-value">$${totalFine}</div><div class="stat-label">Outstanding Fines</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon cyan">${icons.bell}</div>
          <div><div class="stat-value">${notifications.length}</div><div class="stat-label">Unread Notifications</div></div>
        </div>
      </div>

      <div class="section">
        <div class="section-header"><h3>Currently Borrowed</h3></div>
        <div class="section-body no-pad">
          ${this.renderActiveBorrowingsTable(activeBorrowings)}
        </div>
      </div>

      <div class="section">
        <div class="section-header"><h3>Reservations</h3></div>
        <div class="section-body no-pad">
          ${this.renderReservationsTable(reservations)}
        </div>
      </div>

      <div class="section">
        <div class="section-header"><h3>Borrowing History</h3></div>
        <div class="section-body no-pad">
          ${this.renderHistoryTable(history)}
        </div>
      </div>
    `;
  },

  renderActiveBorrowingsTable(borrowings) {
    if (borrowings.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">No active borrowings</div><div class="empty-state-message">You have no books currently borrowed.</div></div>`;
    }
    return `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Status</th></tr></thead>
          <tbody>
            ${borrowings.map(b => {
              const book = store.getBook(b.bookId);
              const overdue = daysOverdue(b.dueDate) > 0;
              return `
                <tr>
                  <td>
                    <div style="display:flex;align-items:center;gap:8px;">
                      ${bookCover(book)}
                      <span style="font-weight:500;">${escapeHtml(book.title)}</span>
                    </div>
                  </td>
                  <td>${formatDate(b.issueDate)}</td>
                  <td>${formatDate(b.dueDate)}${overdue ? ` <span class="text-danger" style="font-size:11px;">(${daysOverdue(b.dueDate)} days overdue)</span>` : ''}</td>
                  <td>${statusBadge(b.status)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  renderReservationsTable(reservations) {
    if (reservations.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">No reservations</div><div class="empty-state-message">You have no active reservations.</div></div>`;
    }
    return `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Book</th><th>Reserved On</th><th>Status</th></tr></thead>
          <tbody>
            ${reservations.map(r => {
              const book = store.getBook(r.bookId);
              return `
                <tr>
                  <td><span style="font-weight:500;">${escapeHtml(book.title)}</span></td>
                  <td>${formatDate(r.reservedOn)}</td>
                  <td>${statusBadge(r.status)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  renderHistoryTable(history) {
    if (history.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">No borrowing history</div><div class="empty-state-message">You have not returned any books yet.</div></div>`;
    }
    return `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Book</th><th>Issue Date</th><th>Due Date</th><th>Returned On</th><th>Fine</th></tr></thead>
          <tbody>
            ${history.map(b => {
              const book = store.getBook(b.bookId);
              return `
                <tr>
                  <td><span style="font-weight:500;">${escapeHtml(book.title)}</span></td>
                  <td>${formatDate(b.issueDate)}</td>
                  <td>${formatDate(b.dueDate)}</td>
                  <td>${formatDate(b.returnDate)}</td>
                  <td>${b.fine > 0 ? `<span class="fine-amount">$${b.fine}</span>` : '<span class="text-muted">—</span>'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  renderLibrarianDashboard(container) {
    const books = store.getBooks();
    const totalBooks = books.length;
    const availableBooks = books.filter(b => b.availableCopies > 0).length;
    const borrowedBooks = books.reduce((sum, b) => sum + (b.totalCopies - b.availableCopies), 0);
    const members = store.getMembers().filter(m => m.role === 'student');
    const activeBorrowings = store.getActiveBorrowings();
    const overdueBorrowings = activeBorrowings.filter(b => b.status === 'overdue' || daysOverdue(b.dueDate) > 0);
    const totalFines = store.getFines().filter(f => f.status === 'unpaid').reduce((sum, f) => sum + f.amount, 0);

    container.innerHTML = `
      <div class="content-header">
        <div class="content-title">
          <h1>Librarian Dashboard</h1>
        </div>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-icon blue">${icons.book}</div>
          <div><div class="stat-value">${totalBooks}</div><div class="stat-label">Total Books</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">${icons.check}</div>
          <div><div class="stat-value">${availableBooks}</div><div class="stat-label">Available</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon amber">${icons.borrow}</div>
          <div><div class="stat-value">${borrowedBooks}</div><div class="stat-label">Borrowed</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon cyan">${icons.members}</div>
          <div><div class="stat-value">${members.length}</div><div class="stat-label">Members</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red">${icons.alert}</div>
          <div><div class="stat-value">${overdueBorrowings.length}</div><div class="stat-label">Overdue</div></div>
        </div>
        <div class="stat-card">
          <div class="stat-icon red">${icons.fine}</div>
          <div><div class="stat-value">$${totalFines}</div><div class="stat-label">Outstanding Fines</div></div>
        </div>
      </div>

      <div class="section">
        <div class="section-header"><h3>Recent Borrowing</h3></div>
        <div class="section-body no-pad">
          ${this.renderRecentBorrowings(activeBorrowings.slice(0, 8))}
        </div>
      </div>

      <div class="section">
        <div class="section-header"><h3>Overdue Books</h3></div>
        <div class="section-body no-pad">
          ${this.renderOverdueTable(overdueBorrowings)}
        </div>
      </div>

      <div class="section">
        <div class="section-header"><h3>Popular Books</h3></div>
        <div class="section-body no-pad">
          ${this.renderPopularBooks()}
        </div>
      </div>
    `;
  },

  renderRecentBorrowings(borrowings) {
    if (borrowings.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">No active borrowings</div></div>`;
    }
    return `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Book</th><th>Member</th><th>Issue Date</th><th>Due Date</th><th>Status</th></tr></thead>
          <tbody>
            ${borrowings.map(b => {
              const book = store.getBook(b.bookId);
              const member = store.getMember(b.memberId);
              return `
                <tr>
                  <td><span style="font-weight:500;">${escapeHtml(book.title)}</span></td>
                  <td>${escapeHtml(member.name)}</td>
                  <td>${formatDate(b.issueDate)}</td>
                  <td>${formatDate(b.dueDate)}</td>
                  <td>${statusBadge(b.status)}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  renderOverdueTable(overdueBorrowings) {
    if (overdueBorrowings.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">No overdue books</div><div class="empty-state-message">All books are returned on time.</div></div>`;
    }
    return `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr><th>Book</th><th>Member</th><th>Due Date</th><th>Days Overdue</th><th>Fine</th></tr></thead>
          <tbody>
            ${overdueBorrowings.map(b => {
              const book = store.getBook(b.bookId);
              const member = store.getMember(b.memberId);
              const days = daysOverdue(b.dueDate);
              const fine = days > 0 ? days * 5 : 0;
              return `
                <tr>
                  <td><span style="font-weight:500;">${escapeHtml(book.title)}</span></td>
                  <td>${escapeHtml(member.name)}</td>
                  <td>${formatDate(b.dueDate)}</td>
                  <td><span class="text-danger">${days} days</span></td>
                  <td><span class="fine-amount">$${fine}</span></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  renderPopularBooks() {
    const borrowings = store.getBorrowings();
    const counts = {};
    borrowings.forEach(b => {
      counts[b.bookId] = (counts[b.bookId] || 0) + 1;
    });
    const sorted = Object.entries(counts)
      .map(([bookId, count]) => ({ book: store.getBook(bookId), count }))
      .filter(item => item.book)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    if (sorted.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">No data</div></div>`;
    }

    const maxCount = sorted[0].count;
    return `
      <div style="padding:12px 16px;">
        ${sorted.map(item => `
          <div class="chart-hbar">
            <div class="chart-hbar-label">${escapeHtml(item.book.title)}</div>
            <div class="chart-hbar-track">
              <div class="chart-hbar-fill" style="width:${(item.count / maxCount) * 100}%">${item.count}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }
};
