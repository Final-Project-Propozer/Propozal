import React from 'react';
import { Container, Row, Col, Table, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/Layout/PageLayout'; // 레이아웃 컴포넌트만 import
import './CustomerList.css'; // 스타일 분리

const CustomerList = () => {
  const navigate = useNavigate();

  const customers = [
    { id: 1, type: '개인', name: '김민수', phone: '010-1234-5678', email: 'minsu@example.com' },
    { id: 2, type: '기업', name: 'A테크', phone: '02-987-6543', email: 'contact@atech.co.kr' },
    { id: 3, type: '기업', name: 'B회사', phone: '031-222-2222', email: 'test001@naver.com' },
  ];

  const handleRowClick = (id) => {
    navigate(`/customer/${id}`);
  };

  return (
    <PageLayout>
      <Container fluid className="px-4 py-4" style={{ marginTop: '0px' }}>
        <Row className="justify-content-center" style={{ marginTop: '30px', marginBottom: '30px' }}>
          <Col xs={12} md={10} lg={8}>
            <Row className="mb-3">
              <Col>
                <h3 className="fw-bold">고객 목록</h3>
                <hr />
              </Col>
            </Row>

            <Table responsive bordered hover className="align-middle text-center shadow-sm">
              <thead className="table-light">
                <tr>
                  <th>고객 유형</th>
                  <th>이름</th>
                  <th>연락처</th>
                  <th>이메일</th>
                  <th>선택</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} style={{ cursor: 'pointer' }}>
                    <td onClick={() => handleRowClick(customer.id)}>{customer.type}</td>
                    <td onClick={() => handleRowClick(customer.id)}>{customer.name}</td>
                    <td onClick={() => handleRowClick(customer.id)}>{customer.phone}</td>
                    <td onClick={() => handleRowClick(customer.id)}>{customer.email}</td>
                    <td>
                      <Form.Check type="checkbox" className="custom-checkbox" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Row className="mt-4">
              <Col className="d-flex justify-content-end gap-3">
                <Button
                  variant="success"
                  className="rounded-pill px-4"
                  onClick={() => navigate('/customer/register')}
                >
                  고객 등록
                </Button>
                <Button
                  className="rounded-pill px-4"
                  style={{
                    backgroundColor: 'white',
                    color: '#DC123C',
                    border: '2px solid #DC123C',
                    fontWeight: 'bold'
                  }}
                >
                  삭제
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </PageLayout>
  );
};

export default CustomerList;
