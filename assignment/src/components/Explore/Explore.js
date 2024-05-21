import React, { useEffect, useState } from "react";
import CourseCard from "../CourseCard/CourseCard";
import { Link } from "react-router-dom";
import axios from "axios";

const Explore = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    axios
      .get(
        "/api/getall"
      )
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="my_course">
      <div className="course_section_title">
        <h3>Explore</h3>
        <Link to="explore">
          <p>View all</p>
        </Link>
      </div>
      <div className="course_section_content">
        {courses.map((course, index) => (
          <CourseCard course={course} />
        ))}

        {/* <CourseCard /> */}
        {/* <CourseCard />
          <CourseCard /> */}
      </div>
    </div>
  );
};

export default Explore;
