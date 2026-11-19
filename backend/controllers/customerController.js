import jwt from 'jsonwebtoken';
import { Customer } from '../models/Customer.js';

// POST /api/auth/register
export const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, phone, password, address, city, pincode } = req.body;

    if (!fullName || !fullName.trim()) return res.status(400).json({ success: false, message: 'Full name is required.' });
    if (!email || !email.trim()) return res.status(400).json({ success: false, message: 'Email is required.' });
    if (!phone || !phone.trim()) return res.status(400).json({ success: false, message: 'Phone number is required.' });
    if (!password || password.length < 6) return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

    const existing = await Customer.findOne({ email: email.trim().toLowerCase() });
    if (existing) return res.status(409).json({ success: false, message: 'Email is already registered.' });

    const customer = await Customer.create({
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      password,
      address: address?.trim() || '',
      city: city?.trim() || '',
      pincode: pincode?.trim() || '',
    });

    const token = jwt.sign(
      { id: customer._id, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      token,
      customer: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        pincode: customer.pincode,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
};

// POST /api/auth/login
export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.trim()) return res.status(400).json({ success: false, message: 'Email is required.' });
    if (!password) return res.status(400).json({ success: false, message: 'Password is required.' });

    const customer = await Customer.findOne({ email: email.trim().toLowerCase() });
    if (!customer) {
      // Check if this is the admin account attempting to sign in on customer page
      const { Admin } = await import('../models/Admin.js');
      const admin = await Admin.findOne({
        $or: [{ email: email.trim().toLowerCase() }, { username: email.trim() }],
      });
      if (admin) {
        return res.status(400).json({
          success: false,
          message: 'This is an Admin account. Please sign in via the Admin Portal at /admin/login.',
        });
      }
      return res.status(401).json({ success: false, message: 'Invalid credentials. If you are a new customer, please register first.' });
    }

    const isMatch = await customer.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const token = jwt.sign(
      { id: customer._id, role: 'customer' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      customer: {
        id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        city: customer.city,
        pincode: customer.pincode,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
};

// GET /api/auth/profile
export const getMyProfile = async (req, res) => {
  try {
    const customer = await Customer.findById(req.customer._id).select('-password');
    if (!customer) return res.status(404).json({ success: false, message: 'Profile not found.' });
    res.json({ success: true, data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/auth/profile
export const updateMyProfile = async (req, res) => {
  try {
    const { fullName, phone, address, city, pincode } = req.body;
    const updates = {};
    if (fullName) updates.fullName = fullName.trim();
    if (phone) updates.phone = phone.trim();
    if (address !== undefined) updates.address = address.trim();
    if (city !== undefined) updates.city = city.trim();
    if (pincode !== undefined) updates.pincode = pincode.trim();

    const customer = await Customer.findByIdAndUpdate(
      req.customer._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, message: 'Profile updated successfully.', data: customer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/auth/password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const customer = await Customer.findById(req.customer._id);
    const isMatch = await customer.comparePassword(currentPassword);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Current password is incorrect.' });

    customer.password = newPassword;
    await customer.save();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
