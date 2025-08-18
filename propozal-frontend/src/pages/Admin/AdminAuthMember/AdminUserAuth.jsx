import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';

// 페이지당 표시할 기록 수
const USERS_PER_PAGE = 10;

// 더미(Dummy) 데이터 생성 (실제로는 API에서 받아옴)
const DUMMY_REQUESTS = Array.from({ length: 30 }, (_, i) => ({
  id: `user${i + 1}`,
  name: `이름${i + 1}`,
  department: `부서${Math.floor(i / 10) + 1}`,
  position: `직급${i + 1}`,
  status: 'pending', // ✅ 초기 상태를 'pending'으로 추가
}));

const AdminUserAuth = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setRequests(DUMMY_REQUESTS);
  }, []);

  const indexOfLastRequest = currentPage * USERS_PER_PAGE;
  const indexOfFirstRequest = indexOfLastRequest - USERS_PER_PAGE;
  const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(requests.length / USERS_PER_PAGE);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // '승인' 버튼 클릭 시
  const handleApprove = (userId) => {
    // requests 배열을 순회하며 해당 유저의 status를 'approved'로 변경
    const updatedRequests = requests.map(user => 
      user.id === userId ? { ...user, status: 'approved' } : user
    );
    setRequests(updatedRequests);
    console.log(`${userId}에 대한 승인 요청`);
  };

  // '거절' 버튼 클릭 시
  const handleReject = (userId) => {
    // requests 배열을 순회하며 해당 유저의 status를 'rejected'로 변경
    const updatedRequests = requests.map(user => 
      user.id === userId ? { ...user, status: 'rejected' } : user
    );
    setRequests(updatedRequests);
    console.log(`${userId}에 대한 거절 요청`);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div className="container flex-grow-1 py-5" style={{ paddingTop: '60px' }}>
        <h2 className="mb-4">회원가입 요청 목록</h2>
        
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">이름</th>
                <th scope="col">ID</th>
                <th scope="col">부서</th>
                <th scope="col">직급</th>
                <th scope="col" className="text-center">동작</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.id}</td>
                  <td>{user.department}</td>
                  <td>{user.position}</td>
                  <td className="text-center">
                    {/* ✅ 상태에 따라 다른 내용을 렌더링하는 조건부 렌더링 */}
                    {user.status === 'pending' ? (
                      <>
                        <button 
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => handleApprove(user.id)}
                        >
                          승인
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          onClick={() => handleReject(user.id)}
                        >
                          거절
                        </button>
                      </>
                    ) : user.status === 'approved' ? (
                      <span className="text-success fw-bold">승인됨</span>
                    ) : (
                      <span className="text-danger fw-bold">거절됨</span>
                    )}
                  </td>
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

export default AdminUserAuth;