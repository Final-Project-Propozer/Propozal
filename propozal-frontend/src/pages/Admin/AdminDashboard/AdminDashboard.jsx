import React from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';

const AdminDashboard = () => {
  const navbarHeight = '60px'; // 내비게이션 바의 높이 (고정)

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* 상단 내비게이션 바 */}
      <AdminNavbar />

      {/* 대시보드 콘텐츠 영역 */}
      <div 
        className="container flex-grow-1" 
        style={{ paddingTop: navbarHeight }}
      >
        {/* 첫 번째 줄: 큰 카드 3개 */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="card p-3 bg-secondary" style={{height: '200px'}}>
              <h5 className="card-title">첫 번째 카드</h5>
              <p className="card-text">여기에 내용이 들어갑니다.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 bg-secondary" style={{height: '200px'}}>
              <h5 className="card-title">두 번째 카드</h5>
              <p className="card-text">여기에 내용이 들어갑니다.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 bg-secondary" style={{height: '200px'}}>
              <h5 className="card-title">세 번째 카드</h5>
              <p className="card-text">여기에 내용이 들어갑니다.</p>
            </div>
          </div>
        </div>

        {/* 두 번째 줄: 중간 카드 2개 */}
        <div className="row mt-4">
          <div className="col-md-8">
            <div className="card p-3 bg-secondary" style={{height: '180px'}}>
              <h5 className="card-title">네 번째 카드</h5>
              <p className="card-text">여기에 내용이 들어갑니다.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card p-3 bg-secondary" style={{height: '180px'}}>
              <h5 className="card-title">다섯 번째 카드</h5>
              <p className="card-text">여기에 내용이 들어갑니다.</p>
            </div>
          </div>
        </div>

        {/* 세 번째 줄: 큰 테이블/차트 영역 */}
        <div className="row mt-4 mb-4">
          <div className="col-md-12">
            <div className="card p-3 bg-secondary" style={{height: '471px'}}>
              <h5 className="card-title">테이블 또는 차트</h5>
              <p className="card-text">여기에 차트나 표가 들어갈 공간입니다.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
};

export default AdminDashboard;