import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';

// 페이지당 표시할 기록 수
const RECORDS_PER_PAGE = 10;

// 더미데이터
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
    // API 연동 지점
    // 예시: axios.get('/api/estimates').then(response => setEstimates(response.data));
    setEstimates(DUMMY_ESTIMATES);
  }, []);

  // 페이지당 표시될 기록 개수
  const indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
  const indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
  const currentEstimates = estimates.slice(indexOfFirstRecord, indexOfLastRecord);

  // 총 페이지 수 계산 (실제 기록 개수에 맞도록)
  const totalPages = Math.ceil(estimates.length / RECORDS_PER_PAGE);

  // 페이지네이션(현재 표시된 페이지만)
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div className="container flex-grow-1" style={{ paddingTop: '100px' }}>
        <h2 className="mb-4">견적서 목록</h2>
        
        {/* 기록 목록 행 */}
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

        {/* 페이지네이션 */}
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