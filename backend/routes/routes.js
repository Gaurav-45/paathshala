const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Course = require("../models/courseModel");
const { generateToken, protect } = require("../authMiddleware");

//post a course
router.post("/post", async (req, res) => {
  const data = new Course({
    title: req.body.title,
    coverImage: req.body.coverImage,
    description: req.body.description,
    instructor: req.body.instructor,
    category: req.body.category,
    lessons: req.body.lessons,
    price: req.body.price,
    rating: req.body.rating,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Get all courses
router.get("/getAll", async (req, res) => {
  try {
    const data = await Course.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get course by ID
router.get("/get/:id", async (req, res) => {
  try {
    const data = await Course.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update course details by ID
router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await Course.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete course by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await Course.findByIdAndDelete(id);
    res.send(`Document deleted successfully`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
