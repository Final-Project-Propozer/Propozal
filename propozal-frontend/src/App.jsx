import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Layout from './components/Layout/Layout';

import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import SalesMainPage from './pages/SalesMainPage/SalesMainPage';
import EstimateView from './pages/EstimateView/EstimateView'; 
import EstimatePage from './pages/EstimateCreate/EstimatePage'; 
import AdminTestPage from "./pages/AdminTestPage";
import PasswordResetForm from './components/PasswordResetForm/PasswordResetForm';
//관리자
import AdminDashboard from './pages/Admin/AdminDashboard/AdminDashboard';
import AdminCompanyRegistration from './pages/Admin/AdminCompanyData/AdminRegisterCompanyData';
import AdminSalesRecordsList from './pages/Admin/AdminSalesRecords/AdminSalesRecordsList';
import AdminCompanyDataView from './pages/Admin/AdminCompanyData/AdminCompanyDataView';
import AdminEstimateList from './pages/Admin/AdminEstimate/AdminEstimateList';
import AdminUserAuth from './pages/Admin/AdminAuthMember/AdminUserAuth';
import AdminProductRegistration from './pages/Admin/AdminProduct/AdminProductRegistration';
import AdminViewProduct from './pages/Admin/AdminProduct/AdminViewProduct';
import AdminClientList from './pages/Admin/AdminManageClients/AdminClientList';
import AdminClientRegistration from './pages/Admin/AdminManageClients/AdminClientRegistration';
import AdminProductList from './pages/Admin/AdminProduct/AdminProductList';


const App = () => {
  return (
    <Routes>
      {/* 공통 레이아웃이 필요한 페이지들 */}
      <Route path="/" element={<Layout><Home /></Layout>} />
      <Route path="/signup" element={<Layout><Signup /></Layout>} />
      <Route path="/" element={<Home />} />

      {/* <Route path="/estimate" element={<Layout><EstimateDetail /></Layout>} /> */}
      <Route path="/password-reset" element={<Layout><PasswordResetForm /></Layout>} />

      {/* 레이아웃이 필요 없는 페이지들 */}
      <Route path="/login" element={<Login />} />
      <Route path="/sales" element={<SalesMainPage />} />
      <Route path="/estimate/view" element={<EstimateView />} />
      <Route path="/estimate/create" element={<EstimatePage />} /> {/* ✅ 견적서 생성 페이지 */}
      <Route path="/admin/test" element={<AdminTestPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/company-registration" element={<AdminCompanyRegistration />} />
      <Route path="/admin/salesrecords" element={<AdminSalesRecordsList />} />
      <Route path="/admin/companydataview" element={<AdminCompanyDataView />} />
      <Route path="/admin/estimatelist" element={<AdminEstimateList />} />
      <Route path="/admin/userauthorization" element={<AdminUserAuth />} />
      <Route path="/admin/product-registration" element={<AdminProductRegistration />} />
      <Route path="/admin/product-view" element={<AdminViewProduct />} />
      <Route path="/admin/client-list" element={<AdminClientList />} />
      <Route path="/admin/client-registration" element={<AdminClientRegistration />} />
      <Route path="/admin/product-list" element={<AdminProductList />} />
    </Routes>
  );
};

// 레이아웃 유무로 페이지 구분해두신건 일단 그대로 두었습니다.

export default App;
