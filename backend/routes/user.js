const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Course = require("../models/courseModel");
const User = require("../models/userModel");
const { generateToken, protect } = require("../authMiddleware");
const { enrollConfirmationTemplate } = require("../mailTemplates/template");

const transporter = nodemailer.createTransport({
  port: 465,
  host: "smtp.gmail.com",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  secure: true,
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

//Enroll into new course
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

    // Replace placeholders with actual values
    const htmlContent = enrollConfirmationTemplate
      .replace("{{userName}}", user.name)
      .replace("{{courseTitle}}", course.title);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Course Enrollment Confirmation",
      html: htmlContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

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

//API to add note for lesson
router.post("/addnote/:courseId/:lessonId", protect, async (req, res) => {
  const courseId = req.params.courseId;
  const lessonId = req.params.lessonId;
  const { note } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const courseProgress = user.enrolledCourses.find(
      (course) => course.courseId.toString() === courseId
    );

    if (!courseProgress) {
      return res
        .status(404)
        .json({ message: "Please enroll in the course to add a note" });
    }

    const lessonProgress = courseProgress.lessons.find(
      (lesson) => lesson.lessonId.toString() === lessonId
    );

    if (!lessonProgress) {
      return res
        .status(404)
        .json({ message: "Lesson not found in enrolled course" });
    }

    lessonProgress.note = note;

    await user.save();

    res
      .status(200)
      .json({ message: "Note added successfully", lessonProgress });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

//Check if user is enrolled in course
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

//API to mark lesson as completed
router.post("/markcompleted/:courseId/:lessonId", protect, async (req, res) => {
  const courseId = req.params.courseId;
  const lessonId = req.params.lessonId;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const courseProgress = user.enrolledCourses.find(
      (course) => course.courseId.toString() === courseId
    );

    if (!courseProgress) {
      return res
        .status(404)
        .json({ message: "Please enroll in the course to mark completed" });
    }

    const lessonProgress = courseProgress.lessons.find(
      (lesson) => lesson.lessonId.toString() === lessonId
    );

    if (!lessonProgress) {
      return res
        .status(404)
        .json({ message: "Lesson not found in enrolled course" });
    }

    lessonProgress.completed = true;

    await user.save();

    res.status(200).json({
      message: "Congratulations!!! You've completed the lesson",
      lessonProgress,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// API to fetch all payment details
//get all enrolled courses
router.post("/getpayment", protect, async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId).select("payments");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Sort payments by date in descending order
    const sortedPayments = user.payments.sort((a, b) => b.date - a.date);

    res.status(200).json(sortedPayments);
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});
module.exports = router;
