import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./AdminNavbar.css"; // 커스텀 스타일 (위치 고정 등)

const AdminNavbar = () => {
  const location = useLocation();

  useEffect(() => {
    // 메뉴 닫기: 이동 시 collapse 영역 닫기
    const nav = document.getElementById("mainNav");
    if (nav && nav.classList.contains("show")) {
      nav.classList.remove("show");
    }
  }, [location]); // location 변경될 때마다 실행됨

  return (
    <nav 
      className="navbar navbar-expand-lg navbar-light bg-light custom-navbar"
      style={{
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: 100,
        height: '60px' // ✅ 이 부분을 추가했습니다.
      }}
      >

      <div className="container-fluid">
        {/* 🔰 로고 */}
        <Link className="navbar-brand logo" to="/admin/companydataview">
          <span className="pro">Pro</span>
          <span className="pozal">poZal</span>
        </Link>

        {/* ☰ 모바일 햄버거 */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNav"
          aria-controls="mainNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* 🔗 네비게이션 링크 */}
        <div className="collapse navbar-collapse" id="mainNav">
          <ul className="navbar-nav ms-auto align-items-center nav-tab-group">
            <li className="nav-item">
              <Link className="nav-link" to="/admin/dashboard">대시보드</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/estimatelist">견적관리</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/product-list">제품관리</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin/client-list">고객관리</Link>
            </li>
            <li className="nav-item">
              <Link className="btn btn-outline-dark rounded-pill px-3 py-1 login-btn" to="/login">
                로그아웃
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
