import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';

// 페이지당 표시할 기록 수
const RECORDS_PER_PAGE = 10;

// 더미(Dummy) 데이터 생성 (실제로는 API에서 받아옴)
const DUMMY_RECORDS = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  salesperson: `영업사원 ${Math.floor(i / 10) + 1}`,
  content: `영업 기록 내용 ${i + 1}`,
  date: `2025-08-14`,
}));

const AdminSalesRecordsList = () => {
  const [records, setRecords] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // 실제로는 여기에 API 호출 코드를 작성합니다.
    // 예를 들어, axios.get('/api/sales/records').then(response => setRecords(response.data));
    setRecords(DUMMY_RECORDS);
  }, []);

  // 현재 페이지에 표시할 기록 계산
  const indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
  const indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
  const currentRecords = records.slice(indexOfFirstRecord, indexOfLastRecord);

  // 총 페이지 수 계산
  const totalPages = Math.ceil(records.length / RECORDS_PER_PAGE);

  // 페이지 변경 함수
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div className="container flex-grow-1 py-5" style={{ paddingTop: '60px' }}>
        <h2 className="mb-4">영업사원 기록 확인</h2>
        
        {/* 기록 목록 테이블 */}
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">기록 ID</th>
                <th scope="col">영업사원</th>
                <th scope="col">내용</th>
                <th scope="col">날짜</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.map(record => (
                <tr key={record.id}>
                  <th scope="row">{record.id}</th>
                  <td>{record.salesperson}</td>
                  <td>{record.content}</td>
                  <td>{record.date}</td>
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

export default AdminSalesRecordsList;