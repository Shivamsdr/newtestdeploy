import mongoose from 'mongoose';

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A testimonial must have a name'],
      trim: true,
      maxlength: [100, 'Name must be at most 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'A testimonial must have a message'],
      trim: true,
      maxlength: [500, 'Message must be at most 500 characters'],
    },
    image: {
      type: String,
    },
    rating: {
      type: Number,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
      default: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Testimonial = mongoose.model('Testimonial', testimonialSchema);

export default Testimonial;
