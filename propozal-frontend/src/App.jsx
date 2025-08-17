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
import PasswordResetForm from './components/PasswordResetForm/PasswordResetForm';
import ScheduleCreatePage from './pages/Schedule/ScheduleCreatePage';
import ScheduleEditPage from './pages/Schedule/ScheduleEditPage';
import ScheduleDetailPage from './pages/Schedule/ScheduleDetailPage';
import ScheduleListPage from './pages/Schedule/ScheduleListPage';
import ProductDetailPage from './pages/Product/ProductDetailPage';
import ProductPageLayout from './pages/Product/ProductPageLayout';
import ProductFavorite from './pages/Product/ProductFavorite';
import EstimateListPage from './pages/EstimateView/EstimateListPage';
import ApprovalPendingPage from './pages/Signup/ApprovalPendingPage';
import CustomerRegister from './pages/Customer/CustomerRegister';
import CustomerDetail from './pages/Customer/CustomerDetail';
import CustomerList from './pages/Customer/CustomerList';

const App = () => {
  return (
    <Routes>
      {/* 공통 레이아웃이 필요한 페이지들 */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/signup" element={<Layout><Signup /></Layout>} />
      {/* <Route path="/estimate" element={<Layout><EstimateDetail /></Layout>} /> */}
      <Route path="/password-reset" element={<Layout><PasswordResetForm /></Layout>} />

      {/* 레이아웃이 필요 없는 페이지들 */}
      <Route path="/login" element={<Login />} />
      <Route path="/sales" element={<SalesMainPage />} />
      <Route path="/estimate/:id" element={<EstimateView />} />
      <Route path="/estimate/create" element={<EstimatePage />} /> {/* ✅ 견적서 생성 페이지 */}
      <Route path="/admin/test" element={<AdminTestPage />} />
      <Route path="/schedule/create" element={<ScheduleCreatePage />} />
      <Route path="/schedule/edit" element={<ScheduleEditPage />} />
      <Route path="/schedule/detail" element={<ScheduleDetailPage />} />
      <Route path="/schedule/list" element={<ScheduleListPage />} />
      <Route path="/products/:productId" element={<ProductDetailPage />} />
      <Route path="/products" element={<ProductPageLayout />} />
      <Route path="/products/favorites" element={<ProductFavorite />} />
      <Route path="/estimate/list" element={<EstimateListPage />} />
      <Route path="/signup/pending" element={<ApprovalPendingPage />} />
      <Route path="/customer/register" element={<CustomerRegister />} />
      <Route path="/customer/detail" element={<CustomerDetail />} />
      <Route path="/customer/list" element={<CustomerList />} />

    </Routes>
  );
};

export default App;
