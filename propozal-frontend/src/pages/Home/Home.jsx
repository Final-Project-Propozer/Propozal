import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center pt-5">
      <h1>환영합니다 👋</h1>
      <p>Propozal에 오신 것을 환영합니다. 시작하려면 로그인 또는 회원가입하세요.</p>

      <div className="d-flex justify-content-center gap-3 mt-4">
        <Button variant="primary" onClick={() => navigate('/login')}>
          로그인
        </Button>
        <Button variant="outline-success" onClick={() => navigate('/signup')}>
          회원가입
        </Button>
      </div>

       <p>임시 홈화면입니다.</p>
       <p>스크롤 & footer 확인용</p>
       <p>스크롤 & footer 확인용</p>
       <p>스크롤 & footer 확인용</p>
       <p>스크롤 & footer 확인용</p>
       <p>스크롤 & footer 확인용</p>
       <p>스크롤 & footer 확인용</p>
       <p>스크롤 & footer 확인용</p>
       <p>스크롤 & footer 확인용</p>

    </Container>
  );
};

export default Home;
