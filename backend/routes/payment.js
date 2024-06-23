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

// Function to load HTML template
const loadTemplate = (filePath) => {
  const resolvedPath = path.resolve(__dirname, filePath);
  if (fs.existsSync(resolvedPath)) {
    return fs.readFileSync(resolvedPath, "utf8");
  } else {
    throw new Error(`Template file not found: ${resolvedPath}`);
  }
};

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true,
});

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

    // Load email template
    const htmlTemplate = loadTemplate(
      "../mailTemplates/paymentConfirmation.html"
    );

    // Replace placeholders with actual values
    if (status == "Success") {
      const htmlContent = htmlTemplate
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
