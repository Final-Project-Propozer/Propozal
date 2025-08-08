import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { FaRegEye, FaSave } from 'react-icons/fa';
import './FooterActions.css'; // 글꼴 적용용 CSS

const FooterActions = () => {
  return (
    <Card className="mb-4 noto-sans-kr">
      <Card.Body>
        <Row className="align-items-center">
          <Col md={8}>
            <div>
              <strong>담당자</strong> &nbsp;
              <span>영업 1팀 김영업 사원</span> &nbsp;|&nbsp;
              <span>📞 010-1234-5678</span> &nbsp;|&nbsp;
              <span>✉️ sales@company.com</span>
            </div>
          </Col>

          <Col md={4} className="text-end">
            <Button variant="outline-secondary" className="me-2">
              <FaRegEye className="me-1" />
              미리보기
            </Button>
            <Button variant="primary">
              <FaSave className="me-1" />
              저장하기
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FooterActions;
