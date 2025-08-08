import React, { useState } from 'react';
import { Button, Form, Card, Row, Col, InputGroup } from 'react-bootstrap';
import './PasswordResetForm.css';

const PasswordReset = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '3rem 1rem',
        backgroundColor: '#ffffff', // 따뜻한 배경색
        minHeight: '80vh',
      }}
    >
      <Card
        style={{
          maxWidth: '500px',
          width: '100%',
          border: '1px solid #d6d2cb', // 회색 실선 테두리
          borderRadius: '12px', // 부드러운 모서리
          padding: '2rem',
          backgroundColor: '#fff',
        }}
      >
        <Card.Body>
          <h3 className="mb-4 text-center fw-bold">비밀번호 재설정</h3>

          {/* 이메일 입력 */}
          <Form.Group className="mb-3">
            <Form.Label>이메일</Form.Label>
            <InputGroup>
              <Form.Control
                type="email"
                placeholder="이메일 입력"
                style={{
                  border: '1px solid #d6d2cb',
                  borderRadius: '8px',
                }}
              />
              <Button
                className="code-btn"
                style={{ backgroundColor: '#BDDFBC', color: '#000', fontSize: '0.9rem',}}
              >
                인증번호 전송
              </Button>
            </InputGroup>
          </Form.Group>

          {/* 인증번호 입력 */}
          <Form.Group className="mb-3">
            <Form.Label>인증번호</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="인증번호 입력"
                style={{
                  border: '1px solid #d6d2cb',
                  borderRadius: '8px',
                }}
              />
              <Button
                className="code-btn"
                style={{ backgroundColor: '#BDDFBC', color: '#000', fontSize: '0.9rem', }}
              >
                인증번호 확인
              </Button>
            </InputGroup>
          </Form.Group>

          {/* 새 비밀번호 입력 */}
          <Form.Group className="mb-3">
            <Form.Label>새 비밀번호</Form.Label>
            <InputGroup>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="새 비밀번호 입력"
                style={{
                  border: '1px solid #d6d2cb',
                  borderRadius: '8px',
                }}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '🙈' : '👀'}
              </Button>
            </InputGroup>
            <Form.Text style={{ color: '#588157' }}>
              비밀번호는 8자 이상이어야 합니다.
            </Form.Text>
          </Form.Group>

          {/* 비밀번호 확인 입력 */}
          <Form.Group className="mb-4">
            <Form.Label>비밀번호 확인</Form.Label>
            <InputGroup>
              <Form.Control
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호 재입력"
                style={{
                  border: '1px solid #d6d2cb',
                  borderRadius: '8px',
                }}
              />
              <Button
                variant="outline-secondary"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? '🙈' : '👀'}
              </Button>
            </InputGroup>
          </Form.Group>

          {/* 하단 버튼 */}
          <Row>
            <Col>
              <Button
                className="custom-cancel-btn w-100 rounded-pill py-2 fw-semibold border-1"
              >
                취소
              </Button>
            </Col>
            <Col>
             <Button
               className="w-100 rounded-pill py-2 fw-semibold border-0"
               style={{ backgroundColor: '#198754', color: '#fff' }}
             >
               비밀번호 변경
             </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

export default PasswordReset;
