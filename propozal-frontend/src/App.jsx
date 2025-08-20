import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from "./components/Layout/Layout";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import SalesMainPage from "./pages/SalesMainPage/SalesMainPage";

import AdminTestPage from "./pages/AdminTestPage";
import PasswordResetForm from "./components/PasswordResetForm/PasswordResetForm";
//관리자
import AdminDashboard from "./pages/Admin/AdminDashboard/AdminDashboard";
import AdminCompanyRegistration from "./pages/Admin/AdminCompanyData/AdminRegisterCompanyData";
import AdminSalesRecordsList from "./pages/Admin/AdminSalesRecords/AdminSalesRecordsList";
import AdminCompanyDataView from "./pages/Admin/AdminCompanyData/AdminCompanyDataView";
import AdminEstimateList from "./pages/Admin/AdminEstimate/AdminEstimateList";
import AdminUserAuth from "./pages/Admin/AdminAuthMember/AdminUserAuth";
import AdminProductRegistration from "./pages/Admin/AdminProduct/AdminProductRegistration";
import AdminViewProduct from "./pages/Admin/AdminProduct/AdminViewProduct";
import AdminClientList from "./pages/Admin/AdminManageClients/AdminClientList";
import AdminClientRegistration from "./pages/Admin/AdminManageClients/AdminClientRegistration";
import AdminProductList from "./pages/Admin/AdminProduct/AdminProductList";

// import EstimateView from './pages/EstimateView/EstimateView'; // ✅ 견적서 조회 페이지
// import EstimatePage from './pages/EstimateCreate/EstimatePage'; // ✅ 견적서 생성 페이지 추가
import ScheduleCreatePage from "./pages/Schedule/ScheduleCreatePage";
import ScheduleEditPage from "./pages/Schedule/ScheduleEditPage";
import ScheduleDetailPage from "./pages/Schedule/ScheduleDetailPage";
import ScheduleListPage from "./pages/Schedule/ScheduleListPage";
import ProductDetailPage from "./pages/Product/ProductDetailPage";
import ProductPageLayout from "./pages/Product/ProductPageLayout";
import ProductFavorite from "./pages/Product/ProductFavorite";
import EstimateListPage from "./pages/EstimateView/EstimateListPage";
import ApprovalPendingPage from "./pages/Signup/ApprovalPendingPage";
import CustomerRegister from "./pages/Customer/CustomerRegister";
import CustomerDetail from "./pages/Customer/CustomerDetail";
import CustomerList from "./pages/Customer/CustomerList";
import EstimatePageCreation from "./pages/EstimateCreate/EstimatePageCreation";
import EstimateDetailPage from "./pages/EstimateView/EstimateDetailPage";
import ScheduleEdit from "./components/Schedule/ScheduleEdit";
import EstimateEditPage from "./pages/Estimate/EstimateEditPage";
import EstimateVersionListPage from "./pages/EstimateVersion/EstimateVersionListPage";
import EstimateVersionDetailPage from "./pages/EstimateVersion/EstimateVersionDetailPage";
import EstimateCompletedListPage from "./pages/EstimateView/EstimateCompletedListPage";

// ✅ 새로 추가
import KakaoCallback from "./pages/KakaoCallback/KakaoCallback";

const App = () => {
  return (
    <Routes>
      {/* 공통 레이아웃이 필요한 페이지들 */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/signup"
        element={
          <Layout>
            <Signup />
          </Layout>
        }
      />
      {/* <Route path="/estimate" element={<Layout><EstimateDetail /></Layout>} /> */}
      <Route
        path="/password-reset"
        element={
          <Layout>
            <PasswordResetForm />
          </Layout>
        }
      />
      {/* ✅ 카카오 로그인 콜백 */}
      <Route path="/kakao/callback" element={<KakaoCallback />} />
      {/* 레이아웃이 필요 없는 페이지들 */}
      <Route path="/login" element={<Login />} />
      <Route path="/sales" element={<SalesMainPage />} />
      {/* <Route path="/estimate/:id" element={<EstimateView />} /> */}
      {/* <Route path="/estimate/create" element={<EstimatePage />} /> */}{" "}
      {/* ✅ 견적서 생성 페이지 */}
      <Route path="/admin/test" element={<AdminTestPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route
        path="/admin/company-registration"
        element={<AdminCompanyRegistration />}
      />
      <Route path="/admin/salesrecords" element={<AdminSalesRecordsList />} />
      <Route path="/admin/companydataview" element={<AdminCompanyDataView />} />
      <Route path="/admin/estimatelist" element={<AdminEstimateList />} />
      <Route path="/admin/userauthorization" element={<AdminUserAuth />} />
      <Route
        path="/admin/product-registration"
        element={<AdminProductRegistration />}
      />
      <Route path="/admin/product-view" element={<AdminViewProduct />} />
      <Route path="/admin/client-list" element={<AdminClientList />} />
      <Route
        path="/admin/client-registration"
        element={<AdminClientRegistration />}
      />
      <Route path="/admin/product-list" element={<AdminProductList />} />
      <Route path="/schedule/create" element={<ScheduleCreatePage />} />
      <Route path="/schedule/edit" element={<ScheduleEditPage />} />
      <Route path="/schedule/:id" element={<ScheduleDetailPage />} />
      <Route path="/schedule/list" element={<ScheduleListPage />} />
      <Route path="/products/:productId" element={<ProductDetailPage />} />
      <Route path="/products" element={<ProductPageLayout />} />
      <Route path="/products/favorites" element={<ProductFavorite />} />
      <Route path="/estimate/list" element={<EstimateListPage />} />
      <Route path="/signup/pending" element={<ApprovalPendingPage />} />
      <Route path="/customer/register" element={<CustomerRegister />} />
      <Route path="/customer/:id" element={<CustomerDetail />} />
      <Route path="/customer/list" element={<CustomerList />} />
      {/* ✅ 견적 관련 페이지들 */}
      <Route path="/estimate" element={<EstimatePageCreation />} />
      <Route path="/estimate/:id" element={<EstimateDetailPage />} />
      <Route path="/schedule/:scheduleId/edit" element={<ScheduleEdit />} />
      <Route path="/estimate/:id/edit" element={<EstimateEditPage />} />
      <Route
        path="/estimate/:estimateId/versions"
        element={<EstimateVersionListPage />}
      />
      <Route
        path="/estimate-version/:versionId"
        element={<EstimateVersionDetailPage />}
      />
      <Route
        path="/estimate/completedlist"
        element={<EstimateCompletedListPage />}
      />
    <Route
        path="/estimate/completedlist"
        element={<EstimateCompletedListPage />}
      />
    </Routes>
  );
};

// 레이아웃 유무로 페이지 구분해두신건 일단 그대로 두었습니다.

export default App;
