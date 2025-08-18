import React, { useEffect, useState } from "react";
import ScheduleBox from "./ScheduleBox";
import axiosInstance from "../../api/axiosInstance";
import "./ScheduleListGroup.css";

const ScheduleListGroup = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await axiosInstance.get("/schedule");
        console.log("서버 응답:", response.data);
        const data = response.data;

        const now = new Date();
        const upcomingOnly = data.filter((schedule) => {
          const scheduleDateTime = new Date(schedule.startDatetime);
          return scheduleDateTime > now;
        });

        const sorted = upcomingOnly.sort((a, b) => {
          const dateA = new Date(a.startDatetime);
          const dateB = new Date(b.startDatetime);
          return dateA - dateB;
        });

        setSchedules(sorted.slice(0, 3));
      } catch (error) {
        console.error("일정 데이터를 불러오는 중 오류 발생:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const nearestSchedule = schedules[0];
  const upcomingSchedules = schedules.slice(1);

  const formatDate = (datetime) => new Date(datetime).toISOString().slice(0, 10);
  const formatTime = (datetime) => new Date(datetime).toTimeString().slice(0, 5);

  return (
    <div className="schedule-list-group">
      <h5 className="fw-bold mb-3">가장 가까운 일정</h5>
      {loading ? (
        <p>로딩 중...</p>
      ) : nearestSchedule ? (
        <ScheduleBox
          title={nearestSchedule.title}
          description={nearestSchedule.description}
          scheduleType={nearestSchedule.scheduleType}
          date={formatDate(nearestSchedule.startDatetime)}
          time={formatTime(nearestSchedule.startDatetime)}
        />
      ) : (
        <p className="text-muted">다가올 일정이 없습니다.</p>
      )}

      <h5 className="fw-bold mt-4 mb-3">다가오는 일정</h5>
      <div className="upcoming-wrapper">
        {loading ? (
          <p>로딩 중...</p>
        ) : upcomingSchedules.length > 0 ? (
          upcomingSchedules.map((item, idx) => (
            <ScheduleBox
              key={idx}
              title={item.title}
              description={item.description}
              scheduleType={item.scheduleType}
              date={formatDate(item.startDatetime)}
              time={formatTime(item.startDatetime)}
            />
          ))
        ) : (
          <p className="text-muted">추가 일정이 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default ScheduleListGroup;
