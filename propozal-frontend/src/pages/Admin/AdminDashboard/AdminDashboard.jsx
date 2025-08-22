import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import DashboardChart from '../../../components/Dashboard/DashboardChart.jsx';
import DashboardQuoteList from '../../../components/Dashboard/DashboardQuoteList.jsx';
import DashboardDoughnutChart from '../../../components/Dashboard/DashboardDoughnutChart.jsx';
import axiosInstance from '../../../api/axiosInstance';

const AdminDashboard = () => {
  const navbarHeight = '60px';

  const [userId, setUserId] = useState('');
  const [dashboard, setDashboard] = useState(null);
  const [industryData, setIndustryData] = useState([]);
  const [salesByRep, setSalesByRep] = useState([]);
  const [statusDist, setStatusDist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user?.name) setUserId(user.name);
      else if (user?.email) setUserId(user.email);
      else setUserId('admin');
    } catch {
      setUserId('admin');
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [summaryRes, industryRes] = await Promise.all([
          axiosInstance.get('/dashboard/summary'),
          axiosInstance.get('/dashboard/industry-distribution'),
        ]);

        const summary = summaryRes.data;
        const industry = industryRes.data;

        setDashboard(summary);
        setIndustryData(Array.isArray(industry) ? industry : []);

        // 영업사원별 실적 변환
        const salesByRepSrc = Array.isArray(summary?.salesPersonPerformance)
          ? summary.salesPersonPerformance
          : [];
        const salesByRepForChart = salesByRepSrc.map(d => ({
          month: d?.userName ?? 'N/A',
          estimateCount: Number(d?.estimateCount ?? 0),
        }));
        setSalesByRep(salesByRepForChart);

        // 상태 분포 변환 (객체 → 배열)
        const sdObj = summary?.statusDistribution?.statusDistribution;
        const sdArray = sdObj && typeof sdObj === 'object'
          ? Object.entries(sdObj).map(([status, percent]) => ({
              industry: status,
              customerCount: Number(percent ?? 0),
            }))
          : [];
        setStatusDist(sdArray);
      } catch (e) {
        console.error(e);
        const status = e?.response?.status;
        if (status === 401) {
          setError('인증이 만료되었습니다. 다시 로그인 해주세요.');
          window.location.replace('/login');
          return;
        }
        if (status === 403) {
          setError('접근 권한이 없습니다.');
          window.location.replace('/forbidden');
          return;
        }
        setError('대시보드 데이터를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />

      <div className="container flex-grow-1" style={{ paddingTop: navbarHeight }}>
        {(loading || error) && (
          <div className="row mt-3">
            <div className="col-12">
              {loading && <div className="alert alert-secondary">대시보드 데이터를 불러오는 중...</div>}
              {error && <div className="alert alert-danger">{error}</div>}
            </div>
          </div>
        )}

        <div className="row mt-4">
          <div className="col-md-4">
            <div className="p-3" style={{ height: '200px' }}>
              <h5 className="card-title">관리자 대시보드</h5>
              <p className="card-text">{userId}님, 환영합니다.</p>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 bg-light" style={{ height: '200px' }}>
              <h5 className="card-title">업종별 고객 비율</h5>
              <DashboardDoughnutChart data={industryData} />
            </div>
          </div>

          <div className="col-md-4">
            <div className="card p-3 bg-light" style={{ height: '200px' }}>
              <h5 className="card-title">월별 견적 추이</h5>
              <DashboardChart data={dashboard?.monthlyPerformance || []} />
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-6">
            <div className="card p-3 bg-light" style={{ height: '180px' }}>
              <h5 className="card-title">영업사원별 실적</h5>
              <DashboardChart data={salesByRep} />
            </div>
          </div>
          <div className="col-md-6">
            <div className="card p-3 bg-light" style={{ height: '180px' }}>
              <h5 className="card-title">상태 분포</h5>
              <DashboardDoughnutChart data={statusDist} />
            </div>
          </div>
        </div>

        <div className="row mt-4 mb-4">
          <div className="col-md-12">
            <div className="card p-3 bg-light" style={{ height: '471px' }}>
              <h5 className="card-title mb-4">최근 견적</h5>
              <DashboardQuoteList items={dashboard?.delayedEstimates || []} />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminDashboard;