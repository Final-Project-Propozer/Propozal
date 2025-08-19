import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KakaoCallbackPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔒 이미 실행했으면 중단
    if (sessionStorage.getItem("kakaoLoginProcessed")) {
      return;
    }
    sessionStorage.setItem("kakaoLoginProcessed", "true");

    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      console.log("카카오 인가 코드:", code);

      axios
        .post("/api/auth/social/login", {
          provider: "kakao",
          authCode: code,
        })
        .then((res) => {
          console.log("백엔드 응답:", res.data);

          // JWT 토큰 저장
          localStorage.setItem("accessToken", res.data.accessToken);
          localStorage.setItem("refreshToken", res.data.refreshToken);

          navigate("/"); // 홈 화면 이동
        })
        .catch((err) => {
          console.error("카카오 로그인 실패:", err);
          alert("카카오 로그인에 실패했습니다. 다시 시도해주세요.");
          navigate("/login");
        });
    } else {
      alert("카카오 인가 코드가 없습니다.");
      navigate("/login");
    }
  }, [navigate]);

  return <div>로그인 처리 중입니다...</div>;
};

export default KakaoCallbackPage;
