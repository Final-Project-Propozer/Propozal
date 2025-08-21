import React, { useState } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (clientType === '법인') {
      // 🟢 백엔드 DTO 필드명에 맞춰 객체 구성
      const companyData = {
        adminUserId: 12, // ⚠️ 실제 관리자 ID로 교체 필요
        companyName: name,
        businessNumber: businessRegistrationNumber,
        ceoName: representativeName,
        businessType: businessType,
        businessItem: businessCategory, // 🟢 businessCategory -> businessItem으로 변경
        address: address,
        contactPhone: phone, // 🟢 phone -> contactPhone으로 변경
      };
      
      console.log('백엔드로 전송할 회사 데이터:', companyData);
      
      const API_URL = 'http://localhost:8080/admin/company/register';
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
          alert("로그인이 필요합니다.");
          return;
      }

      try {
        await axios.post(API_URL, companyData, {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
        alert('회사 정보가 성공적으로 등록되었습니다!');
        
        // 폼 초기화
        setClientType('개인');
        setName('');
        setPhone('');
        setAddress('');
        setEmail('');
        setRepresentativeName('');
        setBusinessType('');
        setBusinessCategory('');
        setBusinessRegistrationNumber('');

      } catch (error) {
        console.error('회사 정보 등록 실패:', error.response || error.message);
        alert('회사 정보 등록에 실패했습니다. 상세한 오류를 콘솔에서 확인하세요.');
      }
    } else {
        alert('개인 고객 정보는 현재 등록할 수 없습니다. 법인 고객 정보만 등록 가능합니다.');
    }
  };

  const handleCancel = () => {
    alert('고객 등록이 취소되었습니다.');
    // TODO: 이전 페이지로 이동 로직 추가
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