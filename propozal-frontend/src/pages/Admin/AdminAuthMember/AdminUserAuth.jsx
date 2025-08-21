import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import axios from 'axios';

// 페이지당 표시할 기록 수
const USERS_PER_PAGE = 10;

const AdminUserAuth = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  // 백엔드 서버 주소 (실제 배포 환경에 맞게 변경)
  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchPendingUsers = async () => {
      // localStorage에서 유효한 JWT 토큰을 가져옵니다.
      const accessToken = localStorage.getItem('accessToken');

      // 토큰이 없으면 API 호출을 중단하고 에러 상태를 설정합니다.
      if (!accessToken) {
        setLoading(false);
        setError("로그인이 필요합니다. 먼저 로그인해 주세요.");
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // ⚠️ 실제로는 로그인한 관리자의 companyId를 사용해야 합니다.
        const companyId = 1; 
        
        const response = await axios.get(`${API_BASE_URL}/admin/users/pending`, {
          params: { companyId: companyId },
          headers: {
            'Authorization': `Bearer ${accessToken}`, 
          }
        });
        
        // DTO 구조에 맞춰서 데이터 가공
        // ⚠️ 수정된 부분: response.data.pendingEmployees를 사용합니다.
        const fetchedRequests = response.data.pendingEmployees.map(user => ({
          id: user.userId,
          name: user.name,
          department: user.department,
          position: user.position,
          status: 'pending', // 초기 상태는 'pending'으로 설정
        }));
        
        setRequests(fetchedRequests);

      } catch (err) {
        console.error("API 호출 오류:", err);
        // 401 에러라면 토큰이 만료되었을 수 있으므로 사용자에게 알립니다.
        if (err.response && err.response.status === 401) {
          setError("인증 정보가 만료되었거나 유효하지 않습니다. 다시 로그인해 주세요.");
        } else {
          setError("회원 목록을 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []); // 이 훅은 컴포넌트가 처음 렌더링될 때만 실행됩니다.

  const indexOfLastRequest = currentPage * USERS_PER_PAGE;
  const indexOfFirstRequest = indexOfLastRequest - USERS_PER_PAGE;
  const currentRequests = requests.slice(indexOfFirstRequest, indexOfLastRequest);
  const totalPages = Math.ceil(requests.length / USERS_PER_PAGE);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // '승인' 버튼 클릭 시
  const handleApprove = async (userId) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/admin/users/pending/${userId}/approve`, null, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, 
        }
      });
      // API 호출 성공 시, 상태 업데이트
      const updatedRequests = requests.map(user => 
        user.id === userId ? { ...user, status: 'approved' } : user
      );
      setRequests(updatedRequests);
      console.log(`${userId} 승인 완료`);
    } catch (err) {
      console.error(`${userId} 승인 실패:`, err.response ? err.response.data : err.message);
      alert('승인에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  // '거절' 버튼 클릭 시
  const handleReject = async (userId) => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.post(`${API_BASE_URL}/admin/users/pending/${userId}/reject`, null, {
        headers: {
          'Authorization': `Bearer ${accessToken}`, 
        }
      });
      // API 호출 성공 시, 상태 업데이트
      const updatedRequests = requests.map(user => 
        user.id === userId ? { ...user, status: 'rejected' } : user
      );
      setRequests(updatedRequests);
      console.log(`${userId} 거절 완료`);
    } catch (err) {
      console.error(`${userId} 거절 실패:`, err.response ? err.response.data : err.message);
      alert('거절에 실패했습니다. 다시 시도해 주세요.');
    }
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-danger my-5">{error}</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div className="container flex-grow-1" style={{ paddingTop: '100px' }}>
        <h2 className="mb-4">회원가입 요청 목록</h2>
        
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">이름</th>
                <th scope="col">ID</th>
                <th scope="col">부서</th>
                <th scope="col">직급</th>
                <th scope="col" className="text-center">현황</th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.length > 0 ? (
                currentRequests.map(user => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.id}</td>
                    <td>{user.department}</td>
                    <td>{user.position}</td>
                    <td className="text-center">
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
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">승인 대기 중인 회원이 없습니다.</td>
                </tr>
              )}
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