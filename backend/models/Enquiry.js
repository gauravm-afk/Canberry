import mongoose from 'mongoose';

const enquiryItemSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  quantity: {
    type: String,
    required: true,
  },
});

const enquirySchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
    },
    items: {
      type: [enquiryItemSchema],
      validate: {
        validator: function (v) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'At least one product item is required',
      },
    },
    message: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      enum: ['New', 'In Review', 'Contacted', 'Completed', 'Cancelled'],
      default: 'New',
    },
  },
  {
    timestamps: true,
  }
);

export const Enquiry = mongoose.model('Enquiry', enquirySchema);
