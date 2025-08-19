import React, { useState, forwardRef } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './ScheduleCreate.css';
import { FaRegCalendarAlt, FaRegClock } from 'react-icons/fa';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './ScheduleCreate.css';

const ScheduleCreate = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [content, setContent] = useState('');
  const [customer, setCustomer] = useState('');
  const [notify, setNotify] = useState(false);
  const [scheduleType, setScheduleType] = useState('MEETING');

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

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) {
        alert('로그인 정보가 없습니다. 다시 로그인해주세요.');
        return;
      }

      // ✅ KST 기준으로 startDatetime 생성
      const startDatetime = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        time.getHours(),
        time.getMinutes()
      );

      // ✅ ISO 형식 문자열 생성 (타임존 보정 없음)
      const isoString = startDatetime
        .toLocaleString('sv-SE') // 'YYYY-MM-DD HH:mm:ss'
        .replace(' ', 'T');      // → 'YYYY-MM-DDTHH:mm:ss'

      const payload = {
        userId: user.id,
        scheduleType,
        title,
        description: content,
        startDatetime: isoString,
        endDatetime: isoString,
        customer,
        notify,
      };

      const res = await axiosInstance.post('/schedule', payload);
      alert('일정이 등록되었습니다.');
      navigate(`/schedule/${res.data.id}`);
    } catch (err) {
      console.error('등록 실패:', err);
      alert('일정 등록 중 오류가 발생했습니다.');
    }
  };

  // 오늘 날짜인지 확인
  const isToday = date.toDateString() === new Date().toDateString();

  // 현재 시간 기준으로 최소 시간 설정
  const now = new Date();
  const minSelectableTime = new Date();
  minSelectableTime.setHours(now.getHours());
  minSelectableTime.setMinutes(now.getMinutes());

  return (
    <div className="container py-4">
      <div className="mb-4">
        <h3 className="fw-bold" style={{ color: '#3a5a40' }}>
          스케줄 생성
        </h3>
      </div>

      <Form>
        <Form.Group className="mb-3">
          <Row className="align-items-center">
            <Col xs={2}><Form.Label className="mb-0">유형</Form.Label></Col>
            <Col xs={10}>
              <Form.Select value={scheduleType} onChange={(e) => setScheduleType(e.target.value)}>
                <option value="MEETING">회의</option>
                <option value="CALL">할 일</option>
                <option value="VISIT">이벤트</option>
              </Form.Select>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Row className="align-items-center">
            <Col xs={2}><Form.Label className="mb-0">제목</Form.Label></Col>
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

        <Form.Group className="mb-2">
          <Row className="align-items-center">
            <Col xs={2}><Form.Label className="mb-0">일자</Form.Label></Col>
            <Col xs={10}>
              <div style={{ maxWidth: '200px' }}>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="yyyy/MM/dd"
                  customInput={<CustomDateInput />}
                  minDate={new Date()}
                />
              </div>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Row className="align-items-center">
            <Col xs={2}><Form.Label className="mb-0">시간</Form.Label></Col>
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
                  minTime={isToday ? minSelectableTime : new Date(0, 0, 0, 0, 0)}
                  maxTime={new Date(0, 0, 0, 23, 59)}
                />
              </div>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group className="mb-3">
          <Row className="align-items-start">
            <Col xs={2}><Form.Label className="mb-0">내용</Form.Label></Col>
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

        <Form.Group className="mb-3">
          <Row className="align-items-center">
            <Col xs={2}><Form.Label className="mb-0">고객사 정보</Form.Label></Col>
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

        <Form.Group className="mb-2">
          <Row className="align-items-center">
            <Col xs={2}><Form.Label className="mb-0">알림 여부</Form.Label></Col>
            <Col xs={10}>
              <label className="custom-checkbox-style">
                <input
                  type="checkbox"
                  checked={notify}
                  onChange={(e) => setNotify(e.target.checked)}
                />
                <span> </span>
              </label>
            </Col>
          </Row>
        </Form.Group>

        <div className="mb-3" />

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
          <Button
            className="submit-btn rounded-pill fw-semibold"
            style={{
              fontSize: '1.0rem',
              padding: '0.5rem 1.2rem',
              border: '2px solid #3a5a40',
            }}
            onClick={handleSubmit}
          >
            + 일정 추가
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ScheduleCreate;
