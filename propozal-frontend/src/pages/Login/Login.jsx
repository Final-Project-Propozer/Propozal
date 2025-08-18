import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance"; // 인증된 요청용
import "./Login.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ 로그인 요청
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken } = response.data;

      // 2️⃣ 토큰 저장
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      // 3️⃣ 사용자 정보 조회
      const userRes = await axiosInstance.get("/api/auth/me");
      const user = userRes.data;

      // ✅ 사용자 정보 저장
      localStorage.setItem("user", JSON.stringify(user));

      // 4️⃣ 승인 여부 및 역할에 따라 분기
      const isVerified = Boolean(user.verified);
      const isActive = Boolean(user.active);

      if (!isVerified || !isActive) {
        navigate("/signup/pending"); // 승인 대기 중
      } else {
        if (user.role === "SALESPERSON") {
          navigate("/sales"); // 영업사원 홈
        } else if (user.role === "ADMIN") {
          navigate("/admin/test"); // 관리자 테스트 페이지(임시)
        } else {
          alert("알 수 없는 사용자 권한입니다.");
        }
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      alert("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="center-line" />
      <div className="left-panel">
        <div className="intro-content">
          <h2 className="brand-title">PROPOZAL</h2>
          <h4 style={{ fontWeight: 700, fontSize: "2.0rem", lineHeight: 1.4, marginBottom: "1rem" }}>
            빠르고 편하게,<br />프로답게
          </h4>
          <p>프로포잘은 언제 어디서나 간편하게 사용할 수 있는<br />견적 관리 솔루션입니다.</p>
        </div>
      </div>

      <div className="right-panel">
        <div className="login-content">
          <h3 className="highlight">로그인</h3>
          <form className="w-100" style={{ maxWidth: "100%", maxInlineSize: "400px" }} onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">이메일 주소</label>
              <input
                type="email"
                className="form-control email-input"
                id="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">비밀번호</label>
              <input
                type="password"
                className="form-control password-input"
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-success w-100 mb-1">SIGN IN</button>

            <div className="or-divider">
              <hr className="line" />
              <span className="or-text">OR</span>
              <hr className="line" />
            </div>

            <button className="btn btn-outline-dark w-100 mb-2">
              <img src="/google.png" alt="Google" style={{ width: "20px", marginRight: "10px", verticalAlign: "middle" }} />
              Sign in with Google
            </button>

            <button
              className="btn w-100 mb-4"
              style={{ backgroundColor: "#FEE500", color: "#000", border: "none", fontWeight: "400" }}
            >
              <img src="/kakao.png" alt="Kakao" style={{ width: "25px", marginRight: "10px", verticalAlign: "middle" }} />
              카카오 로그인
            </button>

            <div className="d-flex justify-content-between flex-wrap gap-2">
              <button type="button" className="btn btn-link p-0 link-text" onClick={() => navigate("/signup")}>
                계정이 없으신가요? <span style={{ fontWeight: 600 }}>회원가입</span>
              </button>

              <button type="button" className="btn btn-link p-0 link-text" onClick={() => navigate("/password-reset")}>
                비밀번호 재설정
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
