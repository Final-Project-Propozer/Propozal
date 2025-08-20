import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./SalesNavbar.css"; // 커스텀 스타일 (위치 고정 등)

const SalesNavbar = () => {
  const location = useLocation();

  useEffect(() => {
    // 메뉴 닫기: 이동 시 collapse 영역 닫기
    const nav = document.getElementById("mainNav");
    if (nav && nav.classList.contains("show")) {
      nav.classList.remove("show");
    }
  }, [location]); // location 변경될 때마다 실행됨

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light custom-navbar">
      <div className="container-fluid">
        {/* 🔰 로고 */}
        <Link className="navbar-brand logo" to="/">
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
              <Link className="nav-link" to="/sales"> 세일즈 홈</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/estimate/list-all">견적서 목록</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">제품 탐색</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/schedule/list">스케줄 관리</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/customer/list">고객관리</Link>
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

export default SalesNavbar;
