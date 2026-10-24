const mongoose = require('mongoose');

const borrowRecordSchema = new mongoose.Schema(
  {
    bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Book ID is required'],
      index: true
    },
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Member ID is required'],
      index: true
    },
    issueDate: {
      type: Date,
      default: Date.now,
      required: true
    },
    dueDate: {
      type: Date,
      required: true,
      index: true
    },
    returnDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned', 'overdue'],
      default: 'borrowed',
      index: true
    },
    fine: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        // Format dates as YYYY-MM-DD for consistency with frontend
        if (ret.issueDate) ret.issueDate = ret.issueDate.toISOString().split('T')[0];
        if (ret.dueDate) ret.dueDate = ret.dueDate.toISOString().split('T')[0];
        if (ret.returnDate) ret.returnDate = ret.returnDate.toISOString().split('T')[0];
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('BorrowRecord', borrowRecordSchema);
