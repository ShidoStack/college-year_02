const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema(
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
    reservedOn: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['waiting', 'ready', 'fulfilled', 'cancelled', 'expired'],
      default: 'waiting',
      index: true
    },
    available: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.reservedOn) ret.reservedOn = ret.reservedOn.toISOString().split('T')[0];
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Reservation', reservationSchema);
