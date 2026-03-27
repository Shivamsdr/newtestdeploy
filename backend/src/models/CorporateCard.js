import mongoose from 'mongoose';

const corporateCardSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'A corporate card must have a title'],
            trim: true,
            maxlength: [200, 'Title must be at most 200 characters'],
        },
        description: {
            type: String,
            required: [true, 'A corporate card must have a description'],
            trim: true,
        },
        image: {
            type: String,
            required: [true, 'A corporate card must have an image'],
            default: '',
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

corporateCardSchema.index({ isActive: 1, createdAt: -1 });

const CorporateCard = mongoose.model('CorporateCard', corporateCardSchema);

export default CorporateCard;
