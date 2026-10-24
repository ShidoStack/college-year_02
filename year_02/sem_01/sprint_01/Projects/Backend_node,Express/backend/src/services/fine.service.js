const Fine = require('../models/Fine');
const BorrowRecord = require('../models/BorrowRecord');
const User = require('../models/User');
const { FINE_PER_DAY } = require('../config/env');

const getFinesByUser = async (memberId) => {
  return await Fine.find({ memberId }).sort({ dueDate: -1, createdAt: -1 });
};

const getAllFines = async () => {
  return await Fine.find().sort({ createdAt: -1 });
};

const calculateFines = async (borrowingId = null) => {
  const now = new Date();
  const filter = {
    status: { $in: ['borrowed', 'overdue'] },
    dueDate: { $lt: now }
  };

  if (borrowingId) {
    filter._id = borrowingId;
  }

  const overdueBorrowings = await BorrowRecord.find(filter);
  const updatedFines = [];

  for (const record of overdueBorrowings) {
    const diffDays = Math.floor((now - new Date(record.dueDate)) / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      const fineAmount = diffDays * FINE_PER_DAY;
      record.status = 'overdue';
      record.fine = fineAmount;
      await record.save();

      // Upsert fine record for this borrow record
      let fine = await Fine.findOne({
        borrowRecordId: record._id,
        status: 'unpaid'
      });

      if (fine) {
        fine.daysOverdue = diffDays;
        fine.amount = fineAmount;
        await fine.save();
      } else {
        fine = await Fine.create({
          memberId: record.memberId,
          bookId: record.bookId,
          borrowRecordId: record._id,
          dueDate: record.dueDate,
          daysOverdue: diffDays,
          amount: fineAmount,
          reason: `Overdue by ${diffDays} day(s)`,
          status: 'unpaid'
        });
      }
      updatedFines.push(fine);

      // Re-sum outstanding fine for member
      const memberFines = await Fine.aggregate([
        { $match: { memberId: record.memberId, status: 'unpaid' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]);
      const totalOutstanding = memberFines.length > 0 ? memberFines[0].total : 0;
      await User.findByIdAndUpdate(record.memberId, { outstandingFine: totalOutstanding });
    }
  }

  return {
    calculatedCount: overdueBorrowings.length,
    fines: updatedFines
  };
};

const payFine = async (fineId) => {
  const fine = await Fine.findById(fineId);
  if (!fine) {
    const error = new Error('Fine record not found.');
    error.statusCode = 404;
    error.code = 'FINE_NOT_FOUND';
    throw error;
  }

  if (fine.status === 'paid') {
    return fine;
  }

  fine.status = 'paid';
  fine.paidAt = new Date();
  await fine.save();

  // Deduct from member's outstanding fine
  const member = await User.findById(fine.memberId);
  if (member) {
    member.outstandingFine = Math.max(0, (member.outstandingFine || 0) - fine.amount);
    await member.save();
  }

  return fine;
};

module.exports = {
  getFinesByUser,
  getAllFines,
  calculateFines,
  payFine
};
