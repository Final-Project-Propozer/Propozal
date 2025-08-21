import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import SalesMainPage from "./pages/SalesMainPage/SalesMainPage";
import AdminTestPage from "./pages/AdminTestPage";
import PasswordResetForm from "./components/PasswordResetForm/PasswordResetForm";
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
import EstimateListPageAll from "./pages/EstimateList/EstimateListPageAll";
import KakaoCallback from "./pages/KakaoCallback/KakaoCallback";

import AuthProvider from "./context/AuthContext";
import { RequireAuth, RequireRole, GuestOnly } from "./routes/guards";

function LandingRedirect() {
  const hasToken = !!localStorage.getItem("accessToken");
  const userRaw = localStorage.getItem("user");
  const role = userRaw ? JSON.parse(userRaw).role : null;
  if (!hasToken) return <Navigate to="/login" replace />;
  return <Navigate to={role === "ADMIN" ? "/admin/dashboard" : "/sales"} replace />;
}

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        {/* 루트 → 역할 홈으로 정규화 */}
        <Route path="/" element={<Layout><LandingRedirect /></Layout>} />

        {/* 로그인/회원가입은 게스트 전용 */}
        <Route element={<GuestOnly />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Layout><Signup /></Layout>} />
          <Route path="/password-reset" element={<Layout><PasswordResetForm /></Layout>} />
          <Route path="/kakao/callback" element={<KakaoCallback />} />
          <Route path="/signup/pending" element={<ApprovalPendingPage />} />
        </Route>

        {/* 인증 필요 */}
        <Route element={<RequireAuth />}>
          <Route path="/sales" element={<SalesMainPage />} />
          <Route path="/schedule/create" element={<ScheduleCreatePage />} />
          <Route path="/schedule/edit" element={<ScheduleEditPage />} />
          <Route path="/schedule/:id" element={<ScheduleDetailPage />} />
          <Route path="/schedule/list" element={<ScheduleListPage />} />
          <Route path="/products/:productId" element={<ProductDetailPage />} />
          <Route path="/products" element={<ProductPageLayout />} />
          <Route path="/products/favorites" element={<ProductFavorite />} />
          <Route path="/estimate/list" element={<EstimateListPage />} />
          <Route path="/customer/register" element={<CustomerRegister />} />
          <Route path="/customer/:id" element={<CustomerDetail />} />
          <Route path="/customer/list" element={<CustomerList />} />
          <Route path="/estimate" element={<EstimatePageCreation />} />
          <Route path="/estimate/:id" element={<EstimateDetailPage />} />
          <Route path="/schedule/:scheduleId/edit" element={<ScheduleEdit />} />
          <Route path="/estimate/:id/edit" element={<EstimateEditPage />} />
          <Route path="/estimate/:estimateId/versions" element={<EstimateVersionListPage />} />
          <Route path="/estimate-version/:versionId" element={<EstimateVersionDetailPage />} />
          <Route path="/estimate/completedlist" element={<EstimateCompletedListPage />} />
          <Route path="/estimate/list-all" element={<EstimateListPageAll />} />
          <Route path="/admin/test" element={<AdminTestPage />} />
        </Route>

        {/* 관리자 전용 */}
        <Route element={<RequireRole roles={["ADMIN"]} />}>
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
        </Route>

        <Route path="/forbidden" element={<div>권한이 없습니다.</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
