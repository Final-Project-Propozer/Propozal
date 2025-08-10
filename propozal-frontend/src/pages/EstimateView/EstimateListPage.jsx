import React from 'react';
import { Table, Container } from 'react-bootstrap';
import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';

const dummyEstimates = [
  {
    id: 1,
    title: '견적서 #001',
    client: '홍길동',
    date: '2025-08-10',
    total: 120000,
  },
  {
    id: 2,
    title: '견적서 #002',
    client: '김철수',
    date: '2025-08-09',
    total: 85000,
  },
  {
    id: 3,
    title: '견적서 #003',
    client: '이영희',
    date: '2025-08-08',
    total: 99000,
  },
];

const EstimateListPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SalesNavbar />

      <main style={{ flex: 1 }}>
        <Container className="py-4">
          <h2 className="mb-4">📄 견적서 목록 [임시 페이지]</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>#</th>
                <th>제목</th>
                <th>고객명</th>
                <th>작성일</th>
                <th>총액 (₩)</th>
              </tr>
            </thead>
            <tbody>
              {dummyEstimates.map((estimate) => (
                <tr key={estimate.id}>
                  <td>{estimate.id}</td>
                  <td>{estimate.title}</td>
                  <td>{estimate.client}</td>
                  <td>{estimate.date}</td>
                  <td>{estimate.total.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default EstimateListPage;
