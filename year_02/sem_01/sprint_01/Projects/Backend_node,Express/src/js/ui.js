/**
 * SmartLibrary - UI Utilities
 * Toasts, modals, confirmations, icons, and helpers.
 */

// ---- Icons (inline SVG) ----
export const icons = {
  book: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>',
  library: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 6l4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>',
  browse: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  collection: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
  borrow: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18"/><path d="M3 12h18"/><path d="M3 18h18"/></svg>',
  reservation: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  return: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 14l4-4"/><path d="M5 14l4-4"/><path d="M9 10V5"/><path d="M3 22h18"/><path d="M3 22V10"/></svg>',
  members: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/></svg>',
  fine: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  dashboard: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>',
  report: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 3v18h18"/><rect x="7" y="11" width="3" height="6"/><rect x="12" y="7" width="3" height="10"/><rect x="17" y="13" width="3" height="4"/></svg>',
  bell: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>',
  settings: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  logout: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>',
  search: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  grid: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>',
  list: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>',
  filter: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  sort: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18"/><path d="M6 12h12"/><path d="M9 18h6"/></svg>',
  bookmark: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  bookmarkFill: '<svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="currentColor" stroke-width="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>',
  close: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  edit: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>',
  trash: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  view: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
  plus: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
  user: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  check: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
  clock: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  alert: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  info: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
};

// ---- Toast Notifications ----
let toastContainer = null;

function ensureToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    toastContainer.setAttribute('role', 'status');
    toastContainer.setAttribute('aria-live', 'polite');
    document.body.appendChild(toastContainer);
  }
}

export function toast(message, type = 'info') {
  ensureToastContainer();
  const el = document.createElement('div');
  el.className = `toast toast-${type}`;
  el.innerHTML = `
    <span class="toast-icon">${type === 'success' ? icons.check : type === 'error' ? icons.alert : type === 'warning' ? icons.alert : icons.info}</span>
    <span class="toast-message">${message}</span>
  `;
  toastContainer.appendChild(el);
  requestAnimationFrame(() => el.classList.add('show'));
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 200);
  }, 3000);
}

// ---- Modal ----
let modalOverlay = null;

export function showModal(contentHtml, options = {}) {
  closeModal();
  modalOverlay = document.createElement('div');
  modalOverlay.className = 'modal-overlay';
  modalOverlay.setAttribute('role', 'dialog');
  modalOverlay.setAttribute('aria-modal', 'true');
  if (options.labelledBy) modalOverlay.setAttribute('aria-labelledby', options.labelledBy);

  const modal = document.createElement('div');
  modal.className = `modal ${options.size || ''}`;
  modal.innerHTML = `
    <div class="modal-header">
      <h2 id="${options.labelledBy || ''}">${options.title || ''}</h2>
      <button class="modal-close" aria-label="Close modal">${icons.close}</button>
    </div>
    <div class="modal-body">${contentHtml}</div>
  `;

  modalOverlay.appendChild(modal);
  document.body.appendChild(modalOverlay);
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => modalOverlay.classList.add('show'));

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });
  modal.querySelector('.modal-close').addEventListener('click', closeModal);

  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);

  return modal;
}

export function closeModal() {
  if (modalOverlay) {
    modalOverlay.classList.remove('show');
    const old = modalOverlay;
    setTimeout(() => {
      if (old.parentNode) old.remove();
    }, 200);
    modalOverlay = null;
    document.body.style.overflow = '';
  }
}

// ---- Confirmation Dialog ----
export function confirmDialog(message, onConfirm, options = {}) {
  const content = `
    <p class="confirm-message">${message}</p>
    <div class="confirm-actions">
      <button class="btn btn-secondary" data-action="cancel">Cancel</button>
      <button class="btn ${options.danger ? 'btn-danger' : 'btn-primary'}" data-action="confirm">${options.confirmLabel || 'Confirm'}</button>
    </div>
  `;
  const modal = showModal(content, { title: options.title || 'Confirm Action' });
  modal.querySelector('[data-action="confirm"]').addEventListener('click', () => {
    closeModal();
    onConfirm();
  });
  modal.querySelector('[data-action="cancel"]').addEventListener('click', closeModal);
}

// ---- Helpers ----
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function daysBetween(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1);
  const d2 = new Date(dateStr2);
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

export function daysOverdue(dueDateStr) {
  const due = new Date(dueDateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);
  return Math.floor((now - due) / (1000 * 60 * 60 * 24));
}

export function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

export function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export function bookCover(book, size = 'normal') {
  const w = size === 'large' ? '180' : '80';
  const h = size === 'large' ? '270' : '120';
  const fs = size === 'large' ? '16' : '11';
  const titleSize = size === 'large' ? '14' : '10';
  return `
    <div class="book-cover ${size}" style="background:${book.coverColor};color:${book.coverTextColor};width:${w}px;height:${h}px;">
      <div class="book-cover-inner">
        <div class="book-cover-title" style="font-size:${titleSize}px;">${escapeHtml(book.title)}</div>
        <div class="book-cover-author" style="font-size:${fs}px;">${escapeHtml(book.author)}</div>
      </div>
      <div class="book-cover-spine"></div>
    </div>
  `;
}

export function availabilityBadge(book) {
  if (book.availableCopies === 0) {
    return '<span class="badge badge-danger">Checked Out</span>';
  } else if (book.availableCopies < book.totalCopies / 2) {
    return '<span class="badge badge-warning">Low Stock</span>';
  } else {
    return '<span class="badge badge-success">Available</span>';
  }
}

export function statusBadge(status) {
  const map = {
    'borrowed': '<span class="badge badge-info">Borrowed</span>',
    'overdue': '<span class="badge badge-danger">Overdue</span>',
    'returned': '<span class="badge badge-success">Returned</span>',
    'waiting': '<span class="badge badge-warning">Waiting</span>',
    'ready': '<span class="badge badge-success">Ready</span>',
    'active': '<span class="badge badge-success">Active</span>',
    'suspended': '<span class="badge badge-danger">Suspended</span>',
    'paid': '<span class="badge badge-success">Paid</span>',
    'unpaid': '<span class="badge badge-danger">Unpaid</span>'
  };
  return map[status] || `<span class="badge">${escapeHtml(status)}</span>`;
}
