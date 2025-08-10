// src/components/SalesMainPage/ScheduleListGroup.jsx
import React from "react";
import ScheduleBox from "./ScheduleBox";
import "./ScheduleListGroup.css";

const ScheduleListGroup = () => {
  const nearestSchedule = {
    date: "2025-08-20",
    time: "09:00",
    description: "XX사 물품 관련 발주 회의 미팅",
  };

  const upcomingSchedules = [
    {
      date: "2025-08-21",
      time: "10:00",
      description: "OO사 서비스 계약 고객 전화 상담",
    },
    {
      date: "2025-08-21",
      time: "13:00",
      description: "□□사 견적 산출을 위한 출장",
    },
  ];

  return (
    <div className="schedule-list-group">
      <h5 className="fw-bold mb-3">가장 가까운 일정</h5>
      <ScheduleBox {...nearestSchedule} />

      <h5 className="fw-bold mt-4 mb-3">다가오는 일정</h5>
      <div className="upcoming-wrapper">
        {upcomingSchedules.map((item, idx) => (
          <ScheduleBox key={idx} {...item} />
        ))}
      </div>
    </div>
  );
};

export default ScheduleListGroup;
