import axios from "axios";
import { toast } from "react-toastify";
const API_ENDPOINT = process.env.REACT_APP_BACKEND_URL;

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

export const makePayment = async (course, user, courseId, handleEnroll) => {
  // Check if  user is logged in
  if (!user) {
    toast.error("Sign in to enroll course", { position: "bottom-center" });
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
        key: process.env.REACT_APP_RAZORPAY_KEY,
        name: "Paathshala Pvt Ltd",
        currency: data.currency,
        amount: data.amount,
        order_id: data.id,
        description: "This is demo payment for course enrollment",
        image: "/book_logo.png",
        handler: function (response) {
          const paymentDetails = {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            amount: course.price,
            currency: "INR",
            status: "Success",
            courseId,
            courseName: course.title,
          };
          addPaymentDetails(paymentDetails, user, handleEnroll);
        },
        modal: {
          // Cancel payment handeling
          ondismiss: function () {
            const paymentDetails = {
              paymentId: null,
              orderId: data.id,
              amount: course.price,
              currency: "INR",
              status: "Cancelled",
              courseId,
              courseName: course.title,
            };
            addPaymentDetails(paymentDetails, user, handleEnroll);
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
      console.error(error);
      toast.error(error.message, { position: "bottom-center" });
    });
};

export const addPaymentDetails = (body, user, handleEnroll) => {
  axios
    .post(`${API_ENDPOINT}/api/addpayment`, body, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.data.token}`,
      },
    })
    .then(() => {
      if (body.status === "Success") handleEnroll();
    })
    .catch((error) => {
      toast.error(error.response.data.message, { position: "bottom-center" });
    });
};
