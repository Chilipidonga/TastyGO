const mongoose = require('mongoose');

const menuItemSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  image: { type: String },
  isVeg: { type: Boolean, default: false }
});

const restaurantSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    restaurantName: { type: String, required: true },
    cuisine: { type: String, required: true },
    address: { type: String, required: true },
    // 🌍 NEW: GEOSPATIAL DATA
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], index: '2dsphere' } // [Longitude, Latitude]
    },
    menu: [menuItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Restaurant', restaurantSchema);