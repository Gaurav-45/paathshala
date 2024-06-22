import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import CourseCard from "../CourseCard/CourseCard";
import Explore from "../Explore/Explore";
import MyCourse from "../MyCourse/MyCourse";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user } = useAuth();
  return (
    <div className="home_container">
      <div className="home_banner">
        <h1>PaathShala Learning platform</h1>
      </div>
      {user && <MyCourse isHomeComponent={true} />}
      <Explore isHomeComponent={true} />
    </div>
  );
};

export default Home;
