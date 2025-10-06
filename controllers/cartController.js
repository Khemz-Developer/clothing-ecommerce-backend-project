import User from '../models/User.js';
import Product from '../models/Product.js';

// @desc    Get user's cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.product');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: user.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart
// @access  Public (can add without login)
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size, userId } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ success: false, message: 'Please provide productId and size' });
    }

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (!product.sizes.includes(size)) {
      return res.status(400).json({ success: false, message: 'Selected size not available' });
    }

    if (userId) {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ success: false, message: 'User not found' });

      const existingItemIndex = user.cart.findIndex(
        item => item.product.toString() === productId && item.size === size
      );

      if (existingItemIndex > -1) {
        user.cart[existingItemIndex].quantity += quantity;
      } else {
        user.cart.push({ product: productId, quantity, size });
      }

      await user.save();
      const updatedUser = await User.findById(userId).populate('cart.product');

      return res.json({
        success: true,
        message: 'Item added to cart',
        data: updatedUser.cart
      });
    }

    res.json({ success: true, message: 'Item added to cart (guest mode)' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1)
      return res.status(400).json({ success: false, message: 'Quantity must be at least 1' });

    const user = await User.findById(req.user._id);
    const cartItem = user.cart.id(req.params.itemId);

    if (!cartItem)
      return res.status(404).json({ success: false, message: 'Cart item not found' });

    cartItem.quantity = quantity;
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, message: 'Cart updated', data: updatedUser.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeCartItem = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const cartItem = user.cart.id(req.params.itemId);

    if (!cartItem)
      return res.status(404).json({ success: false, message: 'Cart item not found' });

    cartItem.deleteOne();
    await user.save();

    const updatedUser = await User.findById(req.user._id).populate('cart.product');
    res.json({ success: true, message: 'Item removed from cart', data: updatedUser.cart });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();

    res.json({ success: true, message: 'Cart cleared', data: [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
