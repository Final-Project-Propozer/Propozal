import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
// import EstimateDetail from './pages/EstimateDetail/EstimateDetail'; // 📌 견적서 조회 페이지
import SalesMainPage from './pages/SalesMainPage/SalesMainPage'; // ✅ 세일즈 메인 페이지 추가

const App = () => {
  return (
    <Routes>
      {/* 공통 레이아웃이 필요한 페이지들 */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/signup" element={<Layout><Signup /></Layout>} />
{/*       <Route path="/estimate" element={<Layout><EstimateDetail /></Layout>} /> */}

      {/* 레이아웃이 필요 없는 페이지들 */}
      <Route path="/login" element={<Login />} />
      <Route path="/sales" element={<SalesMainPage />} /> {/* ✅ 세일즈 전용 페이지 */}
    </Routes>
  );
};

export default App;
