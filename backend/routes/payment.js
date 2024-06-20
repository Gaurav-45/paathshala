const express = require("express");
const Razorpay = require("razorpay");
const shortid = require("shortid");
const router = express.Router();
const Course = require("../models/courseModel");
const User = require("../models/userModel");
const { generateToken, protect } = require("../authMiddleware");

router.post("/createorder", protect, async (req, res) => {
  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
  });

  const payment_capture = 1;
  const amount = req.body.amount;
  const currency = req.body.currency;
  const options = {
    amount: (amount * 100).toString(),
    currency,
    receipt: shortid.generate(),
    payment_capture,
  };

  try {
    const response = await razorpay.orders.create(options);
    res.status(200).json({
      id: response.id,
      currency: response.currency,
      amount: response.amount,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// Route to post payment details
router.post("/addpayment", protect, async (req, res) => {
  const userId = req.user._id;
  const { paymentId, orderId, amount, currency, status, courseId, courseName } =
    req.body;

  if (
    !userId ||
    !orderId ||
    !currency ||
    !amount ||
    !status ||
    !courseId ||
    !courseName
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const newPayment = {
      paymentId,
      orderId,
      amount,
      currency,
      status,
      courseId,
      courseName,
    };

    user.payments.push(newPayment);

    await user.save();

    res.status(201).json({ message: "Payment details added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
