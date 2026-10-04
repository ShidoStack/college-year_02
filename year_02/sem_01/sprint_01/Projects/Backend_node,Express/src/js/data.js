/**
 * SmartLibrary - Mock Data Layer
 * Contains all seed data for the application.
 * In production, this will be replaced by fetch() calls to the Express API.
 */

export const GENRES = [
  'Fiction', 'Science', 'Technology', 'History', 'Biography',
  'Literature', 'Business', 'Psychology', 'Computer Science'
];

export const mockBooks = [
  {
    id: 'b001', title: 'The Alchemist', author: 'Paulo Coelho', genre: 'Fiction',
    isbn: '9780061120084', publisher: 'HarperOne', year: 1988,
    totalCopies: 5, availableCopies: 3, description: 'A shepherd boy journeys to find a worldly treasure.',
    coverColor: '#3a6b5d', coverTextColor: '#fff', addedDate: '2024-01-15'
  },
  {
    id: 'b002', title: 'Atomic Habits', author: 'James Clear', genre: 'Psychology',
    isbn: '9780735211292', publisher: 'Avery', year: 2018,
    totalCopies: 4, availableCopies: 1, description: 'Build good habits and break bad ones.',
    coverColor: '#2d3748', coverTextColor: '#fff', addedDate: '2024-01-20'
  },
  {
    id: 'b003', title: 'Clean Code', author: 'Robert C. Martin', genre: 'Computer Science',
    isbn: '9780132350884', publisher: 'Prentice Hall', year: 2008,
    totalCopies: 6, availableCopies: 2, description: 'A handbook of agile software craftsmanship.',
    coverColor: '#1a365d', coverTextColor: '#fff', addedDate: '2024-01-10'
  },
  {
    id: 'b004', title: 'The Midnight Library', author: 'Matt Haig', genre: 'Fiction',
    isbn: '9780525559474', publisher: 'Viking', year: 2020,
    totalCopies: 3, availableCopies: 0, description: 'Between life and death there is a library.',
    coverColor: '#2c5282', coverTextColor: '#fff', addedDate: '2024-02-01'
  },
  {
    id: 'b005', title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History',
    isbn: '9780062316097', publisher: 'Harper', year: 2011,
    totalCopies: 5, availableCopies: 2, description: 'A brief history of humankind.',
    coverColor: '#744210', coverTextColor: '#fff', addedDate: '2024-01-05'
  },
  {
    id: 'b006', title: '1984', author: 'George Orwell', genre: 'Literature',
    isbn: '9780451524935', publisher: 'Signet Classics', year: 1949,
    totalCopies: 4, availableCopies: 1, description: 'A dystopian social science fiction novel.',
    coverColor: '#1a1a2e', coverTextColor: '#fff', addedDate: '2024-01-08'
  },
  {
    id: 'b007', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Literature',
    isbn: '9780743273565', publisher: 'Scribner', year: 1925,
    totalCopies: 3, availableCopies: 2, description: 'A portrait of the Jazz Age in all of its decadence.',
    coverColor: '#2d4a3e', coverTextColor: '#fff', addedDate: '2024-01-12'
  },
  {
    id: 'b008', title: 'The Pragmatic Programmer', author: 'Andrew Hunt', genre: 'Computer Science',
    isbn: '9780201616224', publisher: 'Addison-Wesley', year: 1999,
    totalCopies: 5, availableCopies: 3, description: 'Your journey to mastery.',
    coverColor: '#553c1e', coverTextColor: '#fff', addedDate: '2024-01-18'
  },
  {
    id: 'b009', title: 'Deep Work', author: 'Cal Newport', genre: 'Business',
    isbn: '9781455586691', publisher: 'Grand Central', year: 2016,
    totalCopies: 4, availableCopies: 0, description: 'Rules for focused success in a distracted world.',
    coverColor: '#2d3748', coverTextColor: '#fff', addedDate: '2024-02-05'
  },
  {
    id: 'b010', title: 'Ikigai', author: 'Hector Garcia', genre: 'Psychology',
    isbn: '9780143137018', publisher: 'Penguin', year: 2016,
    totalCopies: 3, availableCopies: 1, description: 'The Japanese secret to a long and happy life.',
    coverColor: '#c05621', coverTextColor: '#fff', addedDate: '2024-01-22'
  },
  {
    id: 'b011', title: 'To Kill a Mockingbird', author: 'Harper Lee', genre: 'Literature',
    isbn: '9780061120084', publisher: 'Harper Perennial', year: 1960,
    totalCopies: 4, availableCopies: 2, description: 'A powerful tale of racial injustice.',
    coverColor: '#3a6b5d', coverTextColor: '#fff', addedDate: '2024-01-14'
  },
  {
    id: 'b012', title: 'A Brief History of Time', author: 'Stephen Hawking', genre: 'Science',
    isbn: '9780553380163', publisher: 'Bantam', year: 1988,
    totalCopies: 3, availableCopies: 1, description: 'From the Big Bang to Black Holes.',
    coverColor: '#1a365d', coverTextColor: '#fff', addedDate: '2024-01-25'
  },
  {
    id: 'b013', title: 'Design Patterns', author: 'Erich Gamma', genre: 'Computer Science',
    isbn: '9780201633610', publisher: 'Addison-Wesley', year: 1994,
    totalCopies: 4, availableCopies: 3, description: 'Elements of reusable object-oriented software.',
    coverColor: '#553c1e', coverTextColor: '#fff', addedDate: '2024-01-28'
  },
  {
    id: 'b014', title: 'The Catcher in the Rye', author: 'J.D. Salinger', genre: 'Literature',
    isbn: '9780316769488', publisher: 'Little, Brown', year: 1951,
    totalCopies: 3, availableCopies: 2, description: 'A story of teenage rebellion and alienation.',
    coverColor: '#744210', coverTextColor: '#fff', addedDate: '2024-02-03'
  },
  {
    id: 'b015', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Psychology',
    isbn: '9780374533557', publisher: 'Farrar, Straus and Giroux', year: 2011,
    totalCopies: 4, availableCopies: 1, description: 'The two systems that drive the way we think.',
    coverColor: '#2d3748', coverTextColor: '#fff', addedDate: '2024-01-30'
  },
  {
    id: 'b016', title: 'The Lean Startup', author: 'Eric Ries', genre: 'Business',
    isbn: '9780307887894', publisher: 'Crown Business', year: 2011,
    totalCopies: 5, availableCopies: 3, description: 'How constant innovation creates radically successful businesses.',
    coverColor: '#2c5282', coverTextColor: '#fff', addedDate: '2024-02-08'
  },
  {
    id: 'b017', title: 'Steve Jobs', author: 'Walter Isaacson', genre: 'Biography',
    isbn: '9781451648539', publisher: 'Simon & Schuster', year: 2011,
    totalCopies: 3, availableCopies: 1, description: 'The exclusive biography of Steve Jobs.',
    coverColor: '#1a1a2e', coverTextColor: '#fff', addedDate: '2024-02-10'
  },
  {
    id: 'b018', title: 'The Selfish Gene', author: 'Richard Dawkins', genre: 'Science',
    isbn: '9780198788607', publisher: 'Oxford University Press', year: 1976,
    totalCopies: 3, availableCopies: 2, description: 'A revolutionary view of evolution.',
    coverColor: '#1a365d', coverTextColor: '#fff', addedDate: '2024-02-12'
  },
  {
    id: 'b019', title: 'Refactoring', author: 'Martin Fowler', genre: 'Computer Science',
    isbn: '9780134757599', publisher: 'Addison-Wesley', year: 1999,
    totalCopies: 4, availableCopies: 2, description: 'Improving the design of existing code.',
    coverColor: '#553c1e', coverTextColor: '#fff', addedDate: '2024-02-15'
  },
  {
    id: 'b020', title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Literature',
    isbn: '9780141439518', publisher: 'Penguin Classics', year: 1813,
    totalCopies: 3, availableCopies: 3, description: 'A romantic novel of manners.',
    coverColor: '#3a6b5d', coverTextColor: '#fff', addedDate: '2024-02-18'
  },
  {
    id: 'b021', title: 'The Art of Computer Programming', author: 'Donald Knuth', genre: 'Computer Science',
    isbn: '9780321751041', publisher: 'Addison-Wesley', year: 1968,
    totalCopies: 2, availableCopies: 1, description: 'The seminal work on algorithms.',
    coverColor: '#1a365d', coverTextColor: '#fff', addedDate: '2024-02-20'
  },
  {
    id: 'b022', title: 'Educated', author: 'Tara Westover', genre: 'Biography',
    isbn: '9780393634433', publisher: 'Random House', year: 2018,
    totalCopies: 4, availableCopies: 0, description: 'A memoir about the transformative power of education.',
    coverColor: '#744210', coverTextColor: '#fff', addedDate: '2024-02-22'
  },
  {
    id: 'b023', title: 'The Cosmos', author: 'Carl Sagan', genre: 'Science',
    isbn: '9780345539434', publisher: 'Ballantine Books', year: 1980,
    totalCopies: 3, availableCopies: 2, description: 'The story of cosmic evolution.',
    coverColor: '#1a1a2e', coverTextColor: '#fff', addedDate: '2024-02-25'
  },
  {
    id: 'b024', title: 'Good to Great', author: 'Jim Collins', genre: 'Business',
    isbn: '9780066620992', publisher: 'HarperBusiness', year: 2001,
    totalCopies: 4, availableCopies: 2, description: 'Why some companies make the leap and others do not.',
    coverColor: '#2d3748', coverTextColor: '#fff', addedDate: '2024-02-28'
  },
  {
    id: 'b025', title: 'Man Search for Meaning', author: 'Viktor Frankl', genre: 'Psychology',
    isbn: '9780807014271', publisher: 'Beacon Press', year: 1946,
    totalCopies: 3, availableCopies: 1, description: 'An introduction to logotherapy.',
    coverColor: '#c05621', coverTextColor: '#fff', addedDate: '2024-03-01'
  },
  {
    id: 'b026', title: 'The Wright Brothers', author: 'David McCullough', genre: 'Biography',
    isbn: '9781476728759', publisher: 'Simon & Schuster', year: 2015,
    totalCopies: 3, availableCopies: 2, description: 'The story of two brothers who changed the world.',
    coverColor: '#553c1e', coverTextColor: '#fff', addedDate: '2024-03-05'
  },
  {
    id: 'b027', title: 'Guns, Germs, and Steel', author: 'Jared Diamond', genre: 'History',
    isbn: '9780393317558', publisher: 'W.W. Norton', year: 1997,
    totalCopies: 3, availableCopies: 1, description: 'The fates of human societies.',
    coverColor: '#744210', coverTextColor: '#fff', addedDate: '2024-03-08'
  },
  {
    id: 'b028', title: 'Introduction to Algorithms', author: 'Thomas Cormen', genre: 'Computer Science',
    isbn: '9780262033848', publisher: 'MIT Press', year: 2009,
    totalCopies: 4, availableCopies: 2, description: 'A comprehensive textbook on algorithms.',
    coverColor: '#1a365d', coverTextColor: '#fff', addedDate: '2024-03-10'
  }
];

export const mockMembers = [
  { id: 'm001', name: 'Rahul Sharma', email: 'rahul.s@college.edu', membershipId: 'STU2024001', role: 'student', status: 'active', joinedDate: '2024-01-10', booksBorrowed: 2, outstandingFine: 0 },
  { id: 'm002', name: 'Priya Patel', email: 'priya.p@college.edu', membershipId: 'STU2024002', role: 'student', status: 'active', joinedDate: '2024-01-15', booksBorrowed: 1, outstandingFine: 25 },
  { id: 'm003', name: 'Amit Kumar', email: 'amit.k@college.edu', membershipId: 'STU2024003', role: 'student', status: 'active', joinedDate: '2024-01-20', booksBorrowed: 0, outstandingFine: 0 },
  { id: 'm004', name: 'Sneha Reddy', email: 'sneha.r@college.edu', membershipId: 'STU2024004', role: 'student', status: 'active', joinedDate: '2024-02-01', booksBorrowed: 3, outstandingFine: 0 },
  { id: 'm005', name: 'Vikram Singh', email: 'vikram.s@college.edu', membershipId: 'STU2024005', role: 'student', status: 'suspended', joinedDate: '2024-01-05', booksBorrowed: 1, outstandingFine: 50 },
  { id: 'm006', name: 'Anjali Gupta', email: 'anjali.g@college.edu', membershipId: 'STU2024006', role: 'student', status: 'active', joinedDate: '2024-02-10', booksBorrowed: 0, outstandingFine: 0 },
  { id: 'm007', name: 'Dr. Meena Iyer', email: 'meena.i@college.edu', membershipId: 'LIB2024001', role: 'librarian', status: 'active', joinedDate: '2024-01-01', booksBorrowed: 0, outstandingFine: 0 },
  { id: 'm008', name: 'Rohan Verma', email: 'rohan.v@college.edu', membershipId: 'STU2024007', role: 'student', status: 'active', joinedDate: '2024-02-15', booksBorrowed: 2, outstandingFine: 0 },
  { id: 'm009', name: 'Kavya Nair', email: 'kavya.n@college.edu', membershipId: 'STU2024008', role: 'student', status: 'active', joinedDate: '2024-02-20', booksBorrowed: 1, outstandingFine: 15 },
  { id: 'm010', name: 'Arjun Mehta', email: 'arjun.m@college.edu', membershipId: 'STU2024009', role: 'student', status: 'active', joinedDate: '2024-03-01', booksBorrowed: 0, outstandingFine: 0 }
];

export const mockBorrowings = [
  { id: 'br001', bookId: 'b004', memberId: 'm001', issueDate: '2024-09-15', dueDate: '2024-09-29', returnDate: null, status: 'borrowed', fine: 0 },
  { id: 'br002', bookId: 'b002', memberId: 'm002', issueDate: '2024-09-10', dueDate: '2024-09-24', returnDate: null, status: 'overdue', fine: 25 },
  { id: 'br003', bookId: 'b009', memberId: 'm004', issueDate: '2024-09-20', dueDate: '2024-10-04', returnDate: null, status: 'borrowed', fine: 0 },
  { id: 'br004', bookId: 'b022', memberId: 'm005', issueDate: '2024-08-25', dueDate: '2024-09-08', returnDate: null, status: 'overdue', fine: 50 },
  { id: 'br005', bookId: 'b006', memberId: 'm008', issueDate: '2024-09-18', dueDate: '2024-10-02', returnDate: null, status: 'borrowed', fine: 0 },
  { id: 'br006', bookId: 'b015', memberId: 'm009', issueDate: '2024-09-12', dueDate: '2024-09-26', returnDate: null, status: 'overdue', fine: 15 },
  { id: 'br007', bookId: 'b003', memberId: 'm004', issueDate: '2024-08-01', dueDate: '2024-08-15', returnDate: '2024-08-14', status: 'returned', fine: 0 },
  { id: 'br008', bookId: 'b010', memberId: 'm004', issueDate: '2024-08-20', dueDate: '2024-09-03', returnDate: '2024-09-03', status: 'returned', fine: 0 },
  { id: 'br009', bookId: 'b008', memberId: 'm001', issueDate: '2024-07-15', dueDate: '2024-07-29', returnDate: '2024-07-28', status: 'returned', fine: 0 },
  { id: 'br010', bookId: 'b025', memberId: 'm005', issueDate: '2024-09-05', dueDate: '2024-09-19', returnDate: null, status: 'borrowed', fine: 0 },
  { id: 'br011', bookId: 'b001', memberId: 'm008', issueDate: '2024-09-22', dueDate: '2024-10-06', returnDate: null, status: 'borrowed', fine: 0 },
  { id: 'br012', bookId: 'b005', memberId: 'm009', issueDate: '2024-09-01', dueDate: '2024-09-15', returnDate: '2024-09-14', status: 'returned', fine: 0 }
];

export const mockReservations = [
  { id: 'r001', bookId: 'b004', memberId: 'm003', reservedOn: '2024-09-20', status: 'waiting', available: false },
  { id: 'r002', bookId: 'b009', memberId: 'm006', reservedOn: '2024-09-22', status: 'waiting', available: false },
  { id: 'r003', bookId: 'b022', memberId: 'm010', reservedOn: '2024-09-25', status: 'waiting', available: false },
  { id: 'r004', bookId: 'b002', memberId: 'm003', reservedOn: '2024-09-18', status: 'ready', available: true },
  { id: 'r005', bookId: 'b006', memberId: 'm006', reservedOn: '2024-09-28', status: 'waiting', available: false }
];

export const mockFines = [
  { id: 'f001', memberId: 'm002', bookId: 'b002', dueDate: '2024-09-24', daysOverdue: 8, amount: 25, status: 'unpaid' },
  { id: 'f002', memberId: 'm005', bookId: 'b022', dueDate: '2024-09-08', daysOverdue: 24, amount: 50, status: 'unpaid' },
  { id: 'f003', memberId: 'm005', bookId: 'b006', dueDate: '2024-09-19', daysOverdue: 13, amount: 0, status: 'unpaid', note: 'Not yet overdue' },
  { id: 'f004', memberId: 'm009', bookId: 'b015', dueDate: '2024-09-26', daysOverdue: 6, amount: 15, status: 'unpaid' },
  { id: 'f005', memberId: 'm004', bookId: 'b003', dueDate: '2024-08-15', daysOverdue: 0, amount: 0, status: 'paid', paidOn: '2024-08-14' }
];

export const mockNotifications = [
  { id: 'n001', memberId: 'm001', type: 'due_soon', title: 'Book due tomorrow', message: 'The Midnight Library is due tomorrow (Oct 2).', read: false, date: '2024-10-01' },
  { id: 'n002', memberId: 'm002', type: 'overdue', title: 'Book overdue', message: 'Atomic Habits is 8 days overdue. Fine: $25.', read: false, date: '2024-10-01' },
  { id: 'n003', memberId: 'm003', type: 'reservation_ready', title: 'Reserved book available', message: 'Atomic Habits is now available for pickup.', read: false, date: '2024-09-28' },
  { id: 'n004', memberId: 'm001', type: 'success', title: 'Book returned', message: 'The Pragmatic Programmer has been returned successfully.', read: true, date: '2024-07-28' },
  { id: 'n005', memberId: 'm004', type: 'success', title: 'Book borrowed', message: 'Deep Work has been borrowed. Due: Oct 4.', read: true, date: '2024-09-20' },
  { id: 'n006', memberId: 'm005', type: 'overdue', title: 'Book overdue', message: 'Educated is 24 days overdue. Fine: $50.', read: false, date: '2024-10-01' },
  { id: 'n007', memberId: 'm008', type: 'due_soon', title: 'Book due soon', message: '1984 is due on Oct 2.', read: false, date: '2024-10-01' },
  { id: 'n008', memberId: 'm009', type: 'overdue', title: 'Book overdue', message: 'Thinking, Fast and Slow is 6 days overdue. Fine: $15.', read: false, date: '2024-10-01' },
  { id: 'n009', memberId: 'm001', type: 'general', title: 'Library hours update', message: 'Library will be open 8am-10pm during exams.', read: true, date: '2024-09-25' },
  { id: 'n010', memberId: 'm004', type: 'success', title: 'Book returned', message: 'Clean Code has been returned successfully.', read: true, date: '2024-08-14' }
];

export const demoUsers = [
  { email: 'rahul.s@college.edu', password: 'student123', name: 'Rahul Sharma', role: 'student', memberId: 'm001' },
  { email: 'meena.i@college.edu', password: 'librarian123', name: 'Dr. Meena Iyer', role: 'librarian', memberId: 'm007' }
];
