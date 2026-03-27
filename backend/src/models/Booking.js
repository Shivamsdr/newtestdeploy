import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Booking must belong to a tour'],
      index: true,
    },
    bookingDate: {
      type: Date,
      required: [true, 'Booking date is required'],
      index: true,
    },
    // Optional start time (HH:mm) for this booking, matching admin-configured availability times
    bookingTime: {
      type: String,
      required: false,
      trim: true,
      validate: {
        validator: function (v) {
          if (!v) return true; // optional
          return /^\d{2}:\d{2}$/.test(v);
        },
        message: 'bookingTime must be in HH:mm format',
      },
    },
    peopleCount: {
      type: Number,
      required: [true, 'Number of people is required'],
      min: [1, 'At least 1 person required'],
      max: [50, 'Maximum 50 people allowed'],
    },
    bookingType: {
      type: String,
      enum: { values: ['group', 'private'], message: 'Booking type must be group or private' },
      default: 'group',
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'confirmed', 'paid', 'cancelled'],
        message: 'Status must be pending, confirmed, paid, or cancelled',
      },
      default: 'pending',
    },
    customerName: {
      type: String,
      required: false,
    },
    customerAge: {
      type: Number,
      required: false,
      min: [1, 'Age must be at least 1'],
      max: [120, 'Age must be at most 120'],
    },
    customerGender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other', 'prefer-not-to-say'],
        message: 'Gender must be male, female, other, or prefer-not-to-say',
      },
      required: false,
    },
    customerEmail: {
      type: String,
      required: false,
      lowercase: true,
      trim: true,
    },
    customerPhone: {
      type: String,
      required: false,
      trim: true,
    },
    customerAddress: {
      type: String,
      required: false,
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      required: false,
    },
    totalAmount: {
      type: Number,
      required: false,
      min: [0, 'Total amount cannot be negative'],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for date-based queries
bookingSchema.index({ tourId: 1, bookingDate: 1 });

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
