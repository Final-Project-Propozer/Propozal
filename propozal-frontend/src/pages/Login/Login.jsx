import React from "react";
import { useNavigate } from "react-router-dom";  // 🔗 navigate 추가
import "./Login.css";

export default function LoginPage() {
  const navigate = useNavigate();  // 🚀 페이지 이동 함수

  return (
    <div className="login-wrapper">
      {/* 가운데 고정선 (선택사항) */}
      <div className="center-line" />

      {/* 좌측 소개 영역 */}
      <div className="left-panel">
        <div className="intro-content">
          <h2 className="brand-title">PROPOZAL</h2>
          <h4
            style={{
              fontWeight: 700,
              fontSize: "2.0rem",  // 🔠 글자 크기 키우기
              lineHeight: 1.4,
              marginBottom: "1rem"
            }}
          >
            빠르고 편하게,<br />
            프로답게
          </h4>
          <p>프로포잘은 언제 어디서나 간편하게 사용할 수 있는<br />
              견적 관리 솔루션입니다.</p>
        </div>
      </div>

      {/* 우측 로그인 영역 */}
      <div className="right-panel">
        <div className="login-content">
          <h3 class="highlight">로그인</h3>
          <form className="w-100" style={{ maxWidth: "100%", maxInlineSize: "400px" }}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">이메일 주소</label>
{/*               <input type="email" className="form-control" id="email" placeholder="name@example.com" /> */}
           <input
             type="email"
             className="form-control email-input"
             id="email"
             placeholder="name@example.com"
           />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label">비밀번호</label>
{/*               <input type="password" className="form-control" id="password" placeholder="********" /> */}
            <input
              type="password"
              className="form-control password-input"
              id="password"
              placeholder="********"
            />
            </div>

            <button type="submit" className="btn btn-success w-100 mb-1">SIGN IN</button>

{/*             <div className="text-center my-2">OR</div> */}
            <div className="or-divider">
              <hr className="line" />
              <span className="or-text">OR</span>
              <hr className="line" />
            </div>

           {/* 소셜 로그인 */}
           <button className="btn btn-outline-dark w-100 mb-2">
             <img
               src="/google.png"
               alt="Google"
               style={{ width: "20px", marginRight: "10px", verticalAlign: "middle" }}
             />
             Sign in with Google
           </button>

           <button
             className="btn w-100 mb-4"
             style={{
               backgroundColor: "#FEE500",
               color: "#000",
               border: "none",
               fontWeight: "400",
             }}
           >
             <img
               src="/kakao.png"
               alt="Kakao"
               style={{ width: "25px", marginRight: "10px", verticalAlign: "middle" }}
             />
             카카오 로그인
           </button>

            <div className="d-flex justify-content-between flex-wrap gap-2">
              {/* ✅ 회원가입 버튼으로 수정 */}
              <button
                type="button"
                className="btn btn-link p-0 link-text"
                onClick={() => navigate("/signup")}
              >
                계정이 없으신가요? <span style={{ fontWeight: 600 }}>회원가입</span>
              </button>


              <button
                type="button"
                className="btn btn-link p-0 link-text"
                onClick={() => navigate("/forgot-password")}
              >
                아이디 찾기 / 비밀번호 찾기
              </button>

            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
