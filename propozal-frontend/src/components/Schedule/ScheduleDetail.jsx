import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ScheduleCreate.css';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';

const ScheduleDetail = () => {
  const navigate = useNavigate();

  const scheduleData = {
    title: '여름 프로모션 회의',
    date: '2025/08/15',
    time: '2:30 PM',
    content:
      '이번 여름 프로모션을 위한 전략 회의입니다. 주요 제품 라인업과 마케팅 방향을 논의합니다. 이번 여름 프로모션을 위한 전략 회의입니다. 주요 제품 라인업과 마케팅 방향을 논의합니다.이번 여름 프로모션을 위한 전략 회의입니다. 주요 제품 라인업과 마케팅 방향을 논의합니다.이번 여름 프로모션을 위한 전략 회의입니다. 주요 제품 라인업과 마케팅 방향을 논의합니다.이번 여름 프로모션을 위한 전략 회의입니다. 주요 제품 라인업과 마케팅 방향을 논의합니다.본문 내용 길어지면 화면에 텍스트 어떻게 출력되는지 테스트 중입니다. 이번 여름 프로모션을 위한 전략 회의입니다. 주요 제품 라인업과 마케팅 방향을 논의합니다.',
    customer: 'ABC 유통',
    notify: true,
  };

  const handleGoBack = () => {
    navigate('/schedule/list');
  };

  const handleEdit = () => {
    navigate('/schedule/edit'); // 필요 시 ID 기반 경로로 수정 가능
  };

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      // 삭제 로직 추가 예정
      alert('삭제되었습니다.');
      navigate('/schedule/list');
    }
  };

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
          <button
            className="custom-edit-button rounded-pill fw-semibold"
            onClick={handleEdit}
          >
            수정
          </button>
          <button
            className="custom-delete-button rounded-pill fw-semibold"
            onClick={handleDelete}
          >
            삭제
          </button>
        </Col>
      </Row>

      {/* 제목 */}
      <div className="mb-3">
        <Row className="align-items-center">
          <Col xs={2}>
            <label className="form-label mb-0">제목</label>
          </Col>
          <Col xs={10}>
            <div className="text-display">{scheduleData.title}</div>
          </Col>
        </Row>
      </div>

      {/* 일자 */}
      <div className="mb-3">
        <Row className="align-items-center">
          <Col xs={2}>
            <label className="form-label mb-0">일자</label>
          </Col>
          <Col xs={10}>
            <div className="text-display">
              <FaRegCalendarAlt className="me-2" />
              {scheduleData.date}
            </div>
          </Col>
        </Row>
      </div>

      {/* 시간 */}
      <div className="mb-3">
        <Row className="align-items-center">
          <Col xs={2}>
            <label className="form-label mb-0">시간</label>
          </Col>
          <Col xs={10}>
            <div className="text-display">
              <FaRegClock className="me-2" />
              {scheduleData.time}
            </div>
          </Col>
        </Row>
      </div>

      {/* 내용 */}
      <div className="mb-3">
        <Row className="align-items-start">
          <Col xs={2}>
            <label className="form-label mb-0">내용</label>
          </Col>
          <Col xs={10}>
            <div className="text-display" style={{ whiteSpace: 'pre-line' }}>
              {scheduleData.content}
            </div>
          </Col>
        </Row>
      </div>

      {/* 고객사 정보 */}
      <div className="mb-3">
        <Row className="align-items-center">
          <Col xs={2}>
            <label className="form-label mb-0">고객사 정보</label>
          </Col>
          <Col xs={10}>
            <div className="text-display">{scheduleData.customer}</div>
          </Col>
        </Row>
      </div>

      {/* 알림 여부 */}
      <div className="mb-4">
        <Row className="align-items-center">
          <Col xs={2}>
            <label className="form-label mb-0">알림 여부</label>
          </Col>
          <Col xs={10}>
            <div className="text-display">
              {scheduleData.notify ? '알림 설정됨' : '알림 없음'}
            </div>
          </Col>
        </Row>
      </div>

      {/* 하단 버튼 */}
      <Row className="mt-4">
        <Col xs={12} className="d-flex justify-content-center">
          <button
            className="custom-back-button rounded-pill fw-semibold"
            onClick={handleGoBack}
          >
            목록으로 돌아가기
          </button>
        </Col>
      </Row>
    </div>
  );
};

export default ScheduleDetail;
