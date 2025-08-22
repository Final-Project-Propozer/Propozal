import React, { useState, useEffect } from "react";
import AdminNavbar from "../../../components/Navbar/AdminNavbar.jsx";
import Footer from "../../../components/Footer/Footer.jsx";
import axios from "axios";

// 페이지당 표시할 기록 수
const USERS_PER_PAGE = 10;

const AdminUserAuth = () => {
  const [requests, setRequests] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  // 백엔드 서버 주소 (실제 배포 환경에 맞게 변경)
  const API_BASE_URL = "http://localhost:8080";

  // JWT 토큰에서 관리자 정보를 추출하는 함수
  const getAdminInfoFromToken = async (accessToken) => {
    try {
      // Option 1: JWT 토큰을 디코딩해서 companyId 추출
      const payload = JSON.parse(atob(accessToken.split(".")[1]));

      // 토큰에 companyId가 포함되어 있다면
      if (payload.companyId) {
        return { companyId: payload.companyId };
      }

      // Option 2: 토큰에 companyId가 없다면 별도 API 호출
      const response = await axios.get(`${API_BASE_URL}/admin/profile`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return { companyId: response.data.companyId };
    } catch (error) {
      console.error("관리자 정보 조회 실패:", error);
      throw new Error("관리자 정보를 가져올 수 없습니다.");
    }
  };

  useEffect(() => {
    const fetchPendingUsers = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        setLoading(false);
        setError("로그인이 필요합니다. 먼저 로그인해 주세요.");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // 관리자 정보에서 companyId 가져오기
        const adminInfo = await getAdminInfoFromToken(accessToken);
        const companyId = adminInfo.companyId;

        const response = await axios.get(
          `${API_BASE_URL}/admin/users/pending`,
          {
            params: { companyId: companyId },
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        // DTO 구조에 맞춰서 데이터 가공
        const fetchedRequests = response.data.pendingEmployees.map((user) => ({
          id: user.userId,
          name: user.name,
          department: user.department,
          position: user.position,
          status: "pending",
        }));

        setRequests(fetchedRequests);
      } catch (err) {
        console.error("API 호출 오류:", err);

        // 구체적인 에러 메시지 처리
        if (err.response && err.response.status === 401) {
          setError(
            "인증 정보가 만료되었거나 유효하지 않습니다. 다시 로그인해 주세요."
          );
        } else if (err.response && err.response.status === 403) {
          setError("관리자 권한이 필요합니다.");
        } else if (err.message === "관리자 정보를 가져올 수 없습니다.") {
          setError(err.message);
        } else {
          setError("회원 목록을 불러오는 데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const indexOfLastRequest = currentPage * USERS_PER_PAGE;
  const indexOfFirstRequest = indexOfLastRequest - USERS_PER_PAGE;
  const currentRequests = requests.slice(
    indexOfFirstRequest,
    indexOfLastRequest
  );
  const totalPages = Math.ceil(requests.length / USERS_PER_PAGE);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // '승인' 버튼 클릭 시
  const handleApprove = async (userId) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/admin/users/pending/${userId}/approve`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // API 호출 성공 시, 상태 업데이트
      const updatedRequests = requests.map((user) =>
        user.id === userId ? { ...user, status: "approved" } : user
      );
      setRequests(updatedRequests);
      console.log(`${userId} 승인 완료`);
    } catch (err) {
      console.error(
        `${userId} 승인 실패:`,
        err.response ? err.response.data : err.message
      );
      alert("승인에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  // '거절' 버튼 클릭 시
  const handleReject = async (userId) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      await axios.post(
        `${API_BASE_URL}/admin/users/pending/${userId}/reject`,
        null,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      // API 호출 성공 시, 상태 업데이트
      const updatedRequests = requests.map((user) =>
        user.id === userId ? { ...user, status: "rejected" } : user
      );
      setRequests(updatedRequests);
      console.log(`${userId} 거절 완료`);
    } catch (err) {
      console.error(
        `${userId} 거절 실패:`,
        err.response ? err.response.data : err.message
      );
      alert("거절에 실패했습니다. 다시 시도해 주세요.");
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
      <div className="container flex-grow-1" style={{ paddingTop: "100px" }}>
        <h2 className="mb-4">회원가입 요청 목록</h2>

        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">이름</th>
                <th scope="col">ID</th>
                <th scope="col">부서</th>
                <th scope="col">직급</th>
                <th scope="col" className="text-center">
                  현황
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRequests.length > 0 ? (
                currentRequests.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.id}</td>
                    <td>{user.department}</td>
                    <td>{user.position}</td>
                    <td className="text-center">
                      {user.status === "pending" ? (
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
                      ) : user.status === "approved" ? (
                        <span className="text-success fw-bold">승인됨</span>
                      ) : (
                        <span className="text-danger fw-bold">거절됨</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-muted">
                    승인 대기 중인 회원이 없습니다.
                  </td>
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
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
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
