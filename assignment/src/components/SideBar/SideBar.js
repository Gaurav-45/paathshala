import React from "react";
import "./SideBar.css";
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  return (
    <div className="side_nav_container">
      <div className="side_nav">
        <img className="sidebar_logo" src="./karmayogiLogo.png" alt="" />
        <div className="nav_points">
          <ul className="nav_list">
            <Link to="">
              <li className={`nav_item ${currentPath === "/" ? "active" : ""}`}>
                <p>Home</p>
              </li>
            </Link>
            <Link to="mycourse">
              <li
                className={`nav_item ${
                  currentPath === "/mycourse" ? "active" : ""
                }`}
              >
                <p>My courses</p>
              </li>
            </Link>
            <Link to="explore">
              <li
                className={`nav_item ${
                  currentPath === "/explore" || currentPath.includes("/course")
                    ? "active"
                    : ""
                }`}
              >
                <p>Explore</p>
              </li>
            </Link>
            <Link to="learn">
              <li
                className={`nav_item ${
                  currentPath === "/learn" ? "active" : ""
                }`}
              >
                <p>Learn</p>
              </li>
            </Link>
            <Link to="project">
              <li
                className={`nav_item ${
                  currentPath === "/project" ? "active" : ""
                }`}
              >
                <p>Projects</p>
              </li>
            </Link>
            <Link to="career">
              <li
                className={`nav_item ${
                  currentPath === "/career" ? "active" : ""
                }`}
              >
                <p>Career</p>
              </li>
            </Link>
            <Link to="mentorship">
              <li
                className={`nav_item ${
                  currentPath === "/mentorship" ? "active" : ""
                }`}
              >
                <p>Mentorship</p>
              </li>
            </Link>
            <Link to="blogs">
              <li
                className={`nav_item ${
                  currentPath === "/blogs" ? "active" : ""
                }`}
              >
                <p>Blogs</p>
              </li>
            </Link>
            <Link to="community">
              <li
                className={`nav_item ${
                  currentPath === "/community" ? "active" : ""
                }`}
              >
                <p>Community</p>
              </li>
            </Link>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
