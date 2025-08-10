import React from 'react';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';

const EstimateDetailsForm = () => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <h5 className="fw-bold mb-3">견적 상세 정보</h5>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="estimateNumber">
              <Form.Label>Estimate #000123</Form.Label>
              <Form.Control type="text" disabled value="000123" />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="sendDate">
              <Form.Label>견적 송부일</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group controlId="validDate">
              <Form.Label>견적 유효일</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4}>
            <Form.Group controlId="processStage">
              <Form.Label>프로세스 단계</Form.Label>
              <Form.Select>
                <option>선택</option>
                <option>초안</option>
                <option>검토중</option>
                <option>최종</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <h6 className="fw-bold mb-3">견적 받으시는 분</h6>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group controlId="companyName">
              <Form.Label>회사명 입력</Form.Label>
              <Form.Control type="text" placeholder="회사명 입력" />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="recipientName">
              <Form.Label>성함 입력</Form.Label>
              <Form.Control type="text" placeholder="성함 입력" />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="recipientPosition">
              <Form.Label>직위 입력</Form.Label>
              <Form.Control type="text" placeholder="직위 입력" />
            </Form.Group>
          </Col>
        </Row>

        <div className="text-end">
          <Button variant="primary">확인</Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EstimateDetailsForm;
