const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
      index: true
    },
    author: {
      type: String,
      required: [true, 'Author is required'],
      trim: true,
      index: true
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true,
      index: true
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      unique: true,
      trim: true,
      index: true
    },
    publisher: {
      type: String,
      trim: true,
      default: 'Unknown'
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear()
    },
    totalCopies: {
      type: Number,
      required: [true, 'Total copies is required'],
      min: [1, 'Total copies must be at least 1'],
      default: 1
    },
    availableCopies: {
      type: Number,
      required: [true, 'Available copies is required'],
      min: [0, 'Available copies cannot be negative'],
      default: 1
    },
    coverColor: {
      type: String,
      default: '#1a365d'
    },
    coverTextColor: {
      type: String,
      default: '#fff'
    },
    description: {
      type: String,
      default: 'No description available.'
    },
    addedDate: {
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
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Virtual for availability status
bookSchema.virtual('status').get(function () {
  if (this.availableCopies === 0) return 'unavailable';
  if (this.availableCopies < this.totalCopies / 2) return 'low_stock';
  return 'available';
});

module.exports = mongoose.model('Book', bookSchema);
