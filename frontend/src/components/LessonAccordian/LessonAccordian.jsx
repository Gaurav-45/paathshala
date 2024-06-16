import React from "react";
import "./LessonAccordian.css";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../CourseDetails/CourseDeatils.css";

const LessonAccordian = ({ lesson, index }) => {
  return (
    <Accordion defaultExpanded={index == 0} key={index}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1-content"
        id="panel1-header"
      >
        <div className="lesson_title">
          <p className="lesson_title_text">{lesson.title}</p>
          <div>
            {lesson.completed ? (
              <div className="lesson_completed_container">
                <img className="lesson_completed" src="/check.png" alt="" />
                <p>Completed</p>
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <p className="module_desc">{lesson.content}</p>
        <iframe className="course_module_video" src={lesson.videoUrl}></iframe>
      </AccordionDetails>
    </Accordion>
  );
};

export default LessonAccordian;
