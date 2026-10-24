const BorrowRecord = require('../models/BorrowRecord');
const Book = require('../models/Book');
const User = require('../models/User');

const getBorrowingReport = async () => {
  // Aggregate stats using MongoDB aggregation pipeline
  const [stats, monthlyTrends, allBorrowings] = await Promise.all([
    BorrowRecord.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]),
    BorrowRecord.aggregate([
      {
        $group: {
          _id: { $substr: [{ $dateToString: { format: '%Y-%m-%d', date: '$issueDate' } }, 0, 7] },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]),
    BorrowRecord.find().sort({ issueDate: -1 })
  ]);

  const summary = {
    total: allBorrowings.length,
    borrowed: 0,
    returned: 0,
    overdue: 0
  };

  stats.forEach(s => {
    if (s._id in summary) summary[s._id] = s.count;
  });

  return {
    summary,
    monthlyTrends,
    borrowings: allBorrowings
  };
};

const getPopularBooksReport = async () => {
  // Group borrowings by bookId and sort by count descending
  const popular = await BorrowRecord.aggregate([
    {
      $group: {
        _id: '$bookId',
        count: { $sum: 1 }
      }
    },
    { $sort: { count: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'books',
        localField: '_id',
        foreignField: '_id',
        as: 'book'
      }
    },
    {
      $unwind: {
        path: '$book',
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        bookId: { $toString: '$_id' },
        count: 1,
        book: {
          id: { $toString: '$book._id' },
          title: '$book.title',
          author: '$book.author',
          genre: '$book.genre',
          coverColor: '$book.coverColor',
          coverTextColor: '$book.coverTextColor'
        }
      }
    }
  ]);

  return popular;
};

const getMemberActivityReport = async () => {
  // Aggregate borrowings per member
  const members = await User.find({ role: 'student' }).sort({ name: 1 });
  const counts = await BorrowRecord.aggregate([
    {
      $group: {
        _id: '$memberId',
        totalBorrowed: { $sum: 1 },
        activeBorrowed: {
          $sum: { $cond: [{ $in: ['$status', ['borrowed', 'overdue']] }, 1, 0] }
        }
      }
    }
  ]);

  const countMap = {};
  counts.forEach(c => {
    countMap[c._id.toString()] = c;
  });

  const report = members.map(m => {
    const data = countMap[m._id.toString()] || { totalBorrowed: 0, activeBorrowed: 0 };
    return {
      id: m._id.toString(),
      name: m.name,
      email: m.email,
      membershipId: m.membershipId,
      status: m.status,
      totalBorrowed: data.totalBorrowed,
      booksBorrowed: data.activeBorrowed,
      outstandingFine: m.outstandingFine || 0
    };
  }).sort((a, b) => b.totalBorrowed - a.totalBorrowed);

  return report;
};

module.exports = {
  getBorrowingReport,
  getPopularBooksReport,
  getMemberActivityReport
};
