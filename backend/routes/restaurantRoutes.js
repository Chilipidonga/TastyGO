const express = require('express');
const router = express.Router();
const { 
  getRestaurants, 
  getRestaurantById, 
  addRestaurant, 
  addMenuItem // <--- Import this
} = require('../controllers/restaurantController');

router.get('/', getRestaurants);
router.get('/:id', getRestaurantById);
router.post('/', addRestaurant);
router.post('/:id/menu', addMenuItem); // <--- New Route

module.exports = router;