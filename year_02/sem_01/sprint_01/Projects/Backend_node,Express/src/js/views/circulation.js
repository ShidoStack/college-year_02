/**
 * SmartLibrary - Circulation View
 * Borrowing, Reservations, Returns, and Fines pages.
 */

import { store } from '../store.js';
import { auth } from '../auth.js';
import { api } from '../api.js';
import {
  icons, toast, showModal, closeModal, confirmDialog,
  escapeHtml, formatDate, statusBadge, bookCover, daysOverdue
} from '../ui.js';

export const circulationView = {
  render(container, view) {
    switch (view) {
      case 'borrowing': this.renderBorrowing(container); break;
      case 'reservations': this.renderReservations(container); break;
      case 'returns': this.renderReturns(container); break;
      case 'fines': this.renderFines(container); break;
    }
  },

  // ---- BORROWING ----
  renderBorrowing(container) {
    const isLibrarian = auth.isLibrarian();
    const member = auth.getCurrentMember();
    let borrowings;

    if (isLibrarian) {
      borrowings = store.getActiveBorrowings();
    } else {
      borrowings = store.getBorrowingsByMember(member.id).filter(b => b.status !== 'returned');
    }

    container.innerHTML = `
      <div class="content-header">
        <div class="content-title">
          <h1>Active Borrowings</h1>
          <span class="count-badge">${borrowings.length} active</span>
        </div>
      </div>
      <div class="section">
        <div class="section-body no-pad">
          ${this.renderBorrowingTable(borrowings, isLibrarian)}
        </div>
      </div>
    `;

    this.bindReturnButtons(container);
  },

  renderBorrowingTable(borrowings, isLibrarian) {
    if (borrowings.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">No active borrowings</div><div class="empty-state-message">There are no books currently borrowed.</div></div>`;
    }
    return `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>Book</th>
            ${isLibrarian ? '<th>Member</th>' : ''}
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Status</th>
            <th>Fine</th>
            ${isLibrarian ? '<th>Action</th>' : ''}
          </tr></thead>
          <tbody>
            ${borrowings.map(b => {
              const book = store.getBook(b.bookId);
              const member = store.getMember(b.memberId);
              const days = daysOverdue(b.dueDate);
              const fine = days > 0 ? days * 5 : 0;
              const status = days > 0 ? 'overdue' : b.status;
              return `
                <tr>
                  <td><span style="font-weight:500;">${escapeHtml(book.title)}</span></td>
                  ${isLibrarian ? `<td>${escapeHtml(member.name)}</td>` : ''}
                  <td>${formatDate(b.issueDate)}</td>
                  <td>${formatDate(b.dueDate)}</td>
                  <td>${statusBadge(status)}</td>
                  <td>${fine > 0 ? `<span class="fine-amount">$${fine}</span>` : '<span class="text-muted">—</span>'}</td>
                  ${isLibrarian ? `<td><button class="btn btn-xs btn-primary" data-return="${b.id}">Return</button></td>` : ''}
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  bindReturnButtons(container) {
    container.querySelectorAll('[data-return]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const borrowing = store.getBorrowings().find(b => b.id === btn.dataset.return);
        if (!borrowing) return;
        const book = store.getBook(borrowing.bookId);
        confirmDialog(
          `Return "${book.title}"?`,
          async () => {
            await api.returnBook(borrowing.id);
            const member = store.getMember(borrowing.memberId);
            store.addNotification(member.id, 'success', 'Book returned', `"${book.title}" has been returned successfully.`);
            toast(`"${book.title}" returned successfully.`, 'success');
            this.renderBorrowing(container);
            document.dispatchEvent(new CustomEvent('sl:update-notifications'));
          },
          { confirmLabel: 'Return Book', title: 'Return Book' }
        );
      });
    });
  },

  // ---- RESERVATIONS ----
  renderReservations(container) {
    const isLibrarian = auth.isLibrarian();
    const member = auth.getCurrentMember();
    let reservations;

    if (isLibrarian) {
      reservations = store.getReservations();
    } else {
      reservations = store.getReservationsByMember(member.id);
    }

    container.innerHTML = `
      <div class="content-header">
        <div class="content-title">
          <h1>Reservations</h1>
          <span class="count-badge">${reservations.length} reservations</span>
        </div>
      </div>
      <div class="section">
        <div class="section-body no-pad">
          ${this.renderReservationsTable(reservations, isLibrarian)}
        </div>
      </div>
    `;

    container.querySelectorAll('[data-cancel-res]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const res = store.getReservations().find(r => r.id === btn.dataset.cancelRes);
        if (!res) return;
        const book = store.getBook(res.bookId);
        confirmDialog(
          `Cancel reservation for "${book.title}"?`,
          async () => {
            await api.cancelReservation(res.id);
            toast('Reservation cancelled.', 'success');
            this.renderReservations(container);
          },
          { danger: true, confirmLabel: 'Cancel Reservation', title: 'Cancel Reservation' }
        );
      });
    });
  },

  renderReservationsTable(reservations, isLibrarian) {
    if (reservations.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">No reservations</div><div class="empty-state-message">No books are currently reserved.</div></div>`;
    }
    return `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>Book</th>
            ${isLibrarian ? '<th>Member</th>' : ''}
            <th>Reserved On</th>
            <th>Status</th>
            <th>Available</th>
            <th>Action</th>
          </tr></thead>
          <tbody>
            ${reservations.map(r => {
              const book = store.getBook(r.bookId);
              const member = store.getMember(r.memberId);
              return `
                <tr>
                  <td><span style="font-weight:500;">${escapeHtml(book.title)}</span></td>
                  ${isLibrarian ? `<td>${escapeHtml(member.name)}</td>` : ''}
                  <td>${formatDate(r.reservedOn)}</td>
                  <td>${statusBadge(r.status)}</td>
                  <td>${book.availableCopies > 0 ? '<span class="badge badge-success">Yes</span>' : '<span class="badge badge-warning">No</span>'}</td>
                  <td><button class="btn btn-xs btn-danger" data-cancel-res="${r.id}">Cancel</button></td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  // ---- RETURNS ----
  renderReturns(container) {
    const isLibrarian = auth.isLibrarian();
    const member = auth.getCurrentMember();
    let returns;

    if (isLibrarian) {
      returns = store.getBorrowings().filter(b => b.status === 'returned');
    } else {
      returns = store.getBorrowingsByMember(member.id).filter(b => b.status === 'returned');
    }

    container.innerHTML = `
      <div class="content-header">
        <div class="content-title">
          <h1>Return History</h1>
          <span class="count-badge">${returns.length} returns</span>
        </div>
      </div>
      <div class="section">
        <div class="section-body no-pad">
          ${this.renderReturnsTable(returns, isLibrarian)}
        </div>
      </div>
    `;
  },

  renderReturnsTable(returns, isLibrarian) {
    if (returns.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">No returns yet</div><div class="empty-state-message">No books have been returned.</div></div>`;
    }
    return `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>Book</th>
            ${isLibrarian ? '<th>Member</th>' : ''}
            <th>Issue Date</th>
            <th>Due Date</th>
            <th>Returned On</th>
            <th>Fine</th>
          </tr></thead>
          <tbody>
            ${returns.map(b => {
              const book = store.getBook(b.bookId);
              const member = store.getMember(b.memberId);
              return `
                <tr>
                  <td><span style="font-weight:500;">${escapeHtml(book.title)}</span></td>
                  ${isLibrarian ? `<td>${escapeHtml(member.name)}</td>` : ''}
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

  // ---- FINES ----
  renderFines(container) {
    const isLibrarian = auth.isLibrarian();
    const member = auth.getCurrentMember();
    let fines;

    if (isLibrarian) {
      fines = store.getFines();
    } else {
      fines = store.getFinesByMember(member.id);
    }

    const totalUnpaid = fines.filter(f => f.status === 'unpaid' && f.amount > 0).reduce((sum, f) => sum + f.amount, 0);

    container.innerHTML = `
      <div class="content-header">
        <div class="content-title">
          <h1>Fines</h1>
          <span class="count-badge">${fines.filter(f => f.status === 'unpaid' && f.amount > 0).length} unpaid</span>
        </div>
      </div>

      ${totalUnpaid > 0 ? `
        <div class="stat-grid" style="grid-template-columns:1fr;">
          <div class="stat-card">
            <div class="stat-icon red">${icons.fine}</div>
            <div><div class="stat-value">$${totalUnpaid}</div><div class="stat-label">Total Outstanding</div></div>
          </div>
        </div>
      ` : ''}

      <div class="section">
        <div class="section-body no-pad">
          ${this.renderFinesTable(fines, isLibrarian)}
        </div>
      </div>
    `;

    this.bindFineActions(container);
  },

  renderFinesTable(fines, isLibrarian) {
    const activeFines = fines.filter(f => f.amount > 0 || f.status === 'paid');
    if (activeFines.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">No fines</div><div class="empty-state-message">There are no outstanding fines.</div></div>`;
    }
    return `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr>
            ${isLibrarian ? '<th>Member</th>' : ''}
            <th>Book</th>
            <th>Due Date</th>
            <th>Days Overdue</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr></thead>
          <tbody>
            ${activeFines.map(f => {
              const book = store.getBook(f.bookId);
              const member = store.getMember(f.memberId);
              return `
                <tr>
                  ${isLibrarian ? `<td>${escapeHtml(member.name)}</td>` : ''}
                  <td><span style="font-weight:500;">${escapeHtml(book ? book.title : 'Unknown')}</span></td>
                  <td>${formatDate(f.dueDate)}</td>
                  <td>${f.daysOverdue || daysOverdue(f.dueDate)}</td>
                  <td><span class="fine-amount">$${f.amount}</span></td>
                  <td>${statusBadge(f.status)}</td>
                  <td>
                    ${f.status === 'unpaid' ? `
                      <button class="btn btn-xs btn-primary" data-pay="${f.id}">Pay Fine</button>
                    ` : '<span class="text-muted">Paid</span>'}
                  </td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  bindFineActions(container) {
    container.querySelectorAll('[data-pay]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const fine = store.getFines().find(f => f.id === btn.dataset.pay);
        if (!fine) return;
        confirmDialog(
          `Pay fine of $${fine.amount}?`,
          async () => {
            await api.payFine(fine.id);
            const member = store.getMember(fine.memberId);
            store.addNotification(member.id, 'success', 'Fine paid', `Your fine of $${fine.amount} has been paid.`);
            toast('Fine marked as paid.', 'success');
            this.renderFines(container);
            document.dispatchEvent(new CustomEvent('sl:update-notifications'));
          },
          { confirmLabel: 'Pay Fine', title: 'Pay Fine' }
        );
      });
    });
  }
};
