import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name must be at most 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Query', 'Enquiry', 'Assistance', 'Feedback', 'Grievance'],
    },
    phone: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    message: {
      type: String,
      required: false,
      trim: true,
    },
    preferredDate: {
      type: Date,
      required: false,
    },
    preferredTime: {
      type: String,
      required: false,
      trim: true,
    },
    peopleCount: {
      type: Number,
      required: false,
      min: [1, 'At least 1 person required'],
      max: [50, 'Maximum 50 people allowed'],
    },
    status: {
      type: String,
      enum: {
        values: ['pending', 'completed'],
        message: 'Status must be pending or completed',
      },
      default: 'pending',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Enquiry = mongoose.model('Enquiry', enquirySchema);

export default Enquiry;
