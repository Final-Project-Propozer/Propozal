import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ScheduleList.css';

const schedules = [
  {
    title: '○○사 식재료 발주 관련 미팅',
    date: '2025-08-07',
    time: '09:00',
    location: '○○사 대표 ○○○',
  },
  {
    title: '□□□사 인테리어 관련 자재 발주 회의',
    date: '2025-08-07',
    time: '13:00',
    location: '□□□사 대리 □□□',
  },
  {
    title: '사내 월간 회의 및 부서 정리',
    date: '2025-08-09',
    time: '11:00',
    location: '사내 대형 회의실',
  },
   {
      title: '○○사 식재료 발주 관련 미팅',
      date: '2025-08-07',
      time: '09:00',
      location: '○○사 대표 ○○○',
    },
    {
      title: '□□□사 인테리어 관련 자재 발주 회의',
      date: '2025-08-07',
      time: '13:00',
      location: '□□□사 대리 □□□',
    },
    {
      title: '사내 월간 회의 및 부서 정리',
      date: '2025-08-09',
      time: '11:00',
      location: '사내 대형 회의실',
    },
 {
    title: '○○사 식재료 발주 관련 미팅',
    date: '2025-08-07',
    time: '09:00',
    location: '○○사 대표 ○○○',
  },
  {
    title: '□□□사 인테리어 관련 자재 발주 회의',
    date: '2025-08-07',
    time: '13:00',
    location: '□□□사 대리 □□□',
  },
  {
    title: '사내 월간 회의 및 부서 정리',
    date: '2025-08-09',
    time: '11:00',
    location: '사내 대형 회의실',
  },
];

export default function ScheduleList() {
  const navigate = useNavigate();

  const handleAddSchedule = () => {
    navigate('/schedule/create');
  };

  const handleViewDetail = () => {
    navigate('/schedule/detail');
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">스케줄 조회</h3>
        <button className="custom-add-button" onClick={handleAddSchedule}>
          + 일정 추가
        </button>
      </div>

      <div className="row gy-3">
        {schedules.map((schedule, idx) => (
          <div key={idx} className="col-12">
            <div className="p-3 border rounded shadow-sm schedule-card">
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <div>
                  <h5 className="fw-semibold mb-1">{schedule.title}</h5>
                  <p className="mb-0 text-muted">
                    {schedule.date} {schedule.time} | {schedule.location}
                  </p>
                </div>
                <button
                  className="custom-back-button mt-3 mt-md-0"
                  onClick={handleViewDetail}
                >
                  상세 보기
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
