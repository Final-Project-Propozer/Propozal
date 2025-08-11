import React from 'react';
import { Container, Button } from 'react-bootstrap';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/Footer/Footer';
import { useNavigate } from 'react-router-dom';
import './ApprovalPendingPage.css';

const ApprovalPendingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      {/* 본문 */}
      <main style={{ flex: 1 }}>
        <Container className="d-flex flex-column justify-content-center align-items-center text-center py-5" style={{ minHeight: 'calc(100vh - 160px)' }}>
          {/* 애니메이션 아이콘 */}
          <div className="timer-wrapper mb-4">
            <div className="timer-circle"></div>
            <span className="timer-icon">⏳</span>
          </div>

          {/* 안내 메시지 */}
          <h4 className="fw-bold fs-3 mb-2">가입 요청이 접수되었습니다.</h4>
          <p className="text-muted fs-5 mb-4">관리자의 승인을 기다려주세요.</p>

          <div className="d-flex flex-column flex-md-row justify-content-center gap-3 mt-2">
          <Button
            className="fw-medium"
            style={{ backgroundColor: '#BDDFBC', border: 'none', color: '#000' }}
            onClick={() => navigate('/')}
          >
            홈으로 돌아가기
          </Button>

          <Button
            variant="success"
            className="hover-light fw-medium"
            onClick={() => navigate('/login')}
          >
            로그인 페이지로 이동
          </Button>
          </div>

        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default ApprovalPendingPage;
