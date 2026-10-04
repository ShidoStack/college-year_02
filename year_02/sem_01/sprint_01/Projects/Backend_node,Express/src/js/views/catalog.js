/**
 * SmartLibrary - Catalog View
 * The main library browsing screen: search, filter, sort, grid/list, alphabet nav.
 */

import { store } from '../store.js';
import { auth } from '../auth.js';
import { api } from '../api.js';
import {
  icons, toast, showModal, closeModal, confirmDialog,
  escapeHtml, formatDate, getInitials, bookCover, availabilityBadge, statusBadge,
  daysOverdue
} from '../ui.js';
import { GENRES } from '../data.js';

const catalogState = {
  search: '',
  sortBy: 'title',
  filterGenres: [],
  filterAvailability: 'all',
  view: localStorage.getItem('sl_view') || 'grid',
  activeLetter: ''
};

export const catalogView = {
  render(container, navId) {
    const books = store.getBooks();

    // Collections page just shows books grouped by genre
    if (navId === 'collections') {
      this.renderCollections(container);
      return;
    }

    // Browse page is same as library but without the page title variation
    const pageTitle = navId === 'library' ? 'My Library' : 'Browse Books';

    container.innerHTML = `
      <div class="content-header">
        <div class="content-title">
          <h1>${pageTitle}</h1>
          <span class="count-badge">${books.length} books</span>
        </div>
        <div class="view-controls">
          <div class="view-toggle">
            <button class="view-toggle-btn ${catalogState.view === 'grid' ? 'active' : ''}" data-view="grid">${icons.grid} Grid</button>
            <button class="view-toggle-btn ${catalogState.view === 'list' ? 'active' : ''}" data-view="list">${icons.list} List</button>
          </div>
          <select class="select-control" id="sortSelect">
            <option value="title">Sort: Title</option>
            <option value="author">Sort: Author</option>
            <option value="genre">Sort: Genre</option>
            <option value="year">Sort: Year</option>
            <option value="newest">Sort: Newest</option>
          </select>
          <button class="btn btn-sm" id="filterBtn">${icons.filter} Filters</button>
        </div>
      </div>

      <div class="filter-panel" id="filterPanel">
        <div class="filter-section">
          <div class="filter-label">Genre</div>
          <div class="filter-options" id="genreFilters">
            ${GENRES.map(g => `<span class="filter-chip" data-genre="${g}">${g}</span>`).join('')}
          </div>
        </div>
        <div class="filter-section">
          <div class="filter-label">Availability</div>
          <div class="filter-options">
            <span class="filter-chip" data-avail="all">All</span>
            <span class="filter-chip" data-avail="available">Available</span>
            <span class="filter-chip" data-avail="borrowed">Checked Out</span>
            <span class="filter-chip" data-avail="reserved">Reserved</span>
          </div>
        </div>
        <div class="filter-actions">
          <button class="btn btn-sm btn-secondary" id="clearFilters">Clear Filters</button>
          <button class="btn btn-sm btn-primary" id="applyFilters">Apply Filters</button>
        </div>
      </div>

      <div class="alphabet-nav" id="alphabetNav"></div>

      <div id="bookDisplay"></div>
    `;

    // Set sort value
    document.getElementById('sortSelect').value = catalogState.sortBy;

    this.buildAlphabetNav();
    this.bindControls(container);
    this.renderBooks();
    this.syncFilterChips();
  },

  buildAlphabetNav() {
    const nav = document.getElementById('alphabetNav');
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    letters.push('#');
    const books = store.getBooks();
    const availableLetters = new Set(books.map(b => {
      const first = b.title[0].toUpperCase();
      return /[A-Z]/.test(first) ? first : '#';
    }));

    nav.innerHTML = letters.map(letter => {
      const isAvailable = availableLetters.has(letter);
      const isActive = catalogState.activeLetter === letter;
      return `<span class="alphabet-letter ${isActive ? 'active' : ''} ${!isAvailable ? 'disabled' : ''}" data-letter="${letter}">${letter}</span>`;
    }).join('');

    nav.querySelectorAll('.alphabet-letter').forEach(el => {
      if (!el.classList.contains('disabled')) {
        el.addEventListener('click', () => {
          if (catalogState.activeLetter === el.dataset.letter) {
            catalogState.activeLetter = '';
          } else {
            catalogState.activeLetter = el.dataset.letter;
          }
          this.buildAlphabetNav();
          this.renderBooks();
        });
      }
    });
  },

  bindControls(container) {
    // View toggle
    container.querySelectorAll('.view-toggle-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        catalogState.view = btn.dataset.view;
        localStorage.setItem('sl_view', catalogState.view);
        container.querySelectorAll('.view-toggle-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.renderBooks();
      });
    });

    // Sort
    document.getElementById('sortSelect').addEventListener('change', (e) => {
      catalogState.sortBy = e.target.value;
      this.renderBooks();
    });

    // Filter toggle
    document.getElementById('filterBtn').addEventListener('click', () => {
      document.getElementById('filterPanel').classList.toggle('show');
    });

    // Genre chips
    document.querySelectorAll('[data-genre]').forEach(chip => {
      chip.addEventListener('click', () => {
        const genre = chip.dataset.genre;
        const idx = catalogState.filterGenres.indexOf(genre);
        if (idx >= 0) {
          catalogState.filterGenres.splice(idx, 1);
          chip.classList.remove('active');
        } else {
          catalogState.filterGenres.push(genre);
          chip.classList.add('active');
        }
      });
    });

    // Availability chips
    document.querySelectorAll('[data-avail]').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('[data-avail]').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        catalogState.filterAvailability = chip.dataset.avail;
      });
    });

    // Apply / Clear filters
    document.getElementById('applyFilters').addEventListener('click', () => {
      document.getElementById('filterPanel').classList.remove('show');
      this.renderBooks();
    });

    document.getElementById('clearFilters').addEventListener('click', () => {
      catalogState.filterGenres = [];
      catalogState.filterAvailability = 'all';
      catalogState.activeLetter = '';
      this.syncFilterChips();
      this.buildAlphabetNav();
      this.renderBooks();
    });
  },

  syncFilterChips() {
    document.querySelectorAll('[data-genre]').forEach(chip => {
      chip.classList.toggle('active', catalogState.filterGenres.includes(chip.dataset.genre));
    });
    document.querySelectorAll('[data-avail]').forEach(chip => {
      chip.classList.toggle('active', chip.dataset.avail === catalogState.filterAvailability);
    });
  },

  setSearch(value) {
    catalogState.search = value;
    this.renderBooks();
  },

  getFilteredBooks() {
    let books = store.getBooks();

    // Search
    if (catalogState.search) {
      const q = catalogState.search.toLowerCase();
      books = books.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        b.isbn.includes(q) ||
        b.genre.toLowerCase().includes(q)
      );
    }

    // Alphabet filter
    if (catalogState.activeLetter) {
      books = books.filter(b => {
        const first = b.title[0].toUpperCase();
        const letter = /[A-Z]/.test(first) ? first : '#';
        return letter === catalogState.activeLetter;
      });
    }

    // Genre filter
    if (catalogState.filterGenres.length > 0) {
      books = books.filter(b => catalogState.filterGenres.includes(b.genre));
    }

    // Availability filter
    if (catalogState.filterAvailability === 'available') {
      books = books.filter(b => b.availableCopies > 0);
    } else if (catalogState.filterAvailability === 'borrowed') {
      books = books.filter(b => b.availableCopies === 0);
    } else if (catalogState.filterAvailability === 'reserved') {
      const reservedBookIds = store.getReservations().map(r => r.bookId);
      books = books.filter(b => reservedBookIds.includes(b.id));
    }

    // Sort
    books = [...books];
    switch (catalogState.sortBy) {
      case 'title': books.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'author': books.sort((a, b) => a.author.localeCompare(b.author)); break;
      case 'genre': books.sort((a, b) => a.genre.localeCompare(b.genre)); break;
      case 'year': books.sort((a, b) => a.year - b.year); break;
      case 'newest': books.sort((a, b) => b.addedDate.localeCompare(a.addedDate)); break;
    }

    return books;
  },

  renderBooks() {
    const display = document.getElementById('bookDisplay');
    if (!display) return;

    const books = this.getFilteredBooks();

    if (books.length === 0) {
      display.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">${icons.search}</div>
          <div class="empty-state-title">No books found</div>
          <div class="empty-state-message">Try another title, author, or ISBN.</div>
        </div>
      `;
      return;
    }

    if (catalogState.view === 'grid') {
      display.innerHTML = `<div class="book-grid">${books.map(b => this.bookCardHtml(b)).join('')}</div>`;
      this.bindBookCards(display);
    } else {
      display.innerHTML = `
        <div class="book-list">
          <div class="book-list-header">
            <div>Cover</div>
            <div>Title</div>
            <div class="col-author">Author</div>
            <div class="col-genre">Genre</div>
            <div>Status</div>
            <div>ISBN</div>
          </div>
          ${books.map(b => this.bookListRowHtml(b)).join('')}
        </div>
      `;
      this.bindBookRows(display);
    }
  },

  bookCardHtml(book) {
    const isWishlisted = store.isInWishlist(book.id);
    return `
      <div class="book-card" data-book-id="${book.id}">
        <div class="book-card-cover">
          ${bookCover(book)}
          <div class="book-card-bookmark ${isWishlisted ? 'active' : ''}" data-bookmark="${book.id}">
            ${isWishlisted ? icons.bookmarkFill : icons.bookmark}
          </div>
          <div class="book-card-status">${availabilityBadge(book)}</div>
        </div>
        <div class="book-card-info">
          <div class="book-card-title">${escapeHtml(book.title)}</div>
          <div class="book-card-author">${escapeHtml(book.author)}</div>
          <div class="book-card-genre">${escapeHtml(book.genre)}</div>
        </div>
      </div>
    `;
  },

  bookListRowHtml(book) {
    return `
      <div class="book-list-row" data-book-id="${book.id}">
        <div>${bookCover(book)}</div>
        <div>
          <div class="book-list-title">${escapeHtml(book.title)}</div>
          <div class="book-card-genre">${escapeHtml(book.genre)}</div>
        </div>
        <div class="col-author book-list-author">${escapeHtml(book.author)}</div>
        <div class="col-genre book-list-genre">${escapeHtml(book.genre)}</div>
        <div>${availabilityBadge(book)}</div>
        <div class="nowrap text-muted" style="font-size:11px;">${book.isbn}</div>
      </div>
    `;
  },

  bindBookCards(container) {
    container.querySelectorAll('.book-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-bookmark]')) return;
        this.openBookDetail(card.dataset.bookId);
      });
    });
    container.querySelectorAll('[data-bookmark]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        store.toggleWishlist(btn.dataset.bookmark);
        this.renderBooks();
        toast(store.isInWishlist(btn.dataset.bookmark) ? 'Added to wishlist' : 'Removed from wishlist', 'info');
      });
    });
  },

  bindBookRows(container) {
    container.querySelectorAll('.book-list-row').forEach(row => {
      row.addEventListener('click', () => {
        this.openBookDetail(row.dataset.bookId);
      });
    });
  },

  openBookDetail(bookId) {
    const book = store.getBook(bookId);
    if (!book) return;

    const isWishlisted = store.isInWishlist(book.id);
    const borrowings = store.getBorrowings().filter(b => b.bookId === bookId && b.status !== 'returned');
    const currentBorrower = borrowings.length > 0 ? store.getMember(borrowings[0].memberId) : null;
    const dueDate = borrowings.length > 0 ? borrowings[0].dueDate : null;
    const reservations = store.getReservations().filter(r => r.bookId === bookId);
    const availablePct = book.totalCopies > 0 ? (book.availableCopies / book.totalCopies) * 100 : 0;

    const member = auth.getCurrentMember();
    const canBorrow = book.availableCopies > 0 && auth.isStudent();
    const canReserve = book.availableCopies === 0 && auth.isStudent();
    const isLibrarian = auth.isLibrarian();

    const content = `
      <div class="book-detail">
        <div class="book-detail-cover">
          ${bookCover(book, 'large')}
        </div>
        <div class="book-detail-info">
          <h3>${escapeHtml(book.title)}</h3>
          <div class="book-detail-author">by ${escapeHtml(book.author)}</div>

          <div class="book-detail-copies">
            <span style="font-size:12px;color:var(--color-text-muted);">Availability:</span>
            <div class="copies-bar">
              <div class="copies-bar-fill" style="width:${availablePct}%"></div>
            </div>
            <span style="font-size:12px;font-weight:600;">${book.availableCopies} / ${book.totalCopies} copies</span>
          </div>

          <div class="book-detail-meta">
            <div class="book-detail-meta-item">
              <div class="book-detail-meta-label">Genre</div>
              <div class="book-detail-meta-value">${escapeHtml(book.genre)}</div>
            </div>
            <div class="book-detail-meta-item">
              <div class="book-detail-meta-label">ISBN</div>
              <div class="book-detail-meta-value">${book.isbn}</div>
            </div>
            <div class="book-detail-meta-item">
              <div class="book-detail-meta-label">Publisher</div>
              <div class="book-detail-meta-value">${escapeHtml(book.publisher)}</div>
            </div>
            <div class="book-detail-meta-item">
              <div class="book-detail-meta-label">Published</div>
              <div class="book-detail-meta-value">${book.year}</div>
            </div>
            ${currentBorrower ? `
            <div class="book-detail-meta-item">
              <div class="book-detail-meta-label">Current Borrower</div>
              <div class="book-detail-meta-value">${escapeHtml(currentBorrower.name)}</div>
            </div>
            <div class="book-detail-meta-item">
              <div class="book-detail-meta-label">Due Date</div>
              <div class="book-detail-meta-value">${formatDate(dueDate)}</div>
            </div>
            ` : ''}
          </div>

          <div class="book-detail-desc">${escapeHtml(book.description)}</div>

          ${reservations.length > 0 ? `<div style="margin-bottom:12px;font-size:12px;color:var(--color-warning);">${icons.clock} ${reservations.length} reservation(s) pending</div>` : ''}

          <div class="book-detail-actions">
            <button class="btn btn-primary btn-sm" data-action="borrow" ${!canBorrow ? 'disabled' : ''}>
              ${icons.borrow} Borrow
            </button>
            <button class="btn btn-sm" data-action="reserve" ${!canReserve ? 'disabled' : ''}>
              ${icons.reservation} Reserve
            </button>
            <button class="btn btn-sm ${isWishlisted ? 'btn-secondary' : ''}" data-action="wishlist">
              ${isWishlisted ? icons.bookmarkFill : icons.bookmark} ${isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </button>
            ${isLibrarian ? `
              <button class="btn btn-sm btn-secondary" data-action="edit">${icons.edit} Edit</button>
              <button class="btn btn-sm btn-danger" data-action="delete">${icons.trash} Delete</button>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    const modal = showModal(content, { title: 'Book Details', size: 'large' });

    // Bind actions
    modal.querySelector('[data-action="borrow"]').addEventListener('click', () => {
      this.borrowBook(book.id);
    });
    modal.querySelector('[data-action="reserve"]').addEventListener('click', () => {
      this.reserveBook(book.id);
    });
    modal.querySelector('[data-action="wishlist"]').addEventListener('click', () => {
      store.toggleWishlist(book.id);
      this.openBookDetail(book.id);
      toast(store.isInWishlist(book.id) ? 'Added to wishlist' : 'Removed from wishlist', 'info');
    });
    if (isLibrarian) {
      modal.querySelector('[data-action="edit"]').addEventListener('click', () => {
        closeModal();
        this.openEditBookModal(book.id);
      });
      modal.querySelector('[data-action="delete"]').addEventListener('click', () => {
        confirmDialog(
          `Are you sure you want to delete "${book.title}"? This action cannot be undone.`,
          () => this.deleteBook(book.id),
          { danger: true, confirmLabel: 'Delete', title: 'Delete Book' }
        );
      });
    }
  },

  async borrowBook(bookId) {
    const member = auth.getCurrentMember();
    if (!member) return;
    try {
      await api.borrowBook(bookId, member.id);
      store.addNotification(member.id, 'success', 'Book borrowed', `You have borrowed "${store.getBook(bookId).title}". Due in 14 days.`);
      toast('Book borrowed successfully. Due in 14 days.', 'success');
      closeModal();
      this.renderBooks();
      // Update notification badge
      document.dispatchEvent(new CustomEvent('sl:update-notifications'));
    } catch (err) {
      toast('Failed to borrow book.', 'error');
    }
  },

  async reserveBook(bookId) {
    const member = auth.getCurrentMember();
    if (!member) return;
    try {
      await api.reserveBook(bookId, member.id);
      store.addNotification(member.id, 'general', 'Book reserved', `You have reserved "${store.getBook(bookId).title}". You will be notified when it is available.`);
      toast('Book reserved. You will be notified when available.', 'success');
      closeModal();
      document.dispatchEvent(new CustomEvent('sl:update-notifications'));
    } catch (err) {
      toast('Failed to reserve book.', 'error');
    }
  },

  deleteBook(bookId) {
    const book = store.getBook(bookId);
    store.deleteBook(bookId);
    toast(`"${book.title}" has been deleted.`, 'success');
    this.renderBooks();
  },

  openEditBookModal(bookId) {
    const book = bookId ? store.getBook(bookId) : null;
    managementView.openBookForm(book);
  },

  renderCollections(container) {
    const books = store.getBooks();
    const genreGroups = {};
    books.forEach(b => {
      if (!genreGroups[b.genre]) genreGroups[b.genre] = [];
      genreGroups[b.genre].push(b);
    });

    let html = `
      <div class="content-header">
        <div class="content-title">
          <h1>Collections</h1>
          <span class="count-badge">${Object.keys(genreGroups).length} genres</span>
        </div>
      </div>
    `;

    Object.keys(genreGroups).sort().forEach(genre => {
      html += `
        <div class="section">
          <div class="section-header">
            <h3>${escapeHtml(genre)}</h3>
            <span class="text-muted" style="font-size:12px;">${genreGroups[genre].length} books</span>
          </div>
          <div class="section-body no-pad">
            <div class="book-grid" style="padding:12px;">
              ${genreGroups[genre].map(b => this.bookCardHtml(b)).join('')}
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;
    this.bindBookCards(container);
  }
};

export { catalogState };
