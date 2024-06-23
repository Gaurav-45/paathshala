import React, { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import Home from "./components/Home/Home";
import TopNav from "./components/TopNav/TopNav";
import CourseDeatils from "./components/CourseDetails/CourseDeatils";
import Explore from "./components/Explore/Explore";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import MyCourse from "./components/MyCourse/MyCourse";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={`app_container ${isSidebarOpen ? "sidebar_open" : ""}`}>
      <ToastContainer />
      <SideBar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className={`overlay ${isSidebarOpen ? "show" : ""}`}
        onClick={closeSidebar}
      ></div>
      <div className="app">
        <TopNav toggleSidebar={toggleSidebar} />
        <div className="right_container_content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/course/:id" element={<CourseDeatils />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/mycourse" element={<MyCourse />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
