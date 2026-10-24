const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
      type: String,
      required: function() {
        return !this.firebaseUid;
      },
      minlength: 6,
      select: false
    },
    contact: {
      type: String,
      trim: true,
      default: ''
    },
    membershipId: {
      type: String,
      required: [true, 'Membership ID is required'],
      unique: true,
      trim: true
    },
    role: {
      type: String,
      enum: ['student', 'librarian', 'admin'],
      default: 'student'
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active'
    },
    firebaseUid: {
      type: String,
      sparse: true,
      index: true
    },
    joinedDate: {
      type: Date,
      default: Date.now
    },
    booksBorrowed: {
      type: Number,
      default: 0
    },
    outstandingFine: {
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
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
      }
    }
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
