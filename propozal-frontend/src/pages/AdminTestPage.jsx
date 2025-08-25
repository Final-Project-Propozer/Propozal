import React from "react";
import AdminNavbar from "../components/Navbar/AdminNavbar"; // 경로는 실제 위치에 맞게 조정
import Footer from "../components/Footer/Footer"; // 푸터 컴포넌트도 동일하게 import

const AdminTestPage = () => {
  return (
    <>
      <AdminNavbar />
      <main
        className="container"
        style={{ marginTop: '70px', marginBottom: '0px', paddingTop: '32px' }}
      >
        <h1 className="text-center">🔧 관리자 테스트 페이지</h1>
        <p className="text-muted text-center">
          AdminNavbar와 Footer가 정상적으로 렌더링되는지 확인하는 페이지입니다.
        </p>
      </main>
      <Footer />
    </>
  );
};

export default AdminTestPage;
