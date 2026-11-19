import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { Customer } from '../models/Customer.js';

export const protectAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;
    if (!token) return res.status(401).json({ success: false, message: 'Admin access required. No token.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin') return res.status(403).json({ success: false, message: 'Admin access only.' });
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) return res.status(401).json({ success: false, message: 'Admin not found.' });
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const protectCustomer = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;
    if (!token) return res.status(401).json({ success: false, message: 'Login required. No token.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'customer') return res.status(403).json({ success: false, message: 'Customer access only.' });
    const customer = await Customer.findById(decoded.id).select('-password');
    if (!customer) return res.status(401).json({ success: false, message: 'Customer not found.' });
    req.customer = customer;
    next();
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const protectAnyUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;
    if (!token) return res.status(401).json({ success: false, message: 'Login required. No token.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role === 'admin') {
      const admin = await Admin.findById(decoded.id).select('-password');
      if (!admin) return res.status(401).json({ success: false, message: 'Admin not found.' });
      req.admin = admin;
      return next();
    }
    if (decoded.role === 'customer') {
      const customer = await Customer.findById(decoded.id).select('-password');
      if (!customer) return res.status(401).json({ success: false, message: 'Customer not found.' });
      req.customer = customer;
      return next();
    }
    return res.status(403).json({ success: false, message: 'Invalid role.' });
  } catch (err) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};
