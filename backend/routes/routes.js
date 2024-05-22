const express = require("express");

const router = express.Router();
const Course = require("../models/courseModel");
const User = require("../models/userModel");
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

router.post("/loginn", async (req, res) => {
  const { email, password } = req.body;

  try {
    res.status(200).json({ message: "Working fine" });
  } catch (error) {
    res.status(400).json({ message: error });
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

// Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = new User({ name, email, password });

    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Login a user
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error });
  }
});

// Enroll in a course
router.post("/enroll/:courseId", protect, async (req, res) => {
  const userId = req.body.userId;
  const { courseId } = req.params;

  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (user.enrolledCourses.includes(courseId)) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    user.enrolledCourses.push(courseId);
    await user.save();

    res.status(200).json({
      message: "Enrolled successfully",
      enrolledCourses: user.enrolledCourses,
    });
  } catch (error) {
    console.error("Error enrolling in course:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//get all enrolled courses
router.post("/enrolled", protect, async (req, res) => {
  const userId = req.body.userId;

  try {
    const user = await User.findById(userId).populate("enrolledCourses");

    res.status(200).json(user.enrolledCourses);
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
