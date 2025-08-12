import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // ✅ 추가
import PageLayout from '../../components/Layout/PageLayout';

const CustomerDetail = () => {
  const navigate = useNavigate(); // ✅ 추가

  // 더미 데이터 (개인 or 기업)
  const customer = {
    type: '기업',
    name: 'B회사',
    phone: '031-222-2222',
    email: 'test001@naver.com',
    ceo: '홍길동',
    address: '경기도 성남시 분당구',
    businessType: 'IT 서비스',
    businessCategory: '정보통신업',
    registrationNumber: '123-45-67890',
  };

  return (
    <PageLayout>
      <Container fluid className="px-4 py-4" style={{ marginTop: '0px' }}>
        <Row className="justify-content-center" style={{ marginTop: '30px', marginBottom: '30px' }}>
          <Col xs={12} md={8} lg={6}>
            {/* 타이틀 */}
            <Row className="mb-3">
              <Col>
                <h3 className="fw-bold">고객 정보 상세조회</h3>
                <hr />
              </Col>
            </Row>

            {/* 정보 카드 */}
            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <Row className="mb-3 mt-3">
                  <Col xs={4} className="fw-semibold">고객 유형</Col>
                  <Col>{customer.type}</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4} className="fw-semibold">이름</Col>
                  <Col>{customer.name}</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4} className="fw-semibold">연락처</Col>
                  <Col>{customer.phone}</Col>
                </Row>
                <Row className="mb-3">
                  <Col xs={4} className="fw-semibold">이메일</Col>
                  <Col>{customer.email}</Col>
                </Row>

                {/* 기업 전용 필드 */}
                {customer.type === '기업' && (
                  <>
                    <Row className="mb-3">
                      <Col xs={4} className="fw-semibold">대표자명</Col>
                      <Col>{customer.ceo}</Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={4} className="fw-semibold">주소</Col>
                      <Col>{customer.address}</Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={4} className="fw-semibold">업종</Col>
                      <Col>{customer.businessType}</Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={4} className="fw-semibold">업태</Col>
                      <Col>{customer.businessCategory}</Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={4} className="fw-semibold">사업자 등록번호</Col>
                      <Col>{customer.registrationNumber}</Col>
                    </Row>
                  </>
                )}
              </Card.Body>
            </Card>

            {/* 버튼 */}
            <Row>
              <Col className="d-flex justify-content-center gap-3">
                <Button variant="primary" className="rounded-pill px-4">[임시]수정</Button>
                <Button
                  variant="secondary"
                  className="rounded-pill px-4"
                  onClick={() => navigate('/customer/list')} // ✅ 수정된 부분
                >
                  목록으로
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </PageLayout>
  );
};

export default CustomerDetail;
