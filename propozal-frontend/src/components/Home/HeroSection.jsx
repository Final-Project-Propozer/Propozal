import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './HeroSection.css'; // 💡 외부 CSS 파일 추가

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div className="hero-wrapper">
      <Container>
        <Row>
          <Col xs={12} md={8} className="hero-text">
            <h1><p>PROPOZAL</p></h1>
            <p className="hero-slogan">
              빠르고 편하게,<br />
              프로답게
            </p>
            <p>
              프로포잘은 언제 어디서나 간편하게 사용할 수 있는<br />
              <span class="highlighted-text">견적 관리 솔루션</span>입니다.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center mt-4 text-center">
          <Col xs="auto">
            <Button
              className="custom-button login-button me-3"
              onClick={() => navigate('/login')}
            >
              로그인
            </Button>
            <Button
              className="custom-button signup-button"
              onClick={() => navigate('/signup')}
            >
              회원가입
            </Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HeroSection;
