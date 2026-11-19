import { Order } from '../models/Order.js';
import { Customer } from '../models/Customer.js';

// POST /api/orders - create order (protectCustomer)
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      discountAmount,
      couponCode,
      paymentMethod,
      deliveryAddress,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must have at least one item.' });
    }
    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid total amount.' });
    }

    // Validate each item
    for (const item of items) {
      if (!item.productName) return res.status(400).json({ success: false, message: 'Each item must have a product name.' });
      if (!item.price || item.price <= 0) return res.status(400).json({ success: false, message: 'Each item must have a valid price.' });
      if (!item.quantity || item.quantity < 1) return res.status(400).json({ success: false, message: 'Each item must have a valid quantity.' });
      if (!item.subtotal) item.subtotal = item.price * item.quantity;
    }

    const customer = await Customer.findById(req.customer._id).select('-password');

    const order = await Order.create({
      customerId: req.customer._id,
      customerName: customer.fullName,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      deliveryAddress: deliveryAddress || customer.address || '',
      items,
      totalAmount,
      discountAmount: discountAmount || 0,
      couponCode: couponCode || '',
      paymentMethod: paymentMethod || 'Cash on Delivery',
      statusHistory: [{ status: 'Pending', note: 'Order placed.' }],
    });

    res.status(201).json({ success: true, message: 'Order placed successfully.', data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/my - customer's own orders (protectCustomer)
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.customer._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/orders/:id - single order (protectCustomer or protectAdmin)
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('customerId', 'fullName email phone');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    // If accessed by customer, ensure it's their order
    if (req.customer && order.customerId._id.toString() !== req.customer._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/admin/orders - all orders (protectAdmin)
export const getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.orderStatus = status;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .populate('customerId', 'fullName email phone'),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: orders.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/orders/:id/status - update order status (protectAdmin)
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, note } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'];

    if (!orderStatus || !validStatuses.includes(orderStatus)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    order.orderStatus = orderStatus;
    order.statusHistory.push({ status: orderStatus, note: note || '', updatedAt: new Date() });
    await order.save();

    res.json({ success: true, message: `Order status updated to ${orderStatus}.`, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/admin/orders/:id/payment - update payment status (protectAdmin)
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const validStatuses = ['Pending', 'Paid', 'Failed', 'Refunded'];

    if (!paymentStatus || !validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, message: `Invalid payment status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: { paymentStatus } },
      { new: true }
    );
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    res.json({ success: true, message: `Payment status updated to ${paymentStatus}.`, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
