import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { Form } from 'react-bootstrap';
import './ScheduleList.css';

export default function ScheduleList() {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [filterOption, setFilterOption] = useState('upcoming');

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const res = await axiosInstance.get('/schedule');
        setSchedules(res.data);
      } catch (err) {
        console.error('스케줄 목록 조회 실패:', err);
        alert('스케줄 목록을 불러올 수 없습니다.');
      }
    };

    fetchSchedules();
  }, []);

  const handleAddSchedule = () => {
    navigate('/schedule/create');
  };

  const handleViewDetail = (id) => {
    navigate(`/schedule/${id}`);
  };

  const filteredSchedules = schedules
    .filter((schedule) => {
      const now = new Date();
      const start = new Date(schedule.startDatetime);
      return filterOption === 'upcoming' ? start > now : start < now;
    })
    .sort((a, b) => new Date(a.startDatetime) - new Date(b.startDatetime));

  return (
    <div className="container py-4">
      {/* ✅ 상단 헤더: 제목 왼쪽 / 필터 + 버튼 오른쪽 */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        {/* 왼쪽: 제목 */}
        <h3 className="fw-bold mb-0">스케줄 조회</h3>

        {/* 오른쪽: 필터 메뉴 + 일정 추가 버튼 */}
{/*         <div className="d-flex align-items-center gap-2"> */}
{/*           <Form.Select */}
{/*             value={filterOption} */}
{/*             onChange={(e) => setFilterOption(e.target.value)} */}
{/*             style={{ maxWidth: '125px' }} */}
{/*           > */}
{/*             <option value="upcoming">다가올 일정</option> */}
{/*             <option value="past">지난 일정</option> */}
{/*           </Form.Select> */}

{/*           <button className="custom-add-button" onClick={handleAddSchedule}> */}
{/*             일정 추가 */}
{/*           </button> */}
{/*         </div> */}
{/*       </div> */}

<div className="d-flex align-items-center">
  {/* 필터 메뉴: 왼쪽으로 살짝 이동 */}
  <Form.Select
    value={filterOption}
    onChange={(e) => setFilterOption(e.target.value)}
    style={{
      maxWidth: '125px',
      marginRight: '32px', // ✅ 버튼과의 간격 (탭만큼)
    }}
  >
    <option value="upcoming">다가올 일정</option>
    <option value="past">지난 일정</option>
  </Form.Select>

  {/* 일정 추가 버튼 */}
 <button
   className="custom-add-button"
   onClick={handleAddSchedule}
   style={{
     width: '120px',           // ✅ 너비 늘림 (기존 120px → 160px)
   }}
 >
   일정 추가
 </button>

</div>
</div>

      {/* ✅ 일정 목록 */}
      <div className="row gy-3">
        {filteredSchedules.length === 0 ? (
          <p className="text-muted">
            {filterOption === 'upcoming' ? '다가올 일정이 없습니다.' : '지난 일정이 없습니다.'}
          </p>
        ) : (
          filteredSchedules.map((schedule) => (
            <div key={schedule.id} className="col-12">
              <div className="p-3 border rounded shadow-sm schedule-card">
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                  <div>
                    <h5 className="fw-semibold mb-1">{schedule.title}</h5>
                    <p className="mb-0 text-muted">
                      {formatDate(schedule.startDatetime)} {formatTime(schedule.startDatetime)} | {schedule.location}
                    </p>
                  </div>
                  <button
                    className="custom-back-button mt-3 mt-md-0"
                    onClick={() => handleViewDetail(schedule.id)}
                  >
                    상세 보기
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ✅ 날짜/시간 포맷 함수
const formatDate = (datetime) => new Date(datetime).toLocaleDateString('ko-KR');
const formatTime = (datetime) => new Date(datetime).toLocaleTimeString('ko-KR', {
  hour: '2-digit',
  minute: '2-digit',
});
