import Order from '../models/Order.js';
import User from '../models/User.js';
import { sendOrderConfirmation } from '../utils/email.js';

// @desc    Create new order (checkout)
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.cart.length === 0) return res.status(400).json({ success: false, message: 'Cart is empty' });

    const orderItems = user.cart.map(item => ({
      product: item.product._id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
      size: item.size
    }));

    const totalPrice = orderItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const order = await Order.create({
      user: user._id,
      items: orderItems,
      totalPrice
    });

    user.cart = [];
    await user.save();

    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('items.product');

    // Send confirmation email
    const emailData = {
      orderId: order._id,
      orderDate: order.orderDate,
      items: orderItems,
      totalPrice: order.totalPrice
    };

    try {
      await sendOrderConfirmation(user.email, emailData);
    } catch (emailError) {
      console.error('Failed to send confirmation email:', emailError);
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: populatedOrder
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get all orders for logged-in user
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ orderDate: -1 });

    res.json({ success: true, data: orders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product');

    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
