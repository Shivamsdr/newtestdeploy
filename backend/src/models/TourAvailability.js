import mongoose from 'mongoose';

const tourAvailabilitySchema = new mongoose.Schema(
  {
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tour',
      required: [true, 'Availability must belong to a tour'],
    },
    date: {
      type: Date,
      required: [true, 'Date is required'],
    },
    totalSlots: {
      type: Number,
      required: [true, 'Total slots is required'],
      min: [0, 'Total slots cannot be negative'],
    },
    bookedSlots: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Booked slots cannot be negative'],
    },
    // Whether this date is currently open for booking (controlled by admin)
    isActive: {
      type: Boolean,
      default: true,
    },
    /**
     * Optional list of start times (HH:mm) for this tour on this date.
     * This does NOT affect the current booking capacity logic (which is date-based).
     * Admin can add/remove times to control which time options are offered.
     */
    times: {
      type: [String],
      default: [],
      validate: {
        validator: function (arr) {
          return Array.isArray(arr) && arr.every((t) => typeof t === 'string' && /^\d{2}:\d{2}$/.test(t));
        },
        message: 'Times must be an array of strings in HH:mm format',
      },
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Compound unique index: one record per tour per date
tourAvailabilitySchema.index({ tourId: 1, date: 1 }, { unique: true });

const TourAvailability = mongoose.model('TourAvailability', tourAvailabilitySchema);

export default TourAvailability;
