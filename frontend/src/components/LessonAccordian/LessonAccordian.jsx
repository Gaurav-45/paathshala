import React, { useEffect, useState } from "react";
import "./LessonAccordian.css";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import "../CourseDetails/CourseDeatils.css";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import axios from "axios";
import YotTubePlayer from "./YotTubePlayer";
const API_ENDPOINT = process.env.REACT_APP_BACKEND_URL;

const LessonAccordian = ({ lesson, index, courseId }) => {
  //   const { courseId } = useParams();
  const { user } = useAuth();
  const [userNotes, setUserNotes] = useState(lesson.note ? lesson.note : "");
  const [isNotePresent, setIsNotePresent] = useState(
    lesson.note ? (lesson.note.length > 0 ? true : false) : false
  );
  const [isCompleted, setIsCompleted] = useState(lesson.completed);

  // useEffect(() => {}, [isCompleted]);

  const markCompleted = (lessonId) => {
    if (user) {
      axios
        .post(
          `${API_ENDPOINT}/api/markcompleted/${courseId}/${lessonId}`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.data.token}`,
            },
          }
        )
        .then((res) => {
          setIsCompleted(true);
          toast.success(res.data.message, {
            position: "bottom-center",
          });
        })
        .catch((error) => {
          toast.error(error.response.data.message, {
            position: "bottom-center",
          });
        });
    }
  };

  const handleAddNote = (lessonId) => {
    if (!user) {
      toast.error("Please signin to add note", {
        position: "bottom-center",
      });
    } else if (userNotes.length == 0) {
      toast.error("Please write a note to add", {
        position: "bottom-center",
      });
    } else {
      axios
        .post(
          `${API_ENDPOINT}/api/addnote/${courseId}/${lessonId}`,
          {
            note: userNotes,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.data.token}`,
            },
          }
        )
        .then(() => {
          toast.success("Note added successfully", {
            position: "bottom-center",
          });
        })
        .catch((error) => {
          toast.error(error.response.data.message, {
            position: "bottom-center",
          });
        });
    }
  };
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
            {isCompleted ? (
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
        {/* <iframe className="course_module_video" src={lesson.videoUrl}></iframe> */}
        <YotTubePlayer
          videoUrl={lesson.videoUrl}
          onVideoEnd={() => markCompleted(lesson._id)}
        />
        <div className="lesson_notes">
          <textarea
            name="notes"
            id="notes"
            rows={5}
            placeholder="Add a note for lesson"
            value={userNotes}
            onChange={(e) => setUserNotes(e.target.value)}
          ></textarea>
          <button
            className="lesson_notes_submit_button"
            onClick={() => handleAddNote(lesson._id)}
          >
            {isNotePresent ? "Update Note" : "Add Note"}
          </button>
        </div>
      </AccordionDetails>
    </Accordion>
  );
};

export default LessonAccordian;
