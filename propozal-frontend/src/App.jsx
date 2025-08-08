import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import SalesMainPage from './pages/SalesMainPage/SalesMainPage';
import EstimateView from './pages/EstimateView/EstimateView'; // ✅ 견적서 조회 페이지
import EstimatePage from './pages/EstimateCreate/EstimatePage'; // ✅ 견적서 생성 페이지 추가
import AdminTestPage from "./pages/AdminTestPage";

const App = () => {
  return (
    <Routes>
      {/* 공통 레이아웃이 필요한 페이지들 */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/signup" element={<Layout><Signup /></Layout>} />
      {/* <Route path="/estimate" element={<Layout><EstimateDetail /></Layout>} /> */}

      {/* 레이아웃이 필요 없는 페이지들 */}
      <Route path="/login" element={<Login />} />
      <Route path="/sales" element={<SalesMainPage />} />
      <Route path="/estimate/view" element={<EstimateView />} />
      <Route path="/estimate/create" element={<EstimatePage />} /> {/* ✅ 견적서 생성 페이지 */}
      <Route path="/admin/test" element={<AdminTestPage />} />
    </Routes>
  );
};

export default App;
