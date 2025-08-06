// src/components/SalesMainPage/ScheduleBox.jsx
import React from "react";
import "./ScheduleBox.css";

const ScheduleBox = ({ date, time, description }) => {
  return (
    <div className="schedule-box-wrapper">
      <div className="schedule-date">{date}</div>
      <div className="schedule-detail">
        <div className="schedule-time">{time}</div>
        <div className="schedule-desc">{description}</div>
      </div>
    </div>
  );
};

export default ScheduleBox;
