import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import CourseCard from "../CourseCard/CourseCard";
import Explore from "../Explore/Explore";

const Home = () => {
  return (
    <div className="home_container">
      <div className="home_banner">
        <h1>iGOT Learning platform</h1>
      </div>
      {/* <div className="my_course">
        <div className="course_section_title">
          <h3>My courses</h3>
          <Link to="mycourse">
            <p>View all</p>
          </Link>
        </div>
        <div className="course_section_content">
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </div>
      </div> */}
      <Explore />
    </div>
  );
};

export default Home;
