import React, { useEffect, useState } from "react";
import "./CourseDeatils.css";
import Accordion from "@mui/material/Accordion";
import AccordionActions from "@mui/material/AccordionActions";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import { styled } from "@mui/material/styles";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import LessonAccordian from "../LessonAccordian/LessonAccordian";
const API_ENDPOINT = process.env.REACT_APP_BACKEND_URL;

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#00D100",
  },
}));

const CourseDeatils = () => {
  const arr = ["Frontend", "Backend"];
  const [course, setCourse] = useState({});
  const [tags, setTags] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loader, setLoader] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const calculateCompletePercent = (lesson) => {
    let precent = 0;
    lesson.map((item, key) => {
      precent += item.completed ? 1 : 0;
    });

    return (precent / lesson.length) * 100;
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";

      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const makePayment = async () => {
    if (!user) {
      toast.error("Sign in to enroll course", {
        position: "bottom-center",
      });
      return;
    }
    const res = await initializeRazorpay();

    if (!res) {
      alert("Razorpay SDK Failed to load");
      return;
    }

    axios
      .post(
        `${API_ENDPOINT}/api/createorder`,
        {
          amount: course.price,
          currency: "INR",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      )
      .then((res) => {
        const data = res.data;
        var options = {
          key: process.env.RAZORPAY_KEY, // Enter the Key ID generated from the Dashboard
          name: "Gaurav Parulekar Pvt Ltd",
          currency: data.currency,
          amount: data.amount,
          order_id: data.id,
          description: "This is demo payment for course enrollment",
          image: "/book_logo.png",
          handler: function (response) {
            let body = {
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              amount: course.price,
              currency: "INR",
              status: "Success",
              courseId: id,
              courseName: course.title,
            };
            addPaymentDetails(body);
          },
          modal: {
            ondismiss: function () {
              let body = {
                paymentId: null,
                orderId: data.id,
                amount: course.price,
                currency: "INR",
                status: "Cancelled",
                courseId: id,
                courseName: course.title,
              };
              addPaymentDetails(body);
            },
          },
          prefill: {
            name: user.data.name,
            email: user.data.email,
          },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      })
      .catch((error) => {
        console.log(error);
        toast.error(error, {
          position: "bottom-center",
        });
      });
  };

  useEffect(() => {
    if (user) {
      axios
        .get(`${API_ENDPOINT}/api/checkenrollment/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.data.token}`,
          },
        })
        .then((response) => {
          if (response.data.isEnrolled) {
            axios
              .get(`${API_ENDPOINT}/api/getenrolled/${id}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${user.data.token}`,
                },
              })
              .then((response) => {
                setCourse(response.data);
                setTags(response.data.category);
                setLessons(response.data.lessons);
                setLoader(!loader);
                setIsEnrolled(true);
              })
              .catch((error) => {
                console.error(error);
              });
          } else {
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
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
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
    }
  }, []);

  const addPaymentDetails = (body) => {
    axios
      .post(`${API_ENDPOINT}/api/addpayment`, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.data.token}`,
        },
      })
      .then(() => {
        if (body.status == "Success") handleEnroll();
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "bottom-center",
        });
      });
  };

  const handleEnroll = () => {
    if (!user) {
      toast.error("Sign in to enroll course", {
        position: "bottom-center",
      });
      return;
    }
    axios
      .post(
        `${API_ENDPOINT}/api/enroll/${id}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.data.token}`,
          },
        }
      )
      .then(() => {
        toast.success("Enrolled successfully", {
          position: "bottom-center",
        });
        navigate("/mycourse");
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "bottom-center",
        });
      });
  };

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
              {isEnrolled && (
                <div className="course_enrolled_progress">
                  <p className="progress_text">
                    You've completed{" "}
                    {calculateCompletePercent(lessons).toFixed(2)}%
                  </p>
                  <BorderLinearProgress
                    variant="determinate"
                    value={calculateCompletePercent(lessons)}
                  />
                </div>
              )}
            </div>
            <div className="course_enroll">
              <p className="course_enroll_price">Rs. {course.price}</p>
              <button
                className="course_enroll_button"
                onClick={makePayment}
                disabled={isEnrolled}
              >
                {isEnrolled ? "Already Enrolled" : "Enroll Now"}
              </button>
            </div>
          </div>
          <div className="course_content">
            <h3>Course content</h3>
            {lessons.map((lesson, index) => (
              <LessonAccordian lesson={lesson} index={index} courseId={id} />
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default CourseDeatils;
