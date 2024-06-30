import React from "react";
import "./CourseCard.css";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

// Component to display progress bar
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#00D100",
  },
}));

const CourseCard = ({ course, lesson = null, enrolledCourse = false }) => {
  // Get percentage of complted course from lesson completed information
  const calculateCompletePercent = (lesson) => {
    let precent = 0;
    lesson.map((item, key) => {
      precent += item.completed ? 1 : 0;
    });

    return (precent / lesson.length) * 100;
  };
  return (
    <Link to={`/course/${course._id}`}>
      <div className="course_card_container">
        <img className="course_image" src={course.coverImage} alt="" />
        <h4>{course.title}</h4>
        <p className="course_desc">{course.description.slice(0, 150)}...</p>
        <div className="course_tags">
          {course.category.map((item, index) => (
            <p key={index} className="course">
              {item}
            </p>
          ))}
        </div>
        <p className="course_price">
          <b>RS. {course.price}</b>
        </p>
        {enrolledCourse == true && (
          <div>
            <p className="progress_text">
              You've completed {calculateCompletePercent(lesson).toFixed(2)}%
            </p>
            <BorderLinearProgress
              variant="determinate"
              value={calculateCompletePercent(lesson)}
            />
          </div>
        )}
      </div>
    </Link>
  );
};

export default CourseCard;
