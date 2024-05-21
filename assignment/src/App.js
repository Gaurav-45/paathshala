import "./App.css";
import { Routes, Route } from "react-router-dom";
import SideBar from "./components/SideBar/SideBar";
import Home from "./components/Home/Home";
import TopNav from "./components/TopNav/TopNav";
import CourseDeatils from "./components/CourseDetails/CourseDeatils";

function App() {
  return (
    <div className="app_container">
      <SideBar />
      <div className="app">
        <TopNav />
        <div className="right_container_content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/course/:id" element={<CourseDeatils />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
