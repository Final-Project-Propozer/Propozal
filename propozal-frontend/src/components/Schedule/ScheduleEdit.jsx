import React, { useState, forwardRef } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ScheduleCreate.css';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';

const ScheduleCreate = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [content, setContent] = useState('');
  const [customer, setCustomer] = useState('');
  const [notify, setNotify] = useState(false);

  // 📅 커스텀 날짜 입력 필드
  const CustomDateInput = forwardRef(({ value, onClick }, ref) => (
    <div className="custom-input-wrapper" onClick={onClick} ref={ref}>
      <input
        type="text"
        className="form-control"
        value={value}
        readOnly
        placeholder="날짜 선택"
      />
      <FaRegCalendarAlt className="input-icon" />
    </div>
  ));

  // ⏰ 커스텀 시간 입력 필드 (react-datepicker용)
  const CustomTimeInput = forwardRef(({ value, onClick }, ref) => (
    <div className="custom-input-wrapper" onClick={onClick} ref={ref}>
      <input
        type="text"
        className="form-control"
        value={value}
        readOnly
        placeholder="시간 선택"
      />
      <FaRegClock className="input-icon" />
    </div>
  ));

  return (
    <div className="container py-4">
      {/* 타이틀 */}
      <div className="mb-4">
        <h3 className="fw-bold" style={{ color: '#3a5a40' }}>
          스케줄 수정
        </h3>
      </div>

      <Form>
        {/* 제목 */}
        <Form.Group className="mb-3">
          <Row className="align-items-center">
            <Col xs={2}>
              <Form.Label className="mb-0">제목</Form.Label>
            </Col>
            <Col xs={10}>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
              />
            </Col>
          </Row>
        </Form.Group>

        {/* 일자 */}
        <Form.Group className="mb-2">
          <Row className="align-items-center">
            <Col xs={2}>
              <Form.Label className="mb-0">일자</Form.Label>
            </Col>
            <Col xs={10}>
              <div style={{ maxWidth: '200px' }}>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="yyyy/MM/dd"
                  customInput={<CustomDateInput />}
                />
              </div>
            </Col>
          </Row>
        </Form.Group>

        {/* 시간 */}
        <Form.Group className="mb-3">
          <Row className="align-items-center">
            <Col xs={2}>
              <Form.Label className="mb-0">시간</Form.Label>
            </Col>
            <Col xs={10}>
              <div style={{ maxWidth: '200px' }}>
                <DatePicker
                  selected={time}
                  onChange={(time) => setTime(time)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={30}
                  timeCaption="시간"
                  dateFormat="h:mm aa"
                  customInput={<CustomTimeInput />}
                />
              </div>
            </Col>
          </Row>
        </Form.Group>

        {/* 내용 */}
        <Form.Group className="mb-3">
          <Row className="align-items-start">
            <Col xs={2}>
              <Form.Label className="mb-0">내용</Form.Label>
            </Col>
            <Col xs={10}>
              <Form.Control
                as="textarea"
                rows={4}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="내용을 입력하세요"
              />
            </Col>
          </Row>
        </Form.Group>

        {/* 고객사 정보 */}
        <Form.Group className="mb-3">
          <Row className="align-items-center">
            <Col xs={2}>
              <Form.Label className="mb-0">고객사 정보</Form.Label>
            </Col>
            <Col xs={10}>
              <Form.Control
                type="text"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="고객사 정보를 입력하세요"
              />
            </Col>
          </Row>
        </Form.Group>

        {/* 알림 여부 */}
        <Form.Group className="mb-2">
          <Row className="align-items-center">
            <Col xs={2}>
              <Form.Label className="mb-0">알림 여부</Form.Label>
            </Col>
            <Col xs={10}>
              <Form.Check
                type="checkbox"
                label=""
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
                className="custom-checkbox"
              />
            </Col>
          </Row>
        </Form.Group>

        {/* 체크박스와 버튼 사이 여백 */}
        <div className="mb-3" />

        {/* 하단 버튼 */}
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <Button
            className="submit-btn rounded-pill fw-semibold"
            style={{
              fontSize: '1.0rem',
              padding: '0.5rem 1.2rem',
              border: '2px solid #3a5a40',
            }}
          >
            + 일정 수정
          </Button>
        </div>

      </Form>
    </div>
  );
};

export default ScheduleCreate;
