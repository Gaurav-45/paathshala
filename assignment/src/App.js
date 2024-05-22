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
  return (
    <div className="app_container">
      <ToastContainer />
      <SideBar />
      <div className="app">
        <TopNav />
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
