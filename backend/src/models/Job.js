import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A job must have a title'],
      trim: true,
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    department: {
      type: String,
      trim: true,
      maxlength: [100, 'Department must be at most 100 characters'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [150, 'Location must be at most 150 characters'],
    },
    employmentType: {
      type: String,
      trim: true,
      maxlength: [50, 'Employment type must be at most 50 characters'],
    },
    description: {
      type: String,
      required: [true, 'A job must have a description'],
      trim: true,
    },
    applicationEmail: {
      type: String,
      trim: true,
    },
    applicationUrl: {
      type: String,
      trim: true,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

jobSchema.index({ isPublished: 1, createdAt: -1 });

const Job = mongoose.model('Job', jobSchema);

export default Job;
