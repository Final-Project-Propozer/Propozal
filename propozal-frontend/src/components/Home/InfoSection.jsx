import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaClock, FaBullseye, FaChartLine } from 'react-icons/fa';

const InfoSection = () => {
  return (
    <div style={{ backgroundColor: '#ffffff', padding: '60px 0' }}>
      <Container>
        <Row className="text-center mb-5">
          <Col>
            <h2 style={{ fontWeight: 'bold' }}>당신의 세일즈 플로우, Propozal이 함께 합니다.</h2>
          </Col>
        </Row>

        {/* ✅ 가운데 기준 아이콘 고정 + 좌우 간격 좁힘 */}
        <Row className="justify-content-center text-center">
          <Col xs={12} md={3} className="mb-4">
            <div
              style={{
                backgroundColor: '#FFC107',
                display: 'inline-block',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '1rem',
              }}
            >
              <FaClock size={40} color="#333" />
            </div>
            <p style={{ fontSize: '1.1rem' }}>시간을 절약하세요.</p>
          </Col>

          <Col xs={12} md={3} className="mb-4">
            <div
              style={{
                backgroundColor: '#588174',
                display: 'inline-block',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '1rem',
              }}
            >
              <FaBullseye size={40} color="#fff" />
            </div>
            <p style={{ fontSize: '1.1rem' }}>정말 중요한 것에 집중하세요.</p>
          </Col>

          <Col xs={12} md={3} className="mb-4">
            <div
              style={{
                backgroundColor: '#BDDFBC',
                display: 'inline-block',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '1rem',
              }}
            >
              <FaChartLine size={40} color="#333" />
            </div>
            <p style={{ fontSize: '1.1rem' }}>세일즈 데이터를 한눈에 파악하세요.</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default InfoSection;
