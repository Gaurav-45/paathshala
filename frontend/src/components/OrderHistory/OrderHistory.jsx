import React, { useEffect, useState } from "react";
import "./OrderHistory.css";
import OrderHistoryCard from "./OrderHistoryCard";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
const API_ENDPOINT = process.env.REACT_APP_BACKEND_URL;

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loader, setLoader] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      axios
        .post(
          `${API_ENDPOINT}/api/getpayment`,
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.data.token}`,
            },
          }
        )
        .then((response) => {
          setOrders(response.data);
          setLoader(!loader);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, []);

  return (
    <div className="order_history_container">
      <div className="course_section_title">
        <h3>Order history</h3>
      </div>
      {user ? (
        <>
          {loader ? (
            <img className="loading_container" src="/load.gif" alt="" />
          ) : (
            <div className="order_history">
              {orders.map((order, key) => {
                return <OrderHistoryCard data={order} key={key} />;
              })}
            </div>
          )}
        </>
      ) : (
        <p className="sign_in_enroll">Please Signin to view enrolled courses</p>
      )}
    </div>
  );
};

export default OrderHistory;
