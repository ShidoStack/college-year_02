/**
 * SmartLibrary - Management View
 * Member management and Book management (librarian only).
 */

import { store } from '../store.js';
import { auth } from '../auth.js';
import { api } from '../api.js';
import {
  icons, toast, showModal, closeModal, confirmDialog,
  escapeHtml, formatDate, statusBadge, bookCover, availabilityBadge, getInitials
} from '../ui.js';
import { GENRES } from '../data.js';
import { catalogView } from './catalog.js';

export const managementView = {
  render(container, view) {
    switch (view) {
      case 'members': this.renderMembers(container); break;
      case 'book-mgmt': this.renderBookManagement(container); break;
    }
  },

  // ---- MEMBER MANAGEMENT ----
  renderMembers(container) {
    const members = store.getMembers();

    container.innerHTML = `
      <div class="content-header">
        <div class="content-title">
          <h1>Members</h1>
          <span class="count-badge">${members.length} members</span>
        </div>
      </div>
      <div class="section">
        <div class="section-body no-pad">
          ${this.renderMembersTable(members)}
        </div>
      </div>
    `;

    this.bindMemberActions(container);
  },

  renderMembersTable(members) {
    if (members.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">No members</div></div>`;
    }
    return `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Membership ID</th>
            <th>Role</th>
            <th>Status</th>
            <th>Books</th>
            <th>Fine</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            ${members.map(m => `
              <tr>
                <td style="font-family:monospace;font-size:11px;">${m.id}</td>
                <td><span style="font-weight:500;">${escapeHtml(m.name)}</span></td>
                <td style="font-size:12px;">${escapeHtml(m.email)}</td>
                <td style="font-family:monospace;font-size:11px;">${m.membershipId}</td>
                <td><span style="text-transform:capitalize;">${m.role}</span></td>
                <td>${statusBadge(m.status)}</td>
                <td>${m.booksBorrowed}</td>
                <td>${m.outstandingFine > 0 ? `<span class="fine-amount">$${m.outstandingFine}</span>` : '<span class="text-muted">—</span>'}</td>
                <td>
                  <button class="icon-btn" data-view-member="${m.id}" title="View">${icons.view}</button>
                  <button class="icon-btn" data-edit-member="${m.id}" title="Edit">${icons.edit}</button>
                  <button class="icon-btn" data-toggle-member="${m.id}" title="${m.status === 'active' ? 'Deactivate' : 'Activate'}">${m.status === 'active' ? icons.trash : icons.check}</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  bindMemberActions(container) {
    container.querySelectorAll('[data-view-member]').forEach(btn => {
      btn.addEventListener('click', () => this.openMemberDetail(btn.dataset.viewMember));
    });
    container.querySelectorAll('[data-edit-member]').forEach(btn => {
      btn.addEventListener('click', () => this.openEditMember(btn.dataset.editMember));
    });
    container.querySelectorAll('[data-toggle-member]').forEach(btn => {
      btn.addEventListener('click', () => {
        const member = store.getMember(btn.dataset.toggleMember);
        if (!member) return;
        const newStatus = member.status === 'active' ? 'suspended' : 'active';
        confirmDialog(
          `${newStatus === 'active' ? 'Activate' : 'Deactivate'} member "${member.name}"?`,
          () => {
            store.updateMember(member.id, { status: newStatus });
            toast(`Member ${newStatus === 'active' ? 'activated' : 'deactivated'}.`, 'success');
            this.renderMembers(container);
          },
          { danger: newStatus === 'suspended', confirmLabel: newStatus === 'active' ? 'Activate' : 'Deactivate', title: `${newStatus === 'active' ? 'Activate' : 'Deactivate'} Member` }
        );
      });
    });
  },

  openMemberDetail(memberId) {
    const member = store.getMember(memberId);
    if (!member) return;
    const borrowings = store.getBorrowingsByMember(memberId);
    const active = borrowings.filter(b => b.status !== 'returned');
    const history = borrowings.filter(b => b.status === 'returned');
    const reservations = store.getReservationsByMember(memberId);
    const fines = store.getFinesByMember(memberId).filter(f => f.status === 'unpaid' && f.amount > 0);

    const content = `
      <div style="display:flex;gap:16px;align-items:center;margin-bottom:16px;">
        <div class="topbar-user-avatar" style="width:48px;height:48px;font-size:18px;">${getInitials(member.name)}</div>
        <div>
          <h3 style="margin:0;">${escapeHtml(member.name)}</h3>
          <div style="color:var(--color-text-muted);font-size:13px;">${escapeHtml(member.email)}</div>
          <div style="margin-top:4px;">${statusBadge(member.status)} <span style="font-size:12px;color:var(--color-text-muted);text-transform:capitalize;margin-left:8px;">${member.role}</span></div>
        </div>
      </div>
      <div class="book-detail-meta" style="margin-bottom:16px;">
        <div><div class="book-detail-meta-label">Member ID</div><div class="book-detail-meta-value">${member.id}</div></div>
        <div><div class="book-detail-meta-label">Membership ID</div><div class="book-detail-meta-value">${member.membershipId}</div></div>
        <div><div class="book-detail-meta-label">Joined</div><div class="book-detail-meta-value">${formatDate(member.joinedDate)}</div></div>
        <div><div class="book-detail-meta-label">Outstanding Fine</div><div class="book-detail-meta-value">${member.outstandingFine > 0 ? `<span class="fine-amount">$${member.outstandingFine}</span>` : '—'}</div></div>
      </div>

      <div class="dash-section-title">Active Borrowings (${active.length})</div>
      ${active.length === 0 ? '<p class="text-muted" style="font-size:13px;margin-bottom:16px;">No active borrowings.</p>' : `
        <div class="data-table-wrap" style="margin-bottom:16px;">
          <table class="data-table">
            <thead><tr><th>Book</th><th>Due Date</th><th>Status</th></tr></thead>
            <tbody>
              ${active.map(b => {
                const book = store.getBook(b.bookId);
                return `<tr><td>${escapeHtml(book.title)}</td><td>${formatDate(b.dueDate)}</td><td>${statusBadge(b.status)}</td></tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      `}

      <div class="dash-section-title">Fines (${fines.length})</div>
      ${fines.length === 0 ? '<p class="text-muted" style="font-size:13px;">No outstanding fines.</p>' : `
        <div class="data-table-wrap">
          <table class="data-table">
            <thead><tr><th>Book</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>
              ${fines.map(f => {
                const book = store.getBook(f.bookId);
                return `<tr><td>${escapeHtml(book ? book.title : '—')}</td><td class="fine-amount">$${f.amount}</td><td>${statusBadge(f.status)}</td></tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
      `}
    `;
    showModal(content, { title: 'Member Details', size: 'large' });
  },

  openEditMember(memberId) {
    const member = store.getMember(memberId);
    if (!member) return;

    const content = `
      <form id="editMemberForm">
        <div class="form-grid">
          <div class="form-group">
            <label>Name</label>
            <input type="text" id="ed-name" value="${escapeHtml(member.name)}" required />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" id="ed-email" value="${escapeHtml(member.email)}" required />
          </div>
          <div class="form-group">
            <label>Membership ID</label>
            <input type="text" id="ed-membershipId" value="${member.membershipId}" required />
          </div>
          <div class="form-group">
            <label>Status</label>
            <select id="ed-status">
              <option value="active" ${member.status === 'active' ? 'selected' : ''}>Active</option>
              <option value="suspended" ${member.status === 'suspended' ? 'selected' : ''}>Suspended</option>
            </select>
          </div>
        </div>
        <div class="confirm-actions" style="margin-top:16px;">
          <button type="button" class="btn btn-secondary" data-close>Cancel</button>
          <button type="submit" class="btn btn-primary">Save Changes</button>
        </div>
      </form>
    `;
    const modal = showModal(content, { title: 'Edit Member' });
    modal.querySelector('[data-close]').addEventListener('click', closeModal);
    modal.querySelector('#editMemberForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = modal.querySelector('#ed-name').value.trim();
      const email = modal.querySelector('#ed-email').value.trim();
      const membershipId = modal.querySelector('#ed-membershipId').value.trim();
      const status = modal.querySelector('#ed-status').value;

      if (!name || !email || !membershipId) {
        toast('All fields are required.', 'error');
        return;
      }
      store.updateMember(memberId, { name, email, membershipId, status });
      toast('Member updated successfully.', 'success');
      closeModal();
      this.renderMembers(document.getElementById('content'));
    });
  },

  // ---- BOOK MANAGEMENT ----
  renderBookManagement(container) {
    const books = store.getBooks();

    container.innerHTML = `
      <div class="content-header">
        <div class="content-title">
          <h1>Book Management</h1>
          <span class="count-badge">${books.length} books</span>
        </div>
        <button class="btn btn-primary btn-sm" id="addBookBtn">${icons.plus} Add Book</button>
      </div>
      <div class="section">
        <div class="section-body no-pad">
          ${this.renderBooksTable(books)}
        </div>
      </div>
    `;

    document.getElementById('addBookBtn').addEventListener('click', () => {
      this.openBookForm(null);
    });

    this.bindBookActions(container);
  },

  renderBooksTable(books) {
    if (books.length === 0) {
      return `<div class="empty-state"><div class="empty-state-title">No books</div><div class="empty-state-message">Click "Add Book" to add your first book.</div></div>`;
    }
    return `
      <div class="data-table-wrap">
        <table class="data-table">
          <thead><tr>
            <th>Cover</th>
            <th>Title</th>
            <th>Author</th>
            <th>Genre</th>
            <th>ISBN</th>
            <th>Copies</th>
            <th>Available</th>
            <th>Status</th>
            <th>Actions</th>
          </tr></thead>
          <tbody>
            ${books.map(b => `
              <tr>
                <td>${bookCover(b)}</td>
                <td><span style="font-weight:500;">${escapeHtml(b.title)}</span></td>
                <td>${escapeHtml(b.author)}</td>
                <td>${escapeHtml(b.genre)}</td>
                <td style="font-family:monospace;font-size:11px;">${b.isbn}</td>
                <td>${b.totalCopies}</td>
                <td>${b.availableCopies}</td>
                <td>${availabilityBadge(b)}</td>
                <td>
                  <button class="icon-btn" data-view-book="${b.id}" title="View">${icons.view}</button>
                  <button class="icon-btn" data-edit-book="${b.id}" title="Edit">${icons.edit}</button>
                  <button class="icon-btn" data-delete-book="${b.id}" title="Delete">${icons.trash}</button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  },

  bindBookActions(container) {
    container.querySelectorAll('[data-view-book]').forEach(btn => {
      btn.addEventListener('click', () => {
        catalogView.openBookDetail(btn.dataset.viewBook);
      });
    });
    container.querySelectorAll('[data-edit-book]').forEach(btn => {
      btn.addEventListener('click', () => this.openBookForm(store.getBook(btn.dataset.editBook)));
    });
    container.querySelectorAll('[data-delete-book]').forEach(btn => {
      btn.addEventListener('click', () => {
        const book = store.getBook(btn.dataset.deleteBook);
        if (!book) return;
        confirmDialog(
          `Delete "${book.title}"? This cannot be undone.`,
          () => {
            store.deleteBook(book.id);
            toast(`"${book.title}" deleted.`, 'success');
            this.renderBookManagement(container);
          },
          { danger: true, confirmLabel: 'Delete', title: 'Delete Book' }
        );
      });
    });
  },

  openBookForm(book) {
    const isEdit = !!book;
    const content = `
      <form id="bookForm">
        <div class="form-grid">
          <div class="form-group">
            <label>Title *</label>
            <input type="text" id="bf-title" value="${book ? escapeHtml(book.title) : ''}" required />
          </div>
          <div class="form-group">
            <label>Author *</label>
            <input type="text" id="bf-author" value="${book ? escapeHtml(book.author) : ''}" required />
          </div>
          <div class="form-group">
            <label>Genre *</label>
            <select id="bf-genre" required>
              ${GENRES.map(g => `<option value="${g}" ${book && book.genre === g ? 'selected' : ''}>${g}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>ISBN *</label>
            <input type="text" id="bf-isbn" value="${book ? book.isbn : ''}" required />
          </div>
          <div class="form-group">
            <label>Publisher</label>
            <input type="text" id="bf-publisher" value="${book ? escapeHtml(book.publisher) : ''}" />
          </div>
          <div class="form-group">
            <label>Publication Year</label>
            <input type="number" id="bf-year" value="${book ? book.year : ''}" min="1800" max="2025" />
          </div>
          <div class="form-group">
            <label>Total Copies *</label>
            <input type="number" id="bf-totalCopies" value="${book ? book.totalCopies : 1}" min="1" required />
          </div>
          <div class="form-group">
            <label>Available Copies *</label>
            <input type="number" id="bf-availableCopies" value="${book ? book.availableCopies : 1}" min="0" required />
          </div>
          <div class="form-group full">
            <label>Cover Color (hex)</label>
            <input type="text" id="bf-coverColor" value="${book ? book.coverColor : '#1a365d'}" pattern="^#[0-9a-fA-F]{6}$" />
          </div>
          <div class="form-group full">
            <label>Description</label>
            <textarea id="bf-description" rows="3">${book ? escapeHtml(book.description) : ''}</textarea>
          </div>
        </div>
        <div class="confirm-actions" style="margin-top:16px;">
          <button type="button" class="btn btn-secondary" data-close>Cancel</button>
          <button type="submit" class="btn btn-primary">${isEdit ? 'Save Changes' : 'Add Book'}</button>
        </div>
      </form>
    `;
    const modal = showModal(content, { title: isEdit ? 'Edit Book' : 'Add Book', size: 'large' });
    modal.querySelector('[data-close]').addEventListener('click', closeModal);
    modal.querySelector('#bookForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        title: modal.querySelector('#bf-title').value.trim(),
        author: modal.querySelector('#bf-author').value.trim(),
        genre: modal.querySelector('#bf-genre').value,
        isbn: modal.querySelector('#bf-isbn').value.trim(),
        publisher: modal.querySelector('#bf-publisher').value.trim() || 'Unknown',
        year: parseInt(modal.querySelector('#bf-year').value) || new Date().getFullYear(),
        totalCopies: parseInt(modal.querySelector('#bf-totalCopies').value) || 1,
        availableCopies: parseInt(modal.querySelector('#bf-availableCopies').value) || 0,
        coverColor: modal.querySelector('#bf-coverColor').value || '#1a365d',
        coverTextColor: '#fff',
        description: modal.querySelector('#bf-description').value.trim() || 'No description available.',
        addedDate: book ? book.addedDate : new Date().toISOString().split('T')[0]
      };

      if (!data.title || !data.author || !data.isbn) {
        toast('Title, author, and ISBN are required.', 'error');
        return;
      }
      if (data.availableCopies > data.totalCopies) {
        toast('Available copies cannot exceed total copies.', 'error');
        return;
      }

      if (isEdit) {
        store.updateBook(book.id, data);
        toast('Book updated successfully.', 'success');
      } else {
        store.addBook(data);
        toast('Book added successfully.', 'success');
      }
      closeModal();
      this.renderBookManagement(document.getElementById('content'));
    });
  }
};
