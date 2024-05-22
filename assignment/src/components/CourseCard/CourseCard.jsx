import React from "react";
import "./CourseCard.css";
import { Link } from "react-router-dom";

const CourseCard = (course) => {
  return (
    <Link to={`/course/${course.course._id}`}>
      <div className="course_card_container">
        <img className="course_image" src={course.course.coverImage} alt="" />
        <h4>{course.course.title}</h4>
        <p className="course_desc">
          {course.course.description.slice(0, 150)}...
        </p>
        <div className="course_tags">
          {course.course.category.map((item, index) => (
            <p key={index} className="course">
              {item}
            </p>
          ))}
        </div>
        <p className="course_price">
          <b>RS. {course.course.price}</b>
        </p>
      </div>
    </Link>
  );
};

export default CourseCard;
