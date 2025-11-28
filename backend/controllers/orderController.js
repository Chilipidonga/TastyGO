const Order = require('../models/Order');

// @desc    Create new order
const addOrderItems = async (req, res) => {
  try {
    const { orderItems, totalPrice, user, restaurant, paymentMethod } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    const order = new Order({
      user,
      restaurant,
      orderItems,
      totalPrice,
      paymentMethod,
      isPaid: false
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Order creation failed' });
  }
};

// @desc    Get logged in user orders
const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId })
                              .populate('restaurant', 'restaurantName') 
                              .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get orders for a specific restaurant (Owner View)
// @route   GET /api/orders/restaurant/:restaurantId
const getRestaurantOrders = async (req, res) => {
  try {
    // Find orders where 'restaurant' matches the ID
    const orders = await Order.find({ restaurant: req.params.restaurantId })
                              .populate('user', 'name email') // Get customer details
                              .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { addOrderItems, getUserOrders, getRestaurantOrders };