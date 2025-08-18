import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Table, Button, Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../../components/Layout/PageLayout';
import axiosInstance from '../../api/axiosInstance';
import './CustomerList.css';

const CustomerList = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const res = await axiosInstance.get('/customer');
        setCustomers(res.data);
      } catch (err) {
        console.error('고객 목록 조회 실패:', err);
        alert('고객 목록을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleRowClick = (id) => {
    navigate(`/customer/${id}`);
  };

  const convertType = (type) => {
    return type === 'COMPANY' ? '기업' : '개인';
  };

  const handleCheckboxChange = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selectedIds.length === 0) {
      alert('삭제할 고객을 선택하세요.');
      return;
    }

    if (!window.confirm('선택한 고객을 삭제하시겠습니까?')) return;

    try {
      await Promise.all(
        selectedIds.map((id) => axiosInstance.delete(`/customer/${id}/delete`))
      );
      alert('삭제가 완료되었습니다.');
      setCustomers((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
      setSelectedIds([]);
    } catch (err) {
      console.error('삭제 실패:', err);
      alert('삭제 중 오류가 발생했습니다.');
    }
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

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">고객 정보를 불러오는 중입니다...</p>
              </div>
            ) : (
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
                      <td onClick={() => handleRowClick(customer.id)}>{convertType(customer.customerType)}</td>
                      <td onClick={() => handleRowClick(customer.id)}>{customer.name}</td>
                      <td onClick={() => handleRowClick(customer.id)}>{customer.phone}</td>
                      <td onClick={() => handleRowClick(customer.id)}>{customer.email}</td>
                      <td>
                        <Form.Check
                          type="checkbox"
                          className="custom-checkbox"
                          checked={selectedIds.includes(customer.id)}
                          onChange={() => handleCheckboxChange(customer.id)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}

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
                  onClick={handleDelete}
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
