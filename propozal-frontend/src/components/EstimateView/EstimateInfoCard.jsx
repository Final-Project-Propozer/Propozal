import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import './EstimateInfoCard.css';

const EstimateInfoCard = () => {
  return (
    <div className="estimate-info container mt-2 mb-1">
      <Card className="estimate-card shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4">견적서 정보</Card.Title>
          <Row>
            <Col xs={12} md={6} className="mb-3">
              <strong>Estimate:</strong> #000123
            </Col>
            <Col xs={12} md={6} className="mb-3">
              <strong>견적 송부일:</strong> 2025년 8월 1일
            </Col>
            <Col xs={12} md={6} className="mb-3">
              <strong>견적 유효일:</strong> 2025년 8월 15일
            </Col>
            <Col xs={12} md={6} className="mb-3">
              <strong>회사명:</strong> (주)멋쟁이사자처럼
            </Col>
            <Col xs={12} md={6} className="mb-3">
              <strong>수취인:</strong> 김대리 귀하
            </Col>
            <Col xs={12} md={6} className="mb-3">
              <strong>프로세스 단계:</strong> 거래 대기 중
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EstimateInfoCard;
