const express = require("express");
const Razorpay = require("razorpay");
const shortid = require("shortid");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const Course = require("../models/courseModel");
const User = require("../models/userModel");
const { generateToken, protect } = require("../authMiddleware");
const { paymentConfirmationTemplate } = require("../mailTemplates/template");

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true,
});

//API to create order id for razorpay payment
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
    console.log(response);
    return res.status(201).json(response);
  } catch (err) {
    console.error("Razorpay error:", err);
    return res.status(400).json({ error: err.message });
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

    // Replace placeholders with actual values
    if (status == "Success") {
      const htmlContent = paymentConfirmationTemplate
        .replace("{{userName}}", req.user.name)
        .replace("{{paymentAmount}}", currency + " " + amount)
        .replace("{{courseTitle}}", courseName)
        .replace("{{transactionId}}", paymentId);

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: "Payment Confirmation",
        html: htmlContent,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
        } else {
          console.log("Email sent:", info.response);
        }
      });
    }

    user.payments.push(newPayment);

    await user.save();

    res.status(201).json({ message: "Payment details added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
