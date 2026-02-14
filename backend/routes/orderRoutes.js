const express = require('express');
const router = express.Router();
const { addOrderItems, getUserOrders, getRestaurantOrders } = require('../controllers/orderController');

router.post('/', addOrderItems);
router.get('/user/:userId', getUserOrders);
router.get('/restaurant/:restaurantId', getRestaurantOrders); // <--- New Route

module.exports = router;