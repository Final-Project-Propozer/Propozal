import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

const EstimateHeaderForm = () => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <Row className="align-items-center justify-content-between">
          <Col>
            <h4 className="fw-bold mb-0">견적서 작성</h4>
          </Col>

          <Col xs="auto">
            <div className="d-flex gap-2">
              <Button variant="outline-secondary">메모하기</Button>
              <Button variant="outline-primary">불러오기</Button>
              <Button variant="outline-danger">
                <FaTrash className="me-2" />
                삭제하기
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default EstimateHeaderForm;
