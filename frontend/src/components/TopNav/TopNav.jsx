import React from "react";
import "./TopNav.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const TopNav = ({ toggleSidebar }) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogOut = () => {
    logout();
  };
  return (
    <div className="top_nav_container">
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
      {!(currentPath.includes("login") || currentPath.includes("register")) && (
        <>
          <p className="user_name">Hi {user ? user.data.name : ""}</p>
          {user ? (
            <div className="logged_in_user">
              <img
                className="profile_pic"
                src={`https://ui-avatars.com/api/?name=${
                  user ? user.data.name : "U"
                }&background=271FE0&color=fff`}
                alt="profile pic"
              />
              <button className="top_nav_button" onClick={handleLogOut}>
                Log Out
              </button>
            </div>
          ) : (
            <div className="new_user">
              <button
                onClick={() => navigate("/login")}
                className="top_nav_button"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/register")}
                className="top_nav_button"
              >
                Sign Up
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default TopNav;
