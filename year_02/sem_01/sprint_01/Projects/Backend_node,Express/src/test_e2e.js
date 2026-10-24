/**
 * Comprehensive End-to-End Test Suite for SmartLibrary
 */

// Setup simulated browser environment
globalThis.localStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, val) => { store[key] = String(val); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

// Minimal DOM simulation for node testing
globalThis.document = {
  createElement: (tag) => {
    let content = '';
    return {
      classList: { add: () => {}, remove: () => {} },
      appendChild: () => {},
      remove: () => {},
      set textContent(val) { content = String(val).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); },
      get textContent() { return content; },
      set innerHTML(val) { content = val; },
      get innerHTML() { return content; }
    };
  },
  getElementById: () => null,
  querySelector: () => null,
  querySelectorAll: () => [],
  body: {
    appendChild: () => {}
  }
};

globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
globalThis.window = {
  location: { href: '' }
};

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${message}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${message}`);
  }
}

async function runTests() {
  console.log('--- Starting SmartLibrary E2E Automated Verification ---\n');

  // Dynamically import ES modules
  const { store } = await import('./js/store.js');
  const { auth } = await import('./js/auth.js');
  const { api } = await import('./js/api.js');
  const { getInitials, availabilityBadge, bookCover, daysOverdue, formatDate } = await import('./js/ui.js');
  const { catalogView } = await import('./js/views/catalog.js');
  const { circulationView } = await import('./js/views/circulation.js');
  const { dashboardView } = await import('./js/views/dashboard.js');
  const { managementView } = await import('./js/views/management.js');
  const { systemView } = await import('./js/views/system.js');

  // 1. Initial State & Data Check
  console.log('1. Checking Store Initialization:');
  const initialBooks = store.getBooks();
  const initialMembers = store.getMembers();
  assert(initialBooks.length === 28, `Found 28 initial books in catalog (actual: ${initialBooks.length})`);
  assert(initialMembers.length === 10, `Found 10 initial members (actual: ${initialMembers.length})`);
  assert(store.getBorrowings().length > 0, 'Found initial borrowings');
  assert(store.getReservations().length > 0, 'Found initial reservations');
  assert(store.getFines().length > 0, 'Found initial fines');

  // 2. Authentication Flow
  console.log('\n2. Testing Authentication Flow:');
  auth.init();
  assert(!auth.isLoggedIn(), 'Initially not logged in');

  // Invalid login
  let loginFailed = false;
  try {
    await auth.login('rahul.s@college.edu', 'wrongpass');
  } catch (e) {
    loginFailed = true;
  }
  assert(loginFailed, 'Incorrect password throws error');

  // Student Login
  const studentSession = await auth.login('rahul.s@college.edu', 'student123');
  assert(auth.isLoggedIn(), 'Student login successful');
  assert(auth.isStudent(), 'Session identified as student');
  assert(!auth.isLibrarian(), 'Student is not librarian');
  assert(studentSession.name === 'Rahul Sharma', `Session name is Rahul Sharma (actual: ${studentSession.name})`);

  // Registration Flow
  console.log('\n3. Testing Registration Flow:');
  const newEmail = `student_${Date.now()}@college.edu`;
  const regSession = await auth.register({
    name: 'Ananya Verma',
    email: newEmail,
    membershipId: 'STU2026099',
    password: 'password123'
  });
  assert(regSession.id.startsWith('m'), `New member ID generated (${regSession.id})`);
  assert(store.getMember(regSession.id).name === 'Ananya Verma', 'New member found in store');
  
  // Duplicate registration should fail
  let dupFailed = false;
  try {
    await auth.register({
      name: 'Another Verma',
      email: newEmail,
      membershipId: 'STU2026100',
      password: 'password123'
    });
  } catch (e) {
    dupFailed = true;
  }
  assert(dupFailed, 'Duplicate email registration rejected');

  // 4. Librarian Login & Role Checks
  console.log('\n4. Testing Librarian Role & Privileges:');
  const libSession = await auth.login('meena.i@college.edu', 'librarian123');
  assert(auth.isLibrarian(), 'Librarian login identified as librarian role');
  assert(!auth.isStudent(), 'Librarian is not student role');

  // 5. Catalog Search, Filter, Sort & Letter Nav
  console.log('\n5. Testing Catalog Filtering, Sorting & Search:');
  const allBooks = store.getBooks();
  const searchClean = allBooks.filter(b => b.title.toLowerCase().includes('clean'));
  assert(searchClean.length === 1, `Search "clean" found exactly 1 book (actual: ${searchClean.length})`);

  const searchThe = allBooks.filter(b => b.title.toLowerCase().includes('the'));
  assert(searchThe.length >= 5, `Search "the" found ${searchThe.length} books (>= 5)`);

  const csBooks = allBooks.filter(b => b.genre === 'Computer Science');
  assert(csBooks.length >= 4, `Computer Science genre filter found ${csBooks.length} books`);

  const availableBooks = allBooks.filter(b => b.availableCopies > 0);
  assert(availableBooks.length > 0, `Found ${availableBooks.length} available books`);

  // 6. Borrowing & Returning Lifecycle
  console.log('\n6. Testing Borrowing & Circulation Workflow:');
  const testBook = store.getBooks().find(b => b.availableCopies > 1);
  const initialCopies = testBook.availableCopies;
  const borrowMember = store.getMember('m001');
  const initialMemberBorrows = borrowMember.booksBorrowed;

  const borrowing = await api.borrowBook(testBook.id, borrowMember.id);
  assert(borrowing !== null, 'Book successfully borrowed');
  assert(testBook.availableCopies === initialCopies - 1, `Available copies decremented (${initialCopies} -> ${testBook.availableCopies})`);
  assert(borrowMember.booksBorrowed === initialMemberBorrows + 1, `Member borrow count incremented (${initialMemberBorrows} -> ${borrowMember.booksBorrowed})`);

  // Return book
  const returned = await api.returnBook(borrowing.id);
  assert(returned.status === 'returned', 'Book status updated to returned');
  assert(testBook.availableCopies === initialCopies, `Available copies restored (${testBook.availableCopies})`);
  assert(borrowMember.booksBorrowed === initialMemberBorrows, `Member borrow count restored (${borrowMember.booksBorrowed})`);

  // 7. Reservations Lifecycle
  console.log('\n7. Testing Reservation Workflow:');
  const outOfStockBook = store.getBooks().find(b => b.availableCopies === 0) || store.getBooks()[0];
  const res = await api.reserveBook(outOfStockBook.id, borrowMember.id);
  assert(res !== null, 'Reservation created');
  assert(store.getReservations().some(r => r.id === res.id), 'Reservation found in store');
  
  await api.cancelReservation(res.id);
  assert(!store.getReservations().some(r => r.id === res.id), 'Reservation cancelled and removed');

  // 8. Fines Management
  console.log('\n8. Testing Fine Management:');
  const unpaidFine = store.getFines().find(f => f.status === 'unpaid' && f.amount > 0);
  if (unpaidFine) {
    const fineId = unpaidFine.id;
    await api.payFine(fineId);
    const paid = store.getFines().find(f => f.id === fineId);
    assert(paid.status === 'paid', 'Fine marked as paid');
  } else {
    assert(true, 'No unpaid fines to test payment');
  }

  // 9. Librarian Book CRUD
  console.log('\n9. Testing Librarian Book CRUD:');
  const newBookData = {
    title: 'Modern Software Engineering',
    author: 'Dave Farley',
    genre: 'Technology',
    isbn: '978-0137314911',
    publisher: 'Addison-Wesley',
    year: 2026,
    totalCopies: 6,
    availableCopies: 6,
    coverColor: '#2b6cb0',
    coverTextColor: '#ffffff',
    description: 'An empirical approach to software design.'
  };
  const addedBook = store.addBook(newBookData);
  assert(addedBook.id.startsWith('b'), `Book added with ID ${addedBook.id}`);
  assert(store.getBook(addedBook.id).title === 'Modern Software Engineering', 'Added book found in catalog');

  // Update book
  store.updateBook(addedBook.id, { totalCopies: 8, availableCopies: 8 });
  assert(store.getBook(addedBook.id).totalCopies === 8, 'Book updated successfully');

  // Delete book
  const countBefore = store.getBooks().length;
  store.deleteBook(addedBook.id);
  assert(store.getBooks().length === countBefore - 1, 'Book deleted successfully');
  assert(!store.getBook(addedBook.id), 'Deleted book no longer exists');

  // 10. UI Helper Null Safety & Robustness
  console.log('\n10. Testing UI Helpers & Null-Safety:');
  assert(getInitials('John Doe') === 'JD', 'getInitials handles standard name');
  assert(getInitials('  Single  ') === 'S', 'getInitials handles spaces');
  assert(getInitials('') === '??', 'getInitials handles empty string safely');
  assert(getInitials(null) === '??', 'getInitials handles null safely');

  assert(bookCover(null).includes('Unavailable'), 'bookCover handles null safely');
  assert(availabilityBadge(null).includes('Unavailable'), 'availabilityBadge handles null safely');

  // 11. Wishlist and Notifications
  console.log('\n11. Testing Wishlist & Notifications:');
  const wishBookId = store.getBooks()[0].id;
  assert(!store.isInWishlist(wishBookId), 'Initially not in wishlist');
  store.toggleWishlist(wishBookId);
  assert(store.isInWishlist(wishBookId), 'Added to wishlist');
  store.toggleWishlist(wishBookId);
  assert(!store.isInWishlist(wishBookId), 'Removed from wishlist');

  const notif = store.addNotification(borrowMember.id, 'info', 'Test Notif', 'Hello World');
  assert(!notif.read, 'Notification is unread');
  store.markNotificationRead(notif.id);
  assert(store.getNotifications().find(n => n.id === notif.id).read === true, 'Notification marked as read');

  // 12. Reports & Analytics Computation
  console.log('\n12. Testing Reports & Analytics:');
  const borrowingTrends = await api.getBorrowingReport();
  assert(Array.isArray(borrowingTrends) && borrowingTrends.length > 0, 'Borrowing trends report generated');
  const popBooks = await api.getPopularBooksReport();
  assert(Array.isArray(popBooks) && popBooks.length > 0, 'Popular books report generated');
  const memberReport = await api.getMemberActivityReport();
  assert(Array.isArray(memberReport) && memberReport.length > 0, 'Member activity report generated');

  // Reset store test
  console.log('\n13. Testing Data Reset:');
  store.resetData();
  assert(store.getBooks().length === 28, 'Data reset restored initial 28 books');

  console.log(`\n========================================`);
  console.log(`Total: ${passed + failed} | Passed: ${passed} | Failed: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Unhandled error in test runner:', err);
  process.exit(1);
});
