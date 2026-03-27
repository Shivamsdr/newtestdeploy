import mongoose from 'mongoose';
import { slugify } from '../utils/slugify.js';

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [100, 'A tour name must have less or equal than 100 characters'],
      minlength: [3, 'A tour name must have more or equal than 3 characters'],
    },
    slug: {
      type: String,
      index: true,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: 'Price must be greater than 0',
      },
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    dayType: {
      type: String,
      required: true,
      enum: {
        values: ['half-day', 'full-day'],
        message: 'Day Type is either: half-day or full-day',
      },
      default: 'full-day',
    },
    location: {
      name: { type: String, required: true },
      googleMapLink: { type: String, required: true }
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, or difficult',
      },
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a max group size'],
    },
    summary: {
      type: String,
      required: [true, 'A tour must have a summary'],
      trim: true,
      maxlength: [2000, 'A tour summary must have less or equal than 2000 characters'],
    },
    shortDescription: {
      type: String,
      required: [true, 'A tour must have a short description for cards'],
      trim: true,
      maxlength: [160, 'A short description must have less or equal than 160 characters'],
    },
    imageCover: {
      type: String,
    },
    images: {
      type: [String],
      default: [],
    },
    // Tags help categorize tours for searching/filtering (e.g. "heritage", "sunset", "food")
    tags: {
      type: [String],
      default: [],
      set: (arr) =>
        (Array.isArray(arr) ? arr : [])
          .map((t) => String(t).trim().toLowerCase())
          .filter(Boolean)
          // de-dupe
          .filter((t, i, a) => a.indexOf(t) === i),
    },
    // Allowed booking types: group, private, or both (default both)
    allowedBookingTypes: {
      type: [String],
      enum: { values: ['group', 'private'], message: 'Each value must be group or private' },
      default: () => ['group', 'private'],
      set: (arr) => {
        if (!Array.isArray(arr) || arr.length === 0) return ['group', 'private'];
        const cleaned = [...new Set(arr)].filter((v) => v === 'group' || v === 'private');
        return cleaned.length ? cleaned : ['group', 'private'];
      },
    },
    // FAQs (Custom Q&A for each tour)
    faqs: {
      type: [
        {
          question: {
            type: String,
            required: [true, 'A question is required'],
            trim: true,
          },
          answer: {
            type: String,
            required: [true, 'An answer is required'],
            trim: true,
          },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Pre-save middleware to generate slug from name
tourSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = slugify(this.name);
  }
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

export default Tour;
