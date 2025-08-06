// src/pages/Login.jsx

import React from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const Login = () => {
  return (
    <Container className="pt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h3 className="text-center mb-4">로그인</h3>
          <Form>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>이메일 주소</Form.Label>
              <Form.Control type="email" placeholder="example@propozal.com" />
            </Form.Group>

            <Form.Group controlId="formPassword" className="mb-4">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control type="password" placeholder="비밀번호 입력" />
            </Form.Group>

            <Button variant="success" type="submit" className="w-100">
              로그인
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
