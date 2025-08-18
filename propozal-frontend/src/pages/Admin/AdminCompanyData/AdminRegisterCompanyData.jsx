import React, { useState } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';

const AdminCompanyRegistration = () => {
  const [companyName, setCompanyName] = useState('');
  const [ceoName, setCeoName] = useState('');
  const [businessNo, setBusinessNo] = useState('');
  const [address, setAddress] = useState('');
  const [contact, setContact] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessItem, setBusinessItem] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountHolder, setAccountHolder] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); 
    
    const formData = {
      companyName,
      ceoName,
      businessNo,
      address,
      contact,
      businessType,
      businessItem,
      bankName,
      accountNumber,
      accountHolder,
    };
    
    console.log('폼 제출 데이터:', formData);
    
    alert('기업 정보가 성공적으로 등록되었습니다!');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div 
        className="container flex-grow-1 py-5" // ✅ className에서 top-padding을 제거합니다.
        style={{ paddingTop: '120px' }}       // ✅ 인라인 스타일을 추가해 줍니다.
      >
        <h2 className="mb-4">기업 정보 등록</h2>
        
        <form onSubmit={handleSubmit}>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="companyName" className="form-label">기업명</label>
              <input
                type="text"
                className="form-control"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="ceoName" className="form-label">대표명</label>
              <input
                type="text"
                className="form-control"
                id="ceoName"
                value={ceoName}
                onChange={(e) => setCeoName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="businessNo" className="form-label">사업자등록번호</label>
              <input
                type="text"
                className="form-control"
                id="businessNo"
                value={businessNo}
                onChange={(e) => setBusinessNo(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="address" className="form-label">주소</label>
              <input
                type="text"
                className="form-control"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="contact" className="form-label">연락처</label>
              <input
                type="text"
                className="form-control"
                id="contact"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="businessType" className="form-label">업태</label>
              <input
                type="text"
                className="form-control"
                id="businessType"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="businessItem" className="form-label">종목</label>
              <input
                type="text"
                className="form-control"
                id="businessItem"
                value={businessItem}
                onChange={(e) => setBusinessItem(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="bankName" className="form-label">은행</label>
              <input
                type="text"
                className="form-control"
                id="bankName"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="accountNumber" className="form-label">계좌번호</label>
              <input
                type="text"
                className="form-control"
                id="accountNumber"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label htmlFor="accountHolder" className="form-label">예금주</label>
              <input
                type="text"
                className="form-control"
                id="accountHolder"
                value={accountHolder}
                onChange={(e) => setAccountHolder(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary mt-3">
            등록
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default AdminCompanyRegistration;