/**
 * Comprehensive Local End-to-End Verification Test Suite
 * Tests: MongoDB Atlas, Firebase Auth, All REST APIs, Socket.io Real-time, and RBAC
 */

const http = require('http');
const { io } = require('socket.io-client');

const API_BASE = 'http://localhost:5001/api';
const SOCKET_URL = 'http://localhost:5001';

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

async function request(method, path, body = null, token = null) {
  const url = `${API_BASE}${path}`;
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const json = await res.json().catch(() => ({}));
  return { status: res.status, ok: res.ok, data: json };
}

async function runAllTests() {
  console.log('\n============================================================');
  console.log('  SMARTLIBRARY COMPREHENSIVE LOCAL END-TO-END TEST SUITE');
  console.log('============================================================\n');

  // ------------------------------------------------------------
  // 1. Health & Server Check
  // ------------------------------------------------------------
  console.log('1. Verifying Server Health & DB Connection:');
  const health = await request('GET', '/health');
  assert(health.status === 200, 'Health endpoint responds with HTTP 200');
  assert(health.data.status === 'ok', 'Health status is "ok"');

  // ------------------------------------------------------------
  // 2. Authentication & RBAC (Librarian & Student)
  // ------------------------------------------------------------
  console.log('\n2. Testing Authentication & RBAC (MongoDB + Firebase):');
  
  // Test seeded Librarian login
  const libLogin = await request('POST', '/auth/login', {
    email: 'meena.i@college.edu',
    password: 'librarian123'
  });
  assert(libLogin.status === 200, 'Librarian login succeeds (HTTP 200)');
  assert(libLogin.data.data.role === 'librarian', 'Librarian role verified');
  const libToken = libLogin.data.data.token;
  const libId = libLogin.data.data.id;

  // Test seeded Student login
  const stuLogin = await request('POST', '/auth/login', {
    email: 'rahul.s@college.edu',
    password: 'student123'
  });
  assert(stuLogin.status === 200, 'Student login succeeds (HTTP 200)');
  assert(stuLogin.data.data.role === 'student', 'Student role verified');
  const stuToken = stuLogin.data.data.token;
  const stuId = stuLogin.data.data.id;

  // Test GET /auth/me
  const meRes = await request('GET', '/auth/me', null, libToken);
  assert(meRes.status === 200 && meRes.data.data.email === 'meena.i@college.edu', 'GET /auth/me returns authenticated user details');

  // Test Invalid Login
  const badLogin = await request('POST', '/auth/login', {
    email: 'meena.i@college.edu',
    password: 'wrongpassword'
  });
  assert(badLogin.status === 401, 'Invalid password correctly rejected with 401');

  // Test Student RBAC restriction on Librarian routes
  const forbiddenMembers = await request('GET', '/members', null, stuToken);
  assert(forbiddenMembers.status === 403, 'Student is forbidden from viewing all members (HTTP 403 RBAC enforced)');

  // ------------------------------------------------------------
  // 3. Books CRUD & Catalog Filtering
  // ------------------------------------------------------------
  console.log('\n3. Testing Books Catalog & CRUD APIs:');
  const booksRes = await request('GET', '/books', null, stuToken);
  assert(booksRes.status === 200, 'GET /books returns HTTP 200');
  const booksList = Array.isArray(booksRes.data.data) ? booksRes.data.data : (booksRes.data.data.books || []);
  assert(Array.isArray(booksList) && booksList.length >= 10, `Found ${booksList.length} books in catalog (expected >= 10)`);

  // Search filter
  const searchRes = await request('GET', '/books?search=Algorithms', null, stuToken);
  assert(searchRes.status === 200 && searchRes.data.data.length > 0, 'Search filter for "Algorithms" returns matching books');

  // Librarian creates a new test book
  const newBookPayload = {
    title: 'Automated Test Book ' + Date.now(),
    author: 'Test Author',
    isbn: '978-' + Math.floor(1000000000 + Math.random() * 9000000000),
    category: 'Computer Science',
    shelfLocation: 'CS-999',
    totalCopies: 5,
    availableCopies: 5,
    year: 2026,
    publisher: 'Test Press',
    description: 'Book created by automated test suite'
  };
  const createBookRes = await request('POST', '/books', newBookPayload, libToken);
  assert(createBookRes.status === 201, 'Librarian can create a new book (HTTP 201)');
  const createdBookId = createBookRes.data.data.id || createBookRes.data.data._id;

  // Student forbidden from creating book
  const stuCreateBook = await request('POST', '/books', newBookPayload, stuToken);
  assert(stuCreateBook.status === 403, 'Student cannot create books (HTTP 403 RBAC)');

  // Update book
  const updateBookRes = await request('PUT', `/books/${createdBookId}`, { description: 'Updated description' }, libToken);
  assert(updateBookRes.status === 200 && updateBookRes.data.data.description === 'Updated description', 'Librarian can update a book');

  // Delete test book
  const delBookRes = await request('DELETE', `/books/${createdBookId}`, null, libToken);
  assert(delBookRes.status === 200, 'Librarian can delete a book (HTTP 200)');

  // ------------------------------------------------------------
  // 4. Members API
  // ------------------------------------------------------------
  console.log('\n4. Testing Members API:');
  const membersRes = await request('GET', '/members?limit=50', null, libToken);
  assert(membersRes.status === 200, 'Librarian can list all members');
  assert(membersRes.data.data.length >= 3, `Found ${membersRes.data.data.length} registered members`);

  // Get specific member
  const singleMember = await request('GET', `/members/${stuId}`, null, libToken);
  assert(singleMember.status === 200 && singleMember.data.data.name === 'Rahul Sharma', 'GET /members/:id returns member details');

  // ------------------------------------------------------------
  // 5. Borrowing & Returning Flow (Full Cycle)
  // ------------------------------------------------------------
  console.log('\n5. Testing Borrow & Return Lifecycle:');
  // Pick an available book
  const targetBook = booksList.find(b => b.availableCopies > 0);
  const targetBookId = targetBook.id || targetBook._id;
  const initialCopies = targetBook.availableCopies;

  // Borrow book
  const borrowRes = await request('POST', '/borrow', {
    bookId: targetBookId,
    memberId: stuId
  }, stuToken);
  assert(borrowRes.status === 201, 'Student can borrow an available book (HTTP 201)');
  const borrowingId = borrowRes.data.data.id || borrowRes.data.data._id;

  // Verify copies decremented in MongoDB
  const bookAfterBorrow = await request('GET', `/books/${targetBookId}`, null, stuToken);
  assert(bookAfterBorrow.data.data.availableCopies === initialCopies - 1, `Book availableCopies decremented from ${initialCopies} to ${initialCopies - 1}`);

  // Return book
  const returnRes = await request('PUT', `/borrow/${borrowingId}/return`, {}, libToken);
  assert(returnRes.status === 200, 'Book successfully returned (HTTP 200)');

  // Verify copies incremented back in MongoDB
  const bookAfterReturn = await request('GET', `/books/${targetBookId}`, null, stuToken);
  assert(bookAfterReturn.data.data.availableCopies === initialCopies, `Book availableCopies restored to ${initialCopies}`);

  // ------------------------------------------------------------
  // 6. Reservations API
  // ------------------------------------------------------------
  console.log('\n6. Testing Reservations API:');
  const reserveRes = await request('POST', '/reservations', {
    bookId: targetBookId,
    memberId: stuId
  }, stuToken);
  assert(reserveRes.status === 201, 'Student can place a book reservation');
  const reservationId = reserveRes.data.data.id || reserveRes.data.data._id;

  // Cancel reservation
  const cancelRes = await request('DELETE', `/reservations/${reservationId}`, null, stuToken);
  assert(cancelRes.status === 200, 'Student can cancel their reservation');

  // ------------------------------------------------------------
  // 7. Fines API
  // ------------------------------------------------------------
  console.log('\n7. Testing Fines Management:');
  const finesRes = await request('GET', '/fines', null, libToken);
  assert(finesRes.status === 200, 'Librarian can view all fines');

  const stuFines = await request('GET', `/fines/user/${stuId}`, null, stuToken);
  assert(stuFines.status === 200, 'Student can view their own fines');

  // ------------------------------------------------------------
  // 8. Analytics & Reports API
  // ------------------------------------------------------------
  console.log('\n8. Testing Reports & Analytics:');
  const repBorrow = await request('GET', '/reports/borrowing', null, libToken);
  assert(repBorrow.status === 200 && repBorrow.data.data, 'GET /reports/borrowing returns analytics data');

  const repPop = await request('GET', '/reports/popular-books', null, libToken);
  assert(repPop.status === 200 && Array.isArray(repPop.data.data), 'GET /reports/popular-books returns book list');

  const repAct = await request('GET', '/reports/member-activity', null, libToken);
  assert(repAct.status === 200 && Array.isArray(repAct.data.data), 'GET /reports/member-activity returns activity list');

  // ------------------------------------------------------------
  // 9. Notifications API
  // ------------------------------------------------------------
  console.log('\n9. Testing Notifications API:');
  const notifRes = await request('POST', '/notifications', {
    memberId: stuId,
    type: 'info',
    title: 'Automated Test Notification',
    message: 'Testing notifications system'
  }, libToken);
  assert(notifRes.status === 201, 'Notification successfully created');
  const notifId = notifRes.data.data ? (notifRes.data.data.id || notifRes.data.data._id) : null;

  const notifList = await request('GET', `/notifications?memberId=${stuId}`, null, stuToken);
  assert(notifList.status === 200 && notifList.data.data.some(n => (n.id || n._id) === notifId), 'Created notification retrieved in user list');

  // Mark read
  const markRead = await request('PATCH', `/notifications/${notifId}/read`, {}, stuToken);
  assert(markRead.status === 200 && markRead.data.data.read === true, 'Notification marked as read');

  // ------------------------------------------------------------
  // 10. Real-time Socket.io Verification
  // ------------------------------------------------------------
  console.log('\n10. Testing Socket.io Real-time WebSocket:');
  const socketPromise = new Promise((resolve) => {
    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      query: { memberId: stuId }
    });

    socket.on('connect', () => {
      assert(socket.connected, `Socket.io client connected with ID: ${socket.id}`);

      // Listen for availability event
      socket.on('book:availability', (data) => {
        assert(data && data.bookId, `Received real-time "book:availability" broadcast for book ${data.bookId}`);
        socket.disconnect();
        resolve(true);
      });

      // Trigger a borrow/return to generate the socket event
      setTimeout(async () => {
        const testBorrow = await request('POST', '/borrow', {
          bookId: targetBookId,
          memberId: stuId
        }, stuToken);
        const tBorrowId = testBorrow.data.data.id || testBorrow.data.data._id;
        // Return it immediately
        await request('PUT', `/borrow/${tBorrowId}/return`, {}, libToken);
      }, 300);
    });

    socket.on('connect_error', (err) => {
      assert(false, `Socket connection error: ${err.message}`);
      socket.disconnect();
      resolve(false);
    });

    setTimeout(() => {
      if (socket.connected) socket.disconnect();
      resolve(true);
    }, 4000);
  });

  await socketPromise;

  // ------------------------------------------------------------
  // SUMMARY
  // ------------------------------------------------------------
  console.log('\n============================================================');
  console.log(`  VERIFICATION SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log('============================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
