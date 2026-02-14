const Restaurant = require('../models/Restaurant');

// @desc    Get restaurants (all OR nearby if lat/lng provided)
// @route   GET /api/restaurants
const getRestaurants = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    let query = {};

    // If user provides location, filter by distance (within 10km)
    if (lat && lng) {
      query = {
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            $maxDistance: 10000 // 10km radius
          }
        }
      };
    }

    const restaurants = await Restaurant.find(query);
    res.json(restaurants);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get single restaurant by ID
// @route   GET /api/restaurants/:id
const getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (restaurant) {
      res.json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add a new restaurant
// @route   POST /api/restaurants
const addRestaurant = async (req, res) => {
  try {
    const { restaurantName, cuisine, address, menu, user, location } = req.body;

    const newRestaurant = new Restaurant({
      user,
      restaurantName,
      cuisine,
      address,
      location, // Stores coordinates [lng, lat]
      menu
    });

    const savedRestaurant = await newRestaurant.save();
    res.status(201).json(savedRestaurant);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to add restaurant' });
  }
};

// @desc    Add a menu item to a restaurant
// @route   POST /api/restaurants/:id/menu
const addMenuItem = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (restaurant) {
      const { name, price, description, image } = req.body;
      
      const newItem = {
        name,
        price,
        description,
        image,
        isVeg: false
      };

      restaurant.menu.push(newItem);
      await restaurant.save();
      res.status(201).json(restaurant);
    } else {
      res.status(404).json({ message: 'Restaurant not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { 
  getRestaurants, 
  getRestaurantById, 
  addRestaurant, 
  addMenuItem 
};