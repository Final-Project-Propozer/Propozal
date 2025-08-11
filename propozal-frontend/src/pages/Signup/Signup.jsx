import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import './signup.css';

const SignupPage = () => {
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [jobTitle, setJobTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("회원가입 정보:", { company, email, password, jobTitle });
  };

  const handleEmailCheck = () => {
    setEmailChecked(true);
    alert("이메일 중복 확인 완료");
  };

  return (
   <div
     className="signup-wrapper02"
     style={{
       padding: "2rem",
       marginTop: '30px',
       maxWidth: "600px",
//        margin: "0 auto",
       margin: "30px auto",
       border: "2px solid #d6d2cb", // 따뜻한 회색 테두리
       borderRadius: "12px",
//        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)", // 부드러운 그림자 추가
     }}
   >

      <h2 style={{
        textAlign: "center",
        marginBottom: "2rem",
        fontWeight: "700" // 굵게 강조
      }}>
        회원가입
      </h2>

      <form onSubmit={handleSubmit}>
        {/* 회사명 */}
        <div className="mb-3">
          <label>회사명 *</label>
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            className="form-control"
          />
        </div>

        {/* 이메일 + 중복확인 버튼 */}
        <div className="mb-3">
          <label>이메일 *</label>
          <div style={{ position: "relative" }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              minLength={4}
              className="form-control"
              style={{ paddingRight: "90px" }}
            />
           <button
             type="button"
             onClick={handleEmailCheck}
             style={{
               position: "absolute",
               top: "50%",
               right: "10px",
               transform: "translateY(-50%)",
               padding: "6px 10px",
               fontSize: "0.9rem",
               lineHeight: "1.2",
               backgroundColor: "#198754",
               border: "1px solid #666",
               borderRadius: "4px",
               cursor: "pointer",
               whiteSpace: "nowrap",
               color: "#fff", // 텍스트 색상 흰색
             }}
             onMouseEnter={(e) => {
               e.target.style.backgroundColor = "#BDDFBC"; // 마우스 올리면 연두색
               e.target.style.color = "#000";
             }}
             onMouseLeave={(e) => {
               e.target.style.backgroundColor = "#198754"; // 마우스 내리면 원래 초록색
               e.target.style.color = "#fff";
             }}
           >
             중복 확인
           </button>
          </div>
        </div>

        {/* 비밀번호 */}
       {/* 비밀번호 */}
       <div className="mb-3" style={{ position: "relative" }}>
         <label>비밀번호 *</label>
         <input
           type={showPw ? "text" : "password"}
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           required
           minLength={8}
           className="form-control"
           placeholder="영문, 숫자 포함 8자 이상 입력"
           style={{
             backgroundColor: "#ffffff", // 기본 회색 배경
             color: "#333", // 입력된 텍스트 색상
           }}
         />
         <span
           onClick={() => setShowPw((prev) => !prev)}
           style={{
             position: "absolute",
             top: "69%",
             right: "12px",
             transform: "translateY(-45%)",
             cursor: "pointer",
             fontSize: "1.2rem",
             userSelect: "none",
             lineHeight: "1",
           }}
         >
           {showPw ? "🙈" : "👀"}
         </span>
       </div>


        {/* 비밀번호 확인 */}
        <div className="mb-3" style={{ position: "relative" }}>
          <label>비밀번호 확인 *</label>
          <input
            type={showConfirmPw ? "text" : "password"}
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            required
            className="form-control"
            placeholder="비밀번호를 다시 입력하세요." // 기본 안내 문구
            style={{
              color: "#333", // 입력된 상태처럼 보이게
            }}
          />
          <span
            onClick={() => setShowConfirmPw((prev) => !prev)}
            style={{
              position: "absolute",
              top: "69%",
              right: "12px",
              transform: "translateY(-45%)",
              cursor: "pointer",
              fontSize: "1.2rem",
              userSelect: "none",
              lineHeight: "1",
            }}
          >
            {showConfirmPw ? "🙈" : "👀"}
          </span>
        </div>

        {/* 직책 선택 */}
        <div className="mb-4">
          <label>직책 선택 *</label>
          <select
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
            className="form-select"
          >
            <option value="">선택하세요</option>
            <option value="admin">최고 관리자</option>
            <option value="sales">영업사원</option>
          </select>
        </div>

        {/* 가입 버튼 */}
       <button
         type="submit"
         className="btn w-100 mb-3"
         style={{
           backgroundColor: "#BDDFBC",
           border: "none",
           color: "#000",
           padding: "0.75rem 1rem",
           fontSize: "1.3rem",
           fontWeight: "600",
           borderRadius: "6px",
           boxSizing: "border-box",           // 크기 유지
           transition: "outline 0.2s ease",   // 부드러운 효과
         }}
         onMouseEnter={(e) => {
           e.target.style.outline = "1px solid #000"; // 얇은 테두리 생성
         }}
         onMouseLeave={(e) => {
           e.target.style.outline = "none"; // 원상복구
         }}
       >
         회원가입
       </button>

        {/* 로그인 링크 */}
        <div className="text-center mb-3">
          이미 계정이 있으신가요?{" "}
          <button
            type="button"
            className="btn btn-link p-0"
            onClick={() => navigate("/login")}
          >
            로그인
          </button>
        </div>

        {/* 소셜 로그인 */}
        {/* 소셜 로그인 */}
        <button type="button" className="btn btn-outline-dark w-100 mb-2">
          <img
            src="/google.png"
            alt="Google"
            style={{ width: "20px", marginRight: "10px", verticalAlign: "middle" }}
          />
          Google로 시작하기
        </button>

        <button
          type="button"
          className="btn w-100 mb-4"
          style={{
            backgroundColor: "#FEE500",
            color: "#000",
            border: "none",
            fontWeight: "400",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#FEE500";
            e.target.style.border = "1px solid #000000";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#FEE500";
            e.target.style.border = "1px solid #FEE500";
          }}
        >
          <img
            src="/kakao.png"
            alt="Kakao"
            style={{ width: "25px", marginRight: "10px", verticalAlign: "middle" }}
          />
          카카오로 시작하기
        </button>


      </form>
    </div>
  );
};

export default SignupPage;
