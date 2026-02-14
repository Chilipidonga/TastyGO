const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');

// 1. Hardcode Keys Here
const KEY_ID = "rzp_test_RlBPbp16cWLVda";
const KEY_SECRET = "nmjMyUIeKfOpZ88stp7uOv54";

const razorpay = new Razorpay({
  key_id: KEY_ID,
  key_secret: KEY_SECRET,
});

// @route   POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Payment creation failed" });
  }
});

// @route   GET /api/payment/get-key
router.get('/get-key', (req, res) => {
  // 2. SEND THE HARDCODED KEY TO FRONTEND
  res.json({ key: KEY_ID }); 
});

module.exports = router;