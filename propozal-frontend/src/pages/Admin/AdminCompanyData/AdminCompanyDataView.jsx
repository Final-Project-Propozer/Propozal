import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';

const AdminCompanyDataView = () => {
  const [companyInfo, setCompanyInfo] = useState(null);

  useEffect(() => {
    // API를 호출영역
    const dummyData = {
      companyName: 'PropoZal',
      ceoName: '김대표',
      businessNo: '123-45-67890',
      address: '서울시 강남구 테헤란로 123',
      contact: '02-1234-5678',
      businessType: '서비스',
      businessItem: '소프트웨어 개발 및 공급',
      bankName: '신한은행',
      accountNumber: '110-123-456789',
      accountHolder: '프로포잘',
    };
    
    setTimeout(() => {
      setCompanyInfo(dummyData);
    }, 1000);
  }, []);

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div 
        className="container flex-grow-1"
        style={{ paddingTop: '100px' }}
      >
        <h2 className="mb-4">저장된 기업 정보</h2>
        
        {/* companyInfo가 있을 때(법인=yes)일때만 표시 */}
        {companyInfo ? (
          <div className="row">
            <div className="col-md-6 mb-3">
              <p className="fw-bold mb-1">기업명</p>
              <p>{companyInfo.companyName}</p>
            </div>
            <div className="col-md-6 mb-3">
              <p className="fw-bold mb-1">대표명</p>
              <p>{companyInfo.ceoName}</p>
            </div>

            <div className="col-md-6 mb-3">
              <p className="fw-bold mb-1">사업자등록번호</p>
              <p>{companyInfo.businessNo}</p>
            </div>
            <div className="col-md-6 mb-3">
              <p className="fw-bold mb-1">주소</p>
              <p>{companyInfo.address}</p>
            </div>
            
            <div className="col-md-6 mb-3">
              <p className="fw-bold mb-1">연락처</p>
              <p>{companyInfo.contact}</p>
            </div>
            <div className="col-md-6 mb-3">
              <p className="fw-bold mb-1">업태</p>
              <p>{companyInfo.businessType}</p>
            </div>
            
            <div className="col-md-6 mb-3">
              <p className="fw-bold mb-1">종목</p>
              <p>{companyInfo.businessItem}</p>
            </div>
            <div className="col-md-6 mb-3">
              <p className="fw-bold mb-1">은행</p>
              <p>{companyInfo.bankName}</p>
            </div>
            
            <div className="col-md-6 mb-3">
              <p className="fw-bold mb-1">계좌번호</p>
              <p>{companyInfo.accountNumber}</p>
            </div>
            <div className="col-md-6 mb-3">
              <p className="fw-bold mb-1">예금주</p>
              <p>{companyInfo.accountHolder}</p>
            </div>
          </div>
        ) : (
          // 데이터 없을 때 default 문구
          <div><p>기업 정보를 불러오는 중입니다...</p></div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminCompanyDataView;