import mongoose from 'mongoose';

const timelineStepSchema = new mongoose.Schema(
  {
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'A timeline step must belong to a tour'],
    },
    title: {
      type: String,
      required: [true, 'A timeline step must have a title'],
      trim: true,
      maxlength: [100, 'Title must be at most 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description must be at most 500 characters'],
    },
    duration: {
      type: String,
      trim: true,
      maxlength: [50, 'Duration must be at most 50 characters'],
    },
    order: {
      type: Number,
      required: [true, 'A timeline step must have an order'],
      min: [1, 'Order must be at least 1'],
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound index for efficient querying by tour and order
timelineStepSchema.index({ tour: 1, order: 1 });

const TimelineStep = mongoose.model('TimelineStep', timelineStepSchema);

export default TimelineStep;
