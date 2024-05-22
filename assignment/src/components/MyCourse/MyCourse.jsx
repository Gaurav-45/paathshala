import React, { useEffect, useState } from "react";
import CourseCard from "../CourseCard/CourseCard";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
const API_ENDPOINT = process.env.REACT_APP_BACKEND_URL;

const MyCourse = ({ isHomeComponent = false }) => {
  const [courses, setCourses] = useState([]);
  const [loader, setLoader] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      axios
        .post(
          `${API_ENDPOINT}/api/enrolled`,
          { userId: user.data._id },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NGRlMDU1M2JiOGNhNTliNWY4OTIyZSIsImlhdCI6MTcxNjM4MTM5OSwiZXhwIjoxNzE4OTczMzk5fQ.WxKBGJRHjUzh7oy8CGiD-yabCdfzLHLg_shVBJGPT8A`,
            },
          }
        )
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
    }
  }, []);

  return (
    <div className="my_course">
      <div className="course_section_title">
        <h3>My Courses</h3>
        {isHomeComponent && (
          <Link to="explore">
            <p>View all</p>
          </Link>
        )}
      </div>
      {loader ? (
        <p className="loading_container">Fetching data</p>
      ) : (
        <>
          {courses.length == 0 ? (
            <p className="loading_container">No course enrolled yet</p>
          ) : (
            <div className="course_section_content">
              {courses.map((course, index) => (
                <CourseCard course={course} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyCourse;
