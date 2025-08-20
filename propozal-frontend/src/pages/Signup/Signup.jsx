import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";  // ✅ 기본 axios 사용

// 🔹 카카오 인증 URL
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=3fdf6a1c367635a4dbc945a816c7a2b1&redirect_uri=http://localhost:5173/kakao/callback&response_type=code`;

const SignupPage = () => {
  const navigate = useNavigate();

  const [company, setCompany] = useState("");
  const [name, setName] = useState("");   // ✅ 사용자 이름 상태 추가
  const [email, setEmail] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [jobTitle, setJobTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailChecked) {
      alert("이메일 중복 확인을 먼저 해주세요.");
      return;
    }

    if (password !== confirmPw) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    const signupData = {
      email,
      password,
      name, // ✅ 사용자 이름 (company가 아니라 name으로 보냄)
      role: jobTitle === "USER" ? "SALESPERSON" : jobTitle
    };

    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:8080/api/auth/signup", signupData);
      alert("회원가입 성공!");
      navigate("/login");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailCheck = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/auth/check-email?email=${email}`);

      if (res.data === true) {
        alert("이미 사용 중인 이메일입니다.");
        setEmailChecked(false);
      } else {
        alert("사용 가능한 이메일입니다.");
        setEmailChecked(true);
      }
    } catch (err) {
      console.error("이메일 중복 확인 오류:", err);
      alert("이메일 확인 중 오류가 발생했습니다.");
      setEmailChecked(false);
    }
  };

  return (
    <div
      className="signup-wrapper02"
      style={{
        padding: "2rem",
        marginTop: "30px",
        maxWidth: "600px",
        margin: "30px auto",
        border: "2px solid #d6d2cb",
        borderRadius: "12px"
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "2rem", fontWeight: "700" }}>
        회원가입
      </h2>

      <form onSubmit={handleSubmit}>
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

        {/* ✅ 이름 입력 필드 추가 */}
        <div className="mb-3">
          <label>이름 *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-control"
          />
        </div>

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
                color: "#fff"
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#DAD7CD";
                e.target.style.color = "#000";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#198754";
                e.target.style.color = "#fff";
              }}
            >
              중복 확인
            </button>
          </div>
        </div>

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
            style={{ backgroundColor: "#ffffff", color: "#333" }}
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
              lineHeight: "1"
            }}
          >
            {showPw ? "🙈" : "👀"}
          </span>
        </div>

        <div className="mb-3" style={{ position: "relative" }}>
          <label>비밀번호 확인 *</label>
          <input
            type={showConfirmPw ? "text" : "password"}
            value={confirmPw}
            onChange={(e) => setConfirmPw(e.target.value)}
            required
            className="form-control"
            placeholder="비밀번호를 다시 입력하세요."
            style={{ color: "#333" }}
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
              lineHeight: "1"
            }}
          >
            {showConfirmPw ? "🙈" : "👀"}
          </span>
        </div>

        <div className="mb-4">
          <label>직책 선택 *</label>
          <select
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
            className="form-select"
          >
            <option value="">선택하세요</option>
            <option value="ADMIN">최고 관리자</option>
            <option value="USER">영업사원</option>
          </select>
        </div>

        <button
          type="submit"
          className="btn w-100 mb-3"
          disabled={isSubmitting}
          style={{
            backgroundColor: "#BDDFBC",
            border: "none",
            color: "#000",
            padding: "0.75rem 1rem",
            fontSize: "1.3rem",
            fontWeight: "600",
            borderRadius: "6px",
            boxSizing: "border-box",
            transition: "outline 0.2s ease",
            opacity: isSubmitting ? 0.6 : 1,
            cursor: isSubmitting ? "not-allowed" : "pointer"
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) e.target.style.outline = "1px solid #000";
          }}
          onMouseLeave={(e) => {
            e.target.style.outline = "none";
          }}
        >
          {isSubmitting ? "회원가입 처리 중..." : "회원가입"}
        </button>

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

        <button type="button" className="btn btn-outline-dark w-100 mb-2">
          <img
            src="/google.png"
            alt="Google"
            style={{ width: "20px", marginRight: "10px", verticalAlign: "middle" }}
          />
          Google로 시작하기
        </button>

        {/* ✅ 카카오 로그인 버튼 */}
        <button
          type="button"
          className="btn w-100 mb-4"
          style={{
            backgroundColor: "#FEE500",
            color: "#000",
            border: "none",
            fontWeight: "400"
          }}
          onClick={() => (window.location.href = KAKAO_AUTH_URL)}
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
