import asyncHandler from 'express-async-handler';
import Enquiry from '../models/Enquiry.js';
import { AppError } from '../utils/AppError.js';
import { sendEmail } from '../utils/email.js';

export const createEnquiry = asyncHandler(async (req, res) => {
  const enquiry = await Enquiry.create(req.body);

  // Send email to admin immediately (Must await in serverless environments before res.json)
  try {
      const adminEmail = process.env.EMAIL_USER;
      if (adminEmail) {
        await sendEmail({
          to: adminEmail,
          subject: `New Enquiry from ${enquiry.name}`,
          html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
            <h2 style="color: #F5B400;">New Website Contact Form Submission</h2>
            <br/>
            <p><strong>Category:</strong> ${enquiry.category}</p>
            <p><strong>Name:</strong> ${enquiry.name}</p>
            <p><strong>Email:</strong> ${enquiry.email}</p>
            <p><strong>Phone:</strong> ${enquiry.phone || 'Not provided'}</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 5px;">${enquiry.message}</p>
          </div>
        `,
        });
      }
    } catch (err) {
      // Proceed even if email fails
    }

  res.status(201).json({
    status: 'success',
    data: {
      enquiry,
    },
  });
});

export const getAllEnquiries = asyncHandler(async (req, res) => {
  const enquiries = await Enquiry.find()
    .sort({ createdAt: -1 })
    .lean();

  res.status(200).json({
    status: 'success',
    data: {
      enquiries,
    },
  });
});

export const updateEnquiryStatus = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['pending', 'completed'].includes(status)) {
    return next(new AppError('Status must be pending or completed', 400));
  }

  const enquiry = await Enquiry.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true }
  );

  if (!enquiry) {
    return next(new AppError('Enquiry not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      enquiry,
    },
  });
});

export const deleteCompletedEnquiries = asyncHandler(async (req, res) => {
  const result = await Enquiry.deleteMany({ status: 'completed' });

  res.status(200).json({
    status: 'success',
    data: {
      deletedCount: result.deletedCount,
    },
  });
});
