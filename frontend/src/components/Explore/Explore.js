import React, { useEffect, useState } from "react";
import CourseCard from "../CourseCard/CourseCard";
import { Link } from "react-router-dom";
import axios from "axios";
const API_ENDPOINT = process.env.REACT_APP_BACKEND_URL;

const Explore = ({ isHomeComponent = false }) => {
  const [courses, setCourses] = useState([]);
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/api/getall`)
      .then((response) => {
        if (isHomeComponent) {
          setCourses(response.data.slice(0, 3));
          setLoader(!loader);
        } else {
          setCourses(response.data);
          setLoader(!loader);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="my_course">
      <div className="course_section_title">
        <h3>Explore</h3>
        {isHomeComponent && (
          <Link to="explore">
            <p>View all</p>
          </Link>
        )}
      </div>
      {loader ? (
        <img className="loading_container" src="/load.gif" alt="" />
      ) : (
        <div className="course_section_content">
          {courses.map((course, index) => (
            <CourseCard course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Explore;
