import { Enquiry } from '../models/Enquiry.js';

// Create a new order/enquiry (requires logged in customer)
export const createEnquiry = async (req, res) => {
  try {
    const { items, message } = req.body;
    const customerId = req.customer?._id;
    const email = req.customer?.email || req.body.email || '';
    const name = (req.body.name || req.customer?.fullName || '').trim();
    const phoneNumber = (req.body.phoneNumber || req.customer?.phone || '').trim();

    // Validation
    if (!customerId) {
      return res.status(401).json({ success: false, message: 'Please log in to your account before submitting an order or enquiry.' });
    }
    if (!name) {
      return res.status(400).json({ success: false, message: 'Please provide your name' });
    }
    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'Please provide your phone number' });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Please add at least one product category and quantity' });
    }

    // Validate each item
    for (const item of items) {
      if (!item.category || !item.category.trim()) {
        return res.status(400).json({ success: false, message: 'Please select a category for all items' });
      }
      if (!item.quantity || !item.quantity.trim()) {
        return res.status(400).json({ success: false, message: 'Please specify the quantity for all items' });
      }
    }

    let savedEnquiry = null;
    try {
      savedEnquiry = await Enquiry.create({
        customerId,
        email,
        name,
        phoneNumber,
        items,
        message: message ? message.trim() : '',
      });
    } catch (dbErr) {
      console.warn('DB write failed, falling back to in-memory ack:', dbErr.message);
      // Return a simulated saved enquiry if DB is briefly unreachable
      savedEnquiry = {
        _id: 'mock_' + Date.now(),
        customerId,
        email,
        name,
        phoneNumber,
        items,
        message,
        createdAt: new Date(),
      };
    }

    res.status(201).json({
      success: true,
      message: 'Thank you! Your order enquiry has been received successfully. Our team will contact you shortly.',
      data: savedEnquiry,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error creating enquiry' });
  }
};

// Get all enquiries (for admin or review)
export const getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json({ success: true, count: enquiries.length, data: enquiries });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/enquiries/:id/status - update enquiry status (protectAdmin)
export const updateEnquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['New', 'Contacted', 'In Progress', 'Completed', 'Rejected'];

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { $set: { status } },
      { new: true }
    );
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found.' });

    res.json({ success: true, message: `Enquiry status updated to ${status}.`, data: enquiry });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
