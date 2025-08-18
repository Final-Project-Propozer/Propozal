import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import PageLayout from '../../components/Layout/PageLayout';
import axiosInstance from '../../api/axiosInstance';

const CustomerDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ✅ URL에서 고객 ID 추출
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await axiosInstance.get(`/customer/${id}`);
        setCustomer(res.data);
      } catch (err) {
        console.error('고객 정보 조회 실패:', err);
        alert('고객 정보를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id]);

  if (loading) {
    return (
      <PageLayout>
        <Container className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">고객 정보를 불러오는 중입니다...</p>
        </Container>
      </PageLayout>
    );
  }

  if (!customer) {
    return (
      <PageLayout>
        <Container className="text-center py-5">
          <p>고객 정보를 찾을 수 없습니다.</p>
          <Button variant="secondary" onClick={() => navigate('/customer/list')}>
            목록으로
          </Button>
        </Container>
      </PageLayout>
    );
  }

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
                  <Col>{customer.customerType === 'COMPANY' ? '기업' : '개인'}</Col>
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
                {customer.customerType === 'COMPANY' && (
                  <>
                    <Row className="mb-3">
                      <Col xs={4} className="fw-semibold">대표자명</Col>
                      <Col>{customer.ceoName}</Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={4} className="fw-semibold">주소</Col>
                      <Col>{customer.businessAddress}</Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={4} className="fw-semibold">업종</Col>
                      <Col>{customer.industry}</Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={4} className="fw-semibold">업태</Col>
                      <Col>{customer.businessType}</Col>
                    </Row>
                    <Row className="mb-3">
                      <Col xs={4} className="fw-semibold">사업자 등록번호</Col>
                      <Col>{customer.businessRegistrationNumber}</Col>
                    </Row>
                  </>
                )}
              </Card.Body>
            </Card>

            {/* 버튼 */}
            <Row>
              <Col className="d-flex justify-content-center gap-3">
{/*                 <Button variant="primary" className="rounded-pill px-4">[임시]수정</Button> */}
{/*                  */}
                <Button
                  variant="success"
                  className="rounded-pill px-4"
                  onClick={() => navigate('/customer/list')}
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
