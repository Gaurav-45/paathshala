import React from "react";
import "./TopNav.css";

const TopNav = () => {
  return (
    <div className="top_nav_container">
      {/* <div className="top_nav"> */}
      <p className="user_name">Hi Gaurav</p>
      <img
        className="profile_pic"
        src={`https://ui-avatars.com/api/?name=Gaurav+Parulekar&background=271FE0&color=fff`}
        alt="profile pic"
      />
      {/* </div> */}
    </div>
  );
};

export default TopNav;
