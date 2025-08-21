import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import axiosInstance from "../../api/axiosInstance"; // 인증된 요청용
import "./Login.css";

// 🔹 카카오 인증 URL
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=3fdf6a1c367635a4dbc945a816c7a2b1&redirect_uri=https://propozal.app/kakao/callback&response_type=code`;

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/auth/login", {
        email,
        password,
      });

      const { accessToken, refreshToken } = response.data;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      const userRes = await axiosInstance.get("/auth/me");
      const user = userRes.data;
      localStorage.setItem("user", JSON.stringify(user));

      if (user.role === "SALESPERSON") {
        navigate("/sales");
      } else if (user.role === "ADMIN") {
        navigate("/admin/companydataview");
      } else {
        alert("알 수 없는 사용자 권한입니다.");
      }
    } catch (error) {
      if (error.response) {
        const msg = error.response.data.message || "";
        if (msg.includes("이메일 인증과 관리자 승인")) {
          alert("이메일 인증과 관리자 승인이 모두 필요합니다.");
        } else if (msg.includes("이메일 인증")) {
          alert("이메일 인증을 먼저 완료해주세요.");
        } else if (msg.includes("승인 대기")) {
          alert("관리자 승인이 필요합니다. 관리자에게 문의하세요.");
        } else {
          alert("로그인 실패: 아이디 또는 비밀번호를 확인해주세요.");
        }
      } else {
        alert("서버 연결 오류");
      }
      console.error("로그인 실패:", error);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="center-line" />
      <div className="left-panel">
        <div className="intro-content">
          <h2 className="brand-title">PROPOZAL</h2>
          <h4
            style={{
              fontWeight: 700,
              fontSize: "2.0rem",
              lineHeight: 1.4,
              marginBottom: "1rem",
            }}
          >
            빠르고 편하게,<br />프로답게
          </h4>
          <p>
            프로포잘은 언제 어디서나 간편하게 사용할 수 있는
            <br />
            견적 관리 솔루션입니다.
          </p>
        </div>
      </div>

      <div className="right-panel">
        <div className="login-content">
          <h3 className="highlight">로그인</h3>
          <form
            className="w-100"
            style={{ maxWidth: "100%", maxInlineSize: "400px" }}
            onSubmit={handleLogin}
          >
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                이메일 주소
              </label>
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
              <label htmlFor="password" className="form-label">
                비밀번호
              </label>
              <input
                type="password"
                className="form-control password-input"
                id="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn btn-success w-100 mb-1">
              SIGN IN
            </button>

            <div className="d-flex justify-content-between flex-wrap gap-2">
              <button
                type="button"
                className="btn btn-link p-0 link-text"
                onClick={() => navigate("/signup")}
              >
                계정이 없으신가요?{" "}
                <span style={{ fontWeight: 600 }}>회원가입</span>
              </button>

              <button
                type="button"
                className="btn btn-link p-0 link-text"
                onClick={() => navigate("/password-reset")}
              >
                비밀번호 재설정
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
