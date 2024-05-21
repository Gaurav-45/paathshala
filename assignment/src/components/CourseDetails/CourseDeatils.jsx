import React, { useEffect, useState } from "react";
import "./CourseDeatils.css";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useParams } from "react-router-dom";
import axios from "axios";
const API_ENDPOINT = process.env.REACT_APP_BACKEND_URL;

const CourseDeatils = () => {
  const arr = ["Frontend", "Backend"];
  const [course, setCourse] = useState({});
  const [tags, setTags] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loader, setLoader] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`${API_ENDPOINT}/api/get/${id}`)
      .then((response) => {
        setCourse(response.data);
        setTags(response.data.category);
        setLessons(response.data.lessons);
        setLoader(!loader);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      {loader ? (
        <p className="loading_container">Fetching data</p>
      ) : (
        <div className="course_details_container">
          <h2>{course.title}</h2>
          <img src={course.coverImage} alt="" className="course_banner" />
          <div className="course_info_container">
            <div className="course_info">
              <p className="course_desc">{course.description}</p>
              <p>
                <span>
                  <b>Course Instructor: </b>
                  {course.instructor}
                </span>
              </p>
              <div className="course_skills">
                <p className="heading_margin_none">
                  <b>Skills: </b>
                </p>
                <div className="course_tags">
                  {tags.map((item, index) => (
                    <p key={index} className="course">
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
            <div className="course_enroll">
              <p className="course_enroll_price">Rs. {course.price}</p>
              <button className="course_enroll_button">Enroll Now</button>
            </div>
          </div>
          <div className="course_content">
            <h3>Course content</h3>
            {lessons.map((lesson, index) => (
              <Accordion defaultExpanded={index == 0} key={index}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  {lesson.title}
                </AccordionSummary>
                <AccordionDetails>
                  <p className="module_desc">{lesson.content}</p>
                  <iframe
                    className="course_module_video"
                    src={lesson.videoUrl}
                  ></iframe>
                </AccordionDetails>
              </Accordion>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CourseDeatils;
