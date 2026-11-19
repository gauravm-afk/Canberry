import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { Customer } from '../models/Customer.js';
import { Product } from '../models/Product.js';
import { Order } from '../models/Order.js';
import { Enquiry } from '../models/Enquiry.js';

// POST /api/admin/login
export const loginAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!password) return res.status(400).json({ success: false, message: 'Password is required.' });
    if (!username && !email) return res.status(400).json({ success: false, message: 'Username or email is required.' });

    // The identifier could be an email or username — search both fields
    const identifier = (username || email || '').trim();
    const admin = await Admin.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier },
      ],
    });

    if (!admin) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    const token = jwt.sign(
      { id: admin._id, role: 'admin', username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Admin login successful.',
      token,
      admin: { id: admin._id, username: admin.username, email: admin.email, role: admin.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Server error.' });
  }
};

// GET /api/admin/dashboard
export const getDashboardStats = async (req, res) => {
  try {
    const [totalProducts, totalOrders, totalCustomers, pendingOrders, completedOrders, totalEnquiries, recentOrders] =
      await Promise.all([
        Product.countDocuments(),
        Order.countDocuments(),
        Customer.countDocuments(),
        Order.countDocuments({ orderStatus: 'Pending' }),
        Order.countDocuments({ orderStatus: 'Delivered' }),
        Enquiry.countDocuments(),
        Order.find().sort({ createdAt: -1 }).limit(5).populate('customerId', 'fullName email'),
      ]);

    res.json({
      success: true,
      data: {
        totalProducts,
        totalOrders,
        totalCustomers,
        pendingOrders,
        completedOrders,
        totalEnquiries,
        recentOrders,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: customers.length, data: customers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/customers/:id
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: 'Customer not found.' });
    res.json({ success: true, message: 'Customer deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
