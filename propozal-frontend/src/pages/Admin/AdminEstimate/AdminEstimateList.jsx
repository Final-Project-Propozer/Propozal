import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';

// 페이지당 표시할 기록 수
const RECORDS_PER_PAGE = 10;

// 더미(Dummy) 데이터 생성 (실제로는 API에서 받아옴)
const DUMMY_ESTIMATES = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  companyName: `견적서 기업 ${i + 1}`,
  contactPerson: `담당자 ${Math.floor(i / 10) + 1}`,
  productName: `제품명 ${i + 1}`,
  status: i % 3 === 0 ? '승인' : i % 3 === 1 ? '대기' : '반려',
  date: `2025-08-14`,
}));

const AdminEstimateList = () => {
  const [estimates, setEstimates] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // 실제로는 여기에 API 호출 코드를 작성합니다.
    // 예시: axios.get('/api/estimates').then(response => setEstimates(response.data));
    setEstimates(DUMMY_ESTIMATES);
  }, []);

  // 현재 페이지에 표시할 기록 계산
  const indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
  const indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
  const currentEstimates = estimates.slice(indexOfFirstRecord, indexOfLastRecord);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(estimates.length / RECORDS_PER_PAGE);

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div className="container flex-grow-1 py-5" style={{ paddingTop: '60px' }}>
        <h2 className="mb-4">견적서 관리 목록</h2>
        
        {/* 기록 목록 테이블 */}
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">견적서 ID</th>
                <th scope="col">기업명</th>
                <th scope="col">담당자</th>
                <th scope="col">제품명</th>
                <th scope="col">상태</th>
                <th scope="col">날짜</th>
              </tr>
            </thead>
            <tbody>
              {currentEstimates.map(estimate => (
                <tr key={estimate.id}>
                  <th scope="row">{estimate.id}</th>
                  <td>{estimate.companyName}</td>
                  <td>{estimate.contactPerson}</td>
                  <td>{estimate.productName}</td>
                  <td>{estimate.status}</td>
                  <td>{estimate.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 UI */}
        <nav>
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, i) => (
              <li 
                key={i} 
                className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                onClick={() => paginate(i + 1)}
              >
                <a className="page-link" href="#">
                  {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </nav>

      </div>
      <Footer />
    </div>
  );
};

export default AdminEstimateList;