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
/*router.post("/enroll/:courseId", protect, async (req, res) => {
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
});*/

router.post("/enroll/:courseId", protect, async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.params;

  try {
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (
      user.enrolledCourses.some(
        (courseProgress) => courseProgress.courseId.toString() === courseId
      )
    ) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    const lessonsProgress = course.lessons.map((lesson) => ({
      lessonId: lesson._id,
      completed: false,
      note: "",
    }));

    user.enrolledCourses.push({ courseId, lessons: lessonsProgress });
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
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).populate(
      "enrolledCourses.courseId"
    );

    res.status(200).json(user.enrolledCourses);
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//Endpoint to get enrolled course details
router.get("/getenrolled/:id", protect, async (req, res) => {
  const courseId = req.params.id;
  const userId = req.user._id;

  try {
    const course = await Course.findById(courseId).lean();

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    let userProgress = null;

    if (userId) {
      const user = await User.findById(userId).lean();

      if (user) {
        const userCourseProgress = user.enrolledCourses.find(
          (courseProgress) => courseProgress.courseId.toString() === courseId
        );

        if (userCourseProgress) {
          const lessonsWithProgress = course.lessons.map((lesson) => {
            const lessonProgress = userCourseProgress.lessons.find(
              (progress) =>
                progress.lessonId.toString() === lesson._id.toString()
            );
            return {
              ...lesson,
              completed: lessonProgress ? lessonProgress.completed : false,
              note: lessonProgress ? lessonProgress.note : "",
            };
          });

          course.lessons = lessonsWithProgress;
        }
      }
    }

    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Check if user is enrolled in a particular course
router.get("/checkenrollment/:courseId", protect, async (req, res) => {
  const courseId = req.params.courseId;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isEnrolled = user.enrolledCourses.some(
      (courseProgress) => courseProgress.courseId.toString() === courseId
    );

    res.status(200).json({ isEnrolled });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
