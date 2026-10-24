const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Member ID is required'],
      index: true
    },
    type: {
      type: String,
      enum: ['due_soon', 'overdue', 'reservation_ready', 'success', 'general', 'info'],
      default: 'general'
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true
    },
    read: {
      type: Boolean,
      default: false,
      index: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.date) ret.date = ret.date.toISOString().split('T')[0];
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Notification', notificationSchema);
