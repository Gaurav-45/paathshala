import React from "react";
import "./OrderHistory.css";

const OrderHistoryCard = ({ data }) => {
  return (
    <div className="order_history_card_container">
      <div className="card_item">
        <h4>{data.courseName}</h4>
        <p>Payment ID: {data.paymentId}</p>
      </div>
      <div className="card_item">
        <h4>{data.currency + " " + data.amount}</h4>
        <p>Date: {data.date}</p>
      </div>
      <div
        className={`card_item ${
          data.status == "Success" ? "success" : "cancelled"
        }`}
      >
        <p>
          <b>{data.status}</b>
        </p>
      </div>
    </div>
  );
};

export default OrderHistoryCard;
