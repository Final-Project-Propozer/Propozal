import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import PageLayout from '../../components/Layout/PageLayout';

const CustomerRegister = () => {
  const navigate = useNavigate(); // ✅ 추가

  const [type, setType] = useState('개인');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    ceo: '',
    address: '',
    businessType: '',
    businessCategory: '',
    registrationNumber: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
  };

  return (
    <PageLayout>
      <Container fluid className="px-4 py-4" style={{ marginTop: '0px' }}>
        <Row className="justify-content-center" style={{ marginTop: '30px', marginBottom: '30px' }}>
          <Col xs={12} md={8} lg={6}>
            {/* 타이틀 */}
            <Row className="mb-3">
              <Col>
                <h3 className="fw-bold">고객 등록</h3>
                <hr />
              </Col>
            </Row>

            {/* 고객 유형 선택 */}
            <Row className="mb-4">
              <Col>
                <Form>
                  <Form.Label className="fw-semibold" style={{ fontSize: '1.1rem' }}>고객 유형</Form.Label>
                  <div>
                    <Form.Check
                      inline
                      label={<span style={{ fontSize: '1rem' }}>개인</span>}
                      name="type"
                      type="radio"
                      value="개인"
                      checked={type === '개인'}
                      onChange={handleTypeChange}
                      style={{ transform: 'scale(1.3)', marginRight: '30px' }}
                    />
                    <Form.Check
                      inline
                      label={<span style={{ fontSize: '1rem' }}>기업</span>}
                      name="type"
                      type="radio"
                      value="기업"
                      checked={type === '기업'}
                      onChange={handleTypeChange}
                      style={{ transform: 'scale(1.3)' }}
                    />
                  </div>
                </Form>
              </Col>
            </Row>

            {/* 공통 입력 필드 */}
            <Row className="mb-0">
              <Col>
                <Form.Group className="mb-3">
                  <Form.Label>이름</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="이름을 입력하세요"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>연락처</Form.Label>
                  <Form.Control
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="연락처를 입력하세요"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>이메일 주소</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="이메일을 입력하세요"
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* 기업 전용 필드 */}
            {type === '기업' && (
              <Row className="mb-3">
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>대표자명</Form.Label>
                    <Form.Control
                      type="text"
                      name="ceo"
                      value={formData.ceo}
                      onChange={handleChange}
                      placeholder="대표자명을 입력하세요"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>주소</Form.Label>
                    <Form.Control
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="주소를 입력하세요"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>업종</Form.Label>
                    <Form.Control
                      type="text"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      placeholder="업종을 입력하세요"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>업태</Form.Label>
                    <Form.Control
                      type="text"
                      name="businessCategory"
                      value={formData.businessCategory}
                      onChange={handleChange}
                      placeholder="업태를 입력하세요"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>사업자 등록번호</Form.Label>
                    <Form.Control
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                      placeholder="사업자 등록번호를 입력하세요"
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            {/* 버튼 */}
            <Row>
              <Col className="d-flex justify-content-center gap-3">
                <Button variant="primary" className="rounded-pill px-4">저장</Button>
                <Button
                  variant="secondary"
                  className="rounded-pill px-4"
                  onClick={() => navigate('/customer/list')} // ✅ 수정된 부분
                >
                  취소
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </PageLayout>
  );
};

export default CustomerRegister;
