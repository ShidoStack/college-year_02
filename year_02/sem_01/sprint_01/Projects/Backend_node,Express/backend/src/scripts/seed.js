/**
 * SmartLibrary - Database Seed Script
 * Run: npm run seed
 * 
 * Seeds sample books, a librarian account, and student accounts.
 */

require('../config/env');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { MONGODB_URI } = require('../config/env');

const User = require('../models/User');
const Book = require('../models/Book');
const BorrowRecord = require('../models/BorrowRecord');
const Reservation = require('../models/Reservation');
const Fine = require('../models/Fine');
const Notification = require('../models/Notification');

const books = [
  {
    title: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    isbn: '978-0262033848',
    genre: 'Computer Science',
    publisher: 'MIT Press',
    year: 2022,
    totalCopies: 5,
    availableCopies: 3,
    coverColor: '#1a365d',
    coverTextColor: '#ffffff',
    description: 'A comprehensive introduction to the modern study of computer algorithms.'
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    isbn: '978-0132350884',
    genre: 'Software Engineering',
    publisher: 'Prentice Hall',
    year: 2008,
    totalCopies: 4,
    availableCopies: 2,
    coverColor: '#2d6a4f',
    coverTextColor: '#ffffff',
    description: 'A handbook of agile software craftsmanship for writing cleaner, maintainable code.'
  },
  {
    title: 'Design Patterns',
    author: 'Gang of Four',
    isbn: '978-0201633610',
    genre: 'Software Engineering',
    publisher: 'Addison-Wesley',
    year: 1994,
    totalCopies: 3,
    availableCopies: 3,
    coverColor: '#6b2d6b',
    coverTextColor: '#ffffff',
    description: 'Elements of reusable object-oriented software - the classic patterns reference.'
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'David Thomas & Andrew Hunt',
    isbn: '978-0135957059',
    genre: 'Software Engineering',
    publisher: 'Addison-Wesley',
    year: 2019,
    totalCopies: 3,
    availableCopies: 1,
    coverColor: '#c05621',
    coverTextColor: '#ffffff',
    description: 'Your journey to mastery - from journeyman to master programmer.'
  },
  {
    title: 'Database System Concepts',
    author: 'Abraham Silberschatz',
    isbn: '978-0078022159',
    genre: 'Database',
    publisher: 'McGraw-Hill',
    year: 2020,
    totalCopies: 6,
    availableCopies: 4,
    coverColor: '#2b4c7e',
    coverTextColor: '#ffffff',
    description: 'Comprehensive coverage of database design, query languages, and system implementation.'
  },
  {
    title: 'Operating System Concepts',
    author: 'Abraham Silberschatz',
    isbn: '978-1119800330',
    genre: 'Operating Systems',
    publisher: 'Wiley',
    year: 2021,
    totalCopies: 4,
    availableCopies: 4,
    coverColor: '#1a3a4a',
    coverTextColor: '#ffffff',
    description: 'The "Dinosaur Book" - foundational reference for operating system design.'
  },
  {
    title: 'Computer Networks',
    author: 'Andrew S. Tanenbaum',
    isbn: '978-0132126953',
    genre: 'Networking',
    publisher: 'Pearson',
    year: 2010,
    totalCopies: 3,
    availableCopies: 2,
    coverColor: '#3d2b56',
    coverTextColor: '#ffffff',
    description: 'A top-down approach to computer networking principles and practice.'
  },
  {
    title: 'Artificial Intelligence: A Modern Approach',
    author: 'Stuart Russell & Peter Norvig',
    isbn: '978-0134610993',
    genre: 'Artificial Intelligence',
    publisher: 'Pearson',
    year: 2020,
    totalCopies: 4,
    availableCopies: 2,
    coverColor: '#2d6a4f',
    coverTextColor: '#ffffff',
    description: 'The standard text in AI – a comprehensive overview of modern AI techniques.'
  },
  {
    title: 'Structure and Interpretation of Computer Programs',
    author: 'Harold Abelson & Gerald Sussman',
    isbn: '978-0262510875',
    genre: 'Computer Science',
    publisher: 'MIT Press',
    year: 1996,
    totalCopies: 2,
    availableCopies: 2,
    coverColor: '#7b341e',
    coverTextColor: '#ffffff',
    description: 'The "Wizard Book" - a classic text on computation and programming.'
  },
  {
    title: 'You Don\'t Know JS',
    author: 'Kyle Simpson',
    isbn: '978-1491924464',
    genre: 'Web Development',
    publisher: 'O\'Reilly Media',
    year: 2015,
    totalCopies: 3,
    availableCopies: 3,
    coverColor: '#1c4532',
    coverTextColor: '#ffffff',
    description: 'A deep dive into the core mechanisms of JavaScript.'
  }
];

const seedUsers = [
  {
    name: 'Meena Iyer',
    email: 'meena.i@college.edu',
    membershipId: 'LIB001',
    password: 'librarian123',
    role: 'librarian',
    contact: '9876543210',
    status: 'active'
  },
  {
    name: 'Rahul Sharma',
    email: 'rahul.s@college.edu',
    membershipId: 'STU2024001',
    password: 'student123',
    role: 'student',
    contact: '9876543211',
    status: 'active'
  },
  {
    name: 'Priya Nair',
    email: 'priya.n@college.edu',
    membershipId: 'STU2024002',
    password: 'student123',
    role: 'student',
    contact: '9876543212',
    status: 'active'
  },
  {
    name: 'Arjun Patel',
    email: 'arjun.p@college.edu',
    membershipId: 'STU2024003',
    password: 'student123',
    role: 'student',
    contact: '9876543213',
    status: 'active'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB:', MONGODB_URI);

    // Clear existing data
    await Promise.all([
      User.deleteMany({}),
      Book.deleteMany({}),
      BorrowRecord.deleteMany({}),
      Reservation.deleteMany({}),
      Fine.deleteMany({}),
      Notification.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data.');

    // Seed books
    const createdBooks = await Book.insertMany(books);
    console.log(`📚 Seeded ${createdBooks.length} books.`);

    // Seed users (passwords will be hashed by User model pre-save hook)
    const createdUsers = [];
    for (const userData of seedUsers) {
      const user = await User.create(userData);
      createdUsers.push(user);
    }
    console.log(`👥 Seeded ${createdUsers.length} users.`);

    // Show credentials
    console.log('\n📋 Sample credentials:');
    console.log('   Librarian: meena.i@college.edu / librarian123');
    console.log('   Student  : rahul.s@college.edu  / student123');
    console.log('   Student  : priya.n@college.edu  / student123');
    console.log('   Student  : arjun.p@college.edu  / student123');

    await mongoose.disconnect();
    console.log('\n✨ Seed complete! Database is ready.\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
