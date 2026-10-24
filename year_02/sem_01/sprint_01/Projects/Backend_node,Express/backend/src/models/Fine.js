const mongoose = require('mongoose');

const fineSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Member ID is required'],
      index: true
    },
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book ID is required']
    },
    borrowRecordId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BorrowRecord',
      index: true
    },
    dueDate: {
      type: Date
    },
    daysOverdue: {
      type: Number,
      default: 0
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    reason: {
      type: String,
      default: 'Overdue return'
    },
    status: {
      type: String,
      enum: ['unpaid', 'paid'],
      default: 'unpaid',
      index: true
    },
    paidAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.dueDate) ret.dueDate = ret.dueDate.toISOString().split('T')[0];
        if (ret.paidAt) ret.paidOn = ret.paidAt.toISOString().split('T')[0];
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Fine', fineSchema);
