import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'A blog post must have a title'],
      trim: true,
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, 'Excerpt must be at most 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'A blog post must have content'],
      trim: true,
    },
    coverImage: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['blog', 'achievement'],
      default: 'blog',
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

// Index for public listing (published only) and slug lookup
blogSchema.index({ isPublished: 1, createdAt: -1 });
blogSchema.index({ slug: 1 }, { unique: true, sparse: true });

const Blog = mongoose.model('Blog', blogSchema);

export default Blog;
