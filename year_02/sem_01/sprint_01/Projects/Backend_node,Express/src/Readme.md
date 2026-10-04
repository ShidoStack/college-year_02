# SmartLibrary — Library Management System

A complete college library management web application built with **HTML5, CSS3, and Vanilla JavaScript**. No frameworks, no libraries — just clean, modular code that a B.Tech student can understand and extend.

## Features

- **Library Catalog** with grid/list views, search, sort, filters, and alphabet navigation
- **Book Details** modal with borrow, reserve, and wishlist actions
- **Student Dashboard** showing borrowed books, reservations, fines, and history
- **Librarian Dashboard** with library statistics, recent borrowings, overdue books, and popular books
- **Borrowing System** with issue/return workflow and automatic copy tracking
- **Reservation System** with cancel and notification support
- **Fines Management** with automatic calculation and payment simulation
- **Member Management** (librarian) with view, edit, and deactivate actions
- **Book Management** (librarian) with add, edit, delete, and validation
- **Reports** with borrowing trends, popular books, member activity, and overdue statistics
- **Notifications** with dropdown and dedicated page
- **Authentication** with login, register, and role-aware UI (student/librarian)
- **Responsive** design with collapsible mobile sidebar drawer

## Folder Structure

```
smartlibrary/
│
├── index.html              # Main application shell (sidebar + topbar + content)
├── login.html              # Login page
├── register.html           # Registration page
├── style.css               # Complete application stylesheet
├── package.json            # Vite build configuration
│
├── js/
│   ├── data.js             # Mock/seed data (28 books, 10 members, borrowings, etc.)
│   ├── store.js            # State store with localStorage persistence
│   ├── api.js              # API service layer (ready for Express backend)
│   ├── auth.js             # Demo authentication using localStorage
│   ├── ui.js               # UI utilities (toasts, modals, icons, helpers)
│   ├── app.js              # Main app: router, sidebar, topbar, notifications
│   │
│   └── views/
│       ├── catalog.js      # Library catalog (search, filter, sort, grid/list, book modal)
│       ├── dashboard.js    # Student & librarian dashboards
│       ├── circulation.js  # Borrowing, reservations, returns, fines
│       ├── management.js   # Member management & book management
│       └── system.js       # Reports, notifications page, settings
│
└── README.md
```

## Demo Accounts

| Role      | Email                    | Password         |
|-----------|--------------------------|------------------|
| Student   | rahul.s@college.edu      | student123       |
| Librarian | meena.i@college.edu      | librarian123     |

## How to Run

The dev server runs automatically. If you need to run it manually:

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal (typically `http://localhost:5173`).

To build for production:

```bash
npm run build
npm run preview
```

## Main Pages

| Page             | Sidebar Location   | Description                                      |
|------------------|--------------------|--------------------------------------------------|
| Library          | Catalog > Library  | Main book catalog with grid/list, search, filter |
| Browse Books     | Catalog > Browse   | Same catalog, alternate entry point              |
| Collections      | Catalog > Collections | Books grouped by genre                        |
| Borrowing        | Circulation > Borrowing | Active borrowings with return action        |
| Reservations     | Circulation > Reservations | Reservations with cancel action           |
| Returns          | Circulation > Returns | Return history                                |
| Fines            | Circulation > Fines | Fine management with pay action                  |
| Members          | Management > Members | Member table (librarian only)                   |
| Books            | Management > Books | Book management with add/edit/delete (librarian) |
| Dashboard        | Analytics > Dashboard | Student or librarian dashboard                |
| Reports          | Analytics > Reports | Charts and statistics                           |
| Notifications    | System > Notifications | All notifications with mark-as-read         |
| Settings         | System > Settings  | Account info, preferences, data reset            |

## Main Interactions

All buttons are functional with mock data:

- **Search**: Instant filtering by title, author, ISBN, or genre
- **Filter**: By genre (multi-select) and availability
- **Sort**: By title, author, genre, year, or date added
- **Alphabet Navigation**: Click a letter to filter books by first letter
- **Grid/List Toggle**: Switch between card grid and table list (saved to localStorage)
- **Book Details**: Click any book to open a detail modal
- **Borrow**: Students can borrow available books (14-day loan period)
- **Reserve**: Students can reserve checked-out books
- **Return**: Librarians can mark books as returned
- **Wishlist**: Bookmark books for later
- **Add/Edit/Delete Book**: Librarian-only book management with form validation
- **Member Management**: View, edit, activate/deactivate members
- **Fine Calculation**: Automatic $5/day fine for overdue books
- **Pay Fine**: Simulated fine payment
- **Notifications**: Dropdown in topbar + full page, mark as read
- **Login/Register**: Demo auth with localStorage session
- **Toast Messages**: Success, error, warning, and info notifications
- **Confirmation Dialogs**: For destructive actions (delete, cancel, reset)

## Backend API Connection

The app is structured so that mock data can be replaced with real API calls.

### Where to connect

All API calls go through `js/api.js`. Each method has a `USE_MOCK` flag:

```javascript
const USE_MOCK = true;  // Set to false when backend is ready
```

When `USE_MOCK` is `true`, data comes from `js/store.js` (localStorage).
When set to `false`, uncomment the `fetch()` calls to hit the real API.

### Expected API Endpoints

```
AUTH:
  POST /api/auth/register
  POST /api/auth/login
  POST /api/auth/firebase

BOOKS:
  GET    /api/books
  GET    /api/books/:id
  POST   /api/books
  PUT    /api/books/:id
  DELETE /api/books/:id

MEMBERS:
  GET    /api/members
  GET    /api/members/:id
  POST   /api/members
  PUT    /api/members/:id

BORROW:
  POST   /api/borrow
  PUT    /api/borrow/:id/return
  GET    /api/borrow
  GET    /api/borrow/user/:id

RESERVATIONS:
  POST   /api/reservations
  GET    /api/reservations
  DELETE /api/reservations/:id

FINES:
  GET    /api/fines/user/:id
  POST   /api/fines/calculate
  PUT    /api/fines/:id/pay

REPORTS:
  GET    /api/reports/borrowing
  GET    /api/reports/popular-books
  GET    /api/reports/member-activity

NOTIFICATIONS:
  GET    /api/notifications
  POST   /api/notifications
```

### Socket.io

Real-time book availability updates are prepared in `js/api.js` via the `initializeSocket()` function. When the backend is ready, uncomment the Socket.io client code inside that function to receive real-time events for:

- `book:borrowed` — available copies decrease
- `book:returned` — available copies increase
- `reservation:ready` — reserved book becomes available

## Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES modules)
- **Build Tool**: Vite
- **Persistence**: localStorage (demo) → MongoDB (production)
- **Planned Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, Firebase Auth, Socket.io

## Data

The app includes realistic seed data:

- **28 books** with real titles, authors, genres, ISBNs, and publishers
- **10 members** (8 students + 1 librarian + 1 additional)
- **12 borrowing records** (active and returned)
- **5 reservations**
- **5 fine records**
- **10 notifications**

All data persists in localStorage. Use Settings > Reset All Data to restore the original demo state.
