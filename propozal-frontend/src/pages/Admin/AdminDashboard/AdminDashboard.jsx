import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import DashboardChart from '../../../components/Dashboard/DashboardChart.jsx';
import DashboardQuoteList from '../../../components/Dashboard/DashboardQuoteList.jsx';
import DashboardDoughnutChart from '../../../components/Dashboard/DashboardDoughnutChart.jsx';

const AdminDashboard = () => {
  const navbarHeight = '60px'; // 내비게이션 바 / 다른페이지에서는 작동 안함.

  // useState로 현재 접속중인 사용자 ID 불러옴.
  const [userId, setUserId] = useState('');

  // 대시보드 데이터 상태
  const [dashboard, setDashboard] = useState(null);
  const [industryData, setIndustryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 백엔드 연동 지점
  useEffect(() => {
    // 더미데이터= ID: "admin123"
    setUserId("admin123");

    const fetchData = async () => {
      try {
        const [summaryRes, industryRes] = await Promise.all([
          fetch('/dashboard/summary'),
          fetch('/dashboard/industry-distribution'),
        ]);
        if (!summaryRes.ok || !industryRes.ok) {
          throw new Error('대시보드 데이터를 불러오지 못했습니다.');
        }
        const [summary, industry] = await Promise.all([
          summaryRes.json(),
          industryRes.json(),
        ]);
        
        setDashboard(summary);
        setIndustryData(industry);
      } catch (e) {
        console.error(e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* 상단 내비게이션 바 */}
      <AdminNavbar />

      {/* 대시보드 */}
      <div 
        className="container flex-grow-1" 
        style={{ paddingTop: navbarHeight }}
      >
      {/* 로딩/에러 표시 */}
              {(loading || error) && (
                <div className="row mt-3">
                  <div className="col-12">
                    {loading && <div className="alert alert-secondary">대시보드 데이터를 불러오는 중...</div>}
                    {error && <div className="alert alert-danger">{error}</div>}
                  </div>
                </div>
              )}
        {/* 1번째 행: 제목/관리자ID */}
        <div className="row mt-4">
          <div className="col-md-4">
            <div className="p-3" style={{height: '200px'}}>
              <h5 className="card-title">관리자 대시보드</h5>
              <p className="card-text">{userId}님, 환영합니다.</p>
            </div>
          </div>
        {/* 1번째 행: 고객업종 통계 파이차트 */}
        <div className="col-md-4">
            <div className="card p-3 bg-light" style={{height: '200px'}}>
                <h5 className="card-title">업종별 고객 비율</h5>
                    <DashboardDoughnutChart data={industryData} />
                </div>
            </div>
          {/* 1번째 행: 견적 실적 통계 차트 */}
          <div className="col-md-4">
            <div className="card p-3 bg-light" style={{height: '200px'}}>
              <h5 className="card-title">월별 견적 추이</h5>
              <DashboardChart data={dashboard?.monthlyPerformance || []} />
            </div>
          </div>
        </div>

        {/* 2번째 행: 영업사원별 실적 / 상태 분포 */}
        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card p-3 bg-light" style={{height: '180px'}}>
              <h5 className="card-title">영업사원별 실적</h5>
              {/* 영업사원별 실적 시각화 차트 컴포넌트 */}
              <DashboardChart/>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-3 bg-light" style={{height: '180px'}}>
              <h5 className="card-title">상태 분포</h5>
              {/* 견적서 상태 분포 시각화 차트 컴포넌트 */}
              <DashboardDoughnutChart/>
            </div>
          </div>
        </div>

        {/* 3번째 행: 견적 목록 */}
        <div className="row mt-4 mb-4">
          <div className="col-md-12">
            <div className="card p-3 bg-light" style={{height: '471px'}}>
              <h5 className="card-title mb-4">최근 견적</h5>
              <DashboardQuoteList items={dashboard?.delayedEstimates || []} />
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