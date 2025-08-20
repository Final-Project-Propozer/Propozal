import React, { useState } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AdminClientRegistration = () => {
  const [clientType, setClientType] = useState('개인');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');

  // 법인 전용 상태
  const [representativeName, setRepresentativeName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [businessRegistrationNumber, setBusinessRegistrationNumber] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    let clientData = {
      clientType,
      name,
      phone,
      address,
      email,
    };
    
    // 법인 추가정보
    if (clientType === '법인') {
      clientData = {
        ...clientData,
        representativeName,
        businessType,
        businessCategory,
        businessRegistrationNumber,
      };
    }
    
    console.log('고객 등록 데이터:', clientData);
    alert('고객 정보가 성공적으로 저장되었습니다!');
    // 백엔드 연동지점: 데이터 서버로 전송하는 호출
  };

  const handleCancel = () => {
    alert('고객 등록이 취소되었습니다.');
    // 이전 페이지로 이동
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div className="container flex-grow-1" style={{ paddingTop: '100px' }}>
      <h2 className="mb-4">고객 등록</h2>
        <Form onSubmit={handleSubmit}>
          {/* 고객 유형 */}
          <Form.Group className="mb-3">
            <Form.Label><b>고객 유형</b></Form.Label>
            <div>
              <Form.Check
                inline
                label="개인"
                name="clientType"
                type="radio"
                id="type-individual"
                value="개인"
                checked={clientType === '개인'}
                onChange={(e) => setClientType(e.target.value)}
              />
              <Form.Check
                inline
                label="법인"
                name="clientType"
                type="radio"
                id="type-corporate"
                value="법인"
                checked={clientType === '법인'}
                onChange={(e) => setClientType(e.target.value)}
              />
            </div>
          </Form.Group>

          {/* 공통 입력 칸 */}
          <Form.Group className="mb-3">
            <Form.Label><b>이름</b></Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ border: '0.3pt solid #A3B18A' }} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label><b>연락처</b></Form.Label>
            <Form.Control type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required style={{ border: '0.3pt solid #A3B18A' }} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label><b>주소지</b></Form.Label>
            <Form.Control type="text" value={address} onChange={(e) => setAddress(e.target.value)} required style={{ border: '0.3pt solid #A3B18A' }} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label><b>이메일 주소</b></Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ border: '0.3pt solid #A3B18A' }} />
          </Form.Group>

          {/* 법인 전용 입력 칸 */}
          {clientType === '법인' && (
            <>
              <hr className="my-4" />
              <h4>법인 추가 정보</h4>
              <Form.Group className="mb-3">
                <Form.Label><b>대표자명</b></Form.Label>
                <Form.Control type="text" value={representativeName} onChange={(e) => setRepresentativeName(e.target.value)} required style={{ border: '0.3pt solid #A3B18A' }} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label><b>업종</b></Form.Label>
                <Form.Control type="text" value={businessType} onChange={(e) => setBusinessType(e.target.value)} required style={{ border: '0.3pt solid #A3B18A' }} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label><b>업태</b></Form.Label>
                <Form.Control type="text" value={businessCategory} onChange={(e) => setBusinessCategory(e.target.value)} required style={{ border: '0.3pt solid #A3B18A' }} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label><b>사업자등록번호</b></Form.Label>
                <Form.Control type="text" value={businessRegistrationNumber} onChange={(e) => setBusinessRegistrationNumber(e.target.value)} required style={{ border: '0.3pt solid #A3B18A' }} />
              </Form.Group>
            </>
          )}

          {/* 버튼 */}
          <div className="mt-4">
            <Button variant="primary" type="submit" className="me-2">저장</Button>
            <Button variant="secondary" onClick={handleCancel}>취소</Button>
          </div>
        </Form>
      </div>
      <Footer />
    </div>
  );
};

export default AdminClientRegistration;