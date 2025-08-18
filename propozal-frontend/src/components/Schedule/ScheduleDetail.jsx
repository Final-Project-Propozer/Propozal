import React, { useEffect, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import './ScheduleCreate.css';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';

const ScheduleDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ URL에서 ID 추출
  const [scheduleData, setScheduleData] = useState(null);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const res = await axiosInstance.get(`/schedule/${id}`);
        setScheduleData(res.data);
      } catch (err) {
        console.error('스케줄 조회 실패:', err);
        alert('스케줄 정보를 불러올 수 없습니다.');
        navigate('/schedule/list');
      }
    };

    fetchSchedule();
  }, [id, navigate]);

  const handleGoBack = () => {
    navigate('/schedule/list');
  };

  const handleEdit = () => {
    navigate(`/schedule/${id}/edit`); // ✅ 수정 페이지도 ID 포함
  };

  const handleDelete = async () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      try {
        await axiosInstance.delete(`/schedule/${id}`);
        alert('삭제되었습니다.');
        navigate('/schedule/list');
      } catch (err) {
        console.error('삭제 실패:', err);
        alert('삭제 중 오류가 발생했습니다.');
      }
    }
  };

  if (!scheduleData) return <div className="container py-4">로딩 중...</div>;

  return (
    <div className="container py-4">
      {/* 상단 제목 + 수정/삭제 버튼 */}
      <Row className="mb-4 align-items-center">
        <Col xs={6}>
          <h3 className="fw-bold m-0" style={{ color: '#3a5a40' }}>
            스케줄 상세 보기
          </h3>
        </Col>
        <Col xs={6} className="d-flex justify-content-end gap-2">
          <button className="custom-edit-button rounded-pill fw-semibold" onClick={handleEdit}>
            수정
          </button>
          <button className="custom-delete-button rounded-pill fw-semibold" onClick={handleDelete}>
            삭제
          </button>
        </Col>
      </Row>

      {/* 제목 */}
      <DetailRow label="제목" value={scheduleData.title} />

      {/* 일자 */}
      <DetailRow label="일자" icon={<FaRegCalendarAlt />} value={formatDate(scheduleData.startDatetime)} />

      {/* 시간 */}
      <DetailRow label="시간" icon={<FaRegClock />} value={formatTime(scheduleData.startDatetime)} />

      {/* 내용 */}
      <DetailRow label="내용" value={scheduleData.description} multiline />

      {/* 고객사 정보 */}
      {scheduleData.customer && <DetailRow label="고객사 정보" value={scheduleData.customer} />}

      {/* 알림 여부 */}
      <DetailRow label="알림 여부" value={scheduleData.notify ? '알림 설정됨' : '알림 없음'} />

      {/* 하단 버튼 */}
      <Row className="mt-4">
        <Col xs={12} className="d-flex justify-content-center">
          <button className="custom-back-button rounded-pill fw-semibold" onClick={handleGoBack}>
            목록으로 돌아가기
          </button>
        </Col>
      </Row>
    </div>
  );
};

// ✅ 공통 출력 컴포넌트
const DetailRow = ({ label, value, icon, multiline }) => (
  <div className="mb-3">
    <Row className="align-items-start">
      <Col xs={2}>
        <label className="form-label mb-0">{label}</label>
      </Col>
      <Col xs={10}>
        <div className="text-display" style={multiline ? { whiteSpace: 'pre-line' } : {}}>
          {icon && <span className="me-2">{icon}</span>}
          {value}
        </div>
      </Col>
    </Row>
  </div>
);

// ✅ 날짜/시간 포맷 함수
const formatDate = (datetime) => new Date(datetime).toLocaleDateString('ko-KR');
const formatTime = (datetime) => new Date(datetime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });

export default ScheduleDetail;
