import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const AdminClientList = () => {
  // 더미데이터
  const [clients, setClients] = useState([]);
  const [selectedClients, setSelectedClients] = useState(new Set());

  useEffect(() => {
    const fetchClients = () => {
      const dummyData = [
        { id: 'user_001', name: '김민준', type: '개인', phone: '010-1234-5678', email: 'kim.mj@example.com' },
        { id: 'user_002', name: '이서윤', type: '법인', phone: '02-987-6543', email: 'lee.sy@corp.com' },
        { id: 'user_003', name: '박하은', type: '개인', phone: '010-2345-6789', email: 'park.he@example.com' },
        { id: 'user_004', name: '최준혁', type: '개인', phone: '010-3456-7890', email: 'choi.jh@example.com' },
        { id: 'user_005', name: '정수아', type: '법인', phone: '070-4567-8901', email: 'jung.sa@corp.com' },
      ];
      setClients(dummyData);
    };

    fetchClients();
  }, []);

  const handleCheckboxChange = (clientId) => {
    setSelectedClients(prevSelected => {
      const newSet = new Set(prevSelected);
      if (newSet.has(clientId)) {
        newSet.delete(clientId);
      } else {
        newSet.add(clientId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allClientIds = new Set(clients.map(client => client.id));
      setSelectedClients(allClientIds);
    } else {
      setSelectedClients(new Set());
    }
  };
  
  const handleAdd = () => {
    alert('고객 추가 버튼이 클릭되었습니다.');
    // 백엔드 연동: 추가직
  };

  const handleModify = () => {
    if (selectedClients.size > 0) {
      alert(`${selectedClients.size}명의 고객 정보가 수정될 예정입니다.`);
      // 백엔드 연동: 수정
    } else {
      alert('수정할 고객을 선택해주세요.');
    }
  };

  const handleDelete = () => {
    if (selectedClients.size > 0) {
      const confirmDelete = window.confirm(`${selectedClients.size}명의 고객을 정말 삭제하시겠습니까?`);
      if (confirmDelete) {
        setClients(clients.filter(client => !selectedClients.has(client.id)));
        setSelectedClients(new Set());
        alert('선택된 고객이 삭제되었습니다.');
      }
    } else {
      alert('삭제할 고객을 선택해주세요.');
    }
  };
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div className="container-fluid flex-grow-1 py-5" style={{ paddingTop: '60px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>고객 목록</h2>
          <div>
            <Button variant="success" className="me-2" onClick={handleAdd}>추가</Button>
            <Button variant="warning" className="me-2" onClick={handleModify}>수정</Button>
            <Button variant="danger" onClick={handleDelete}>삭제</Button>
          </div>
        </div>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th><Form.Check type="checkbox" onChange={handleSelectAll} checked={selectedClients.size === clients.length && clients.length > 0} /></th>
              <th>고객명</th>
              <th>구분</th>
              <th>연락처</th>
              <th>이메일 주소</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(client => (
              <tr key={client.id}>
                <td>
                  <Form.Check 
                    type="checkbox"
                    checked={selectedClients.has(client.id)}
                    onChange={() => handleCheckboxChange(client.id)}
                  />
                </td>
                <td>{client.name}</td>
                <td>{client.type}</td>
                <td>{client.phone}</td>
                <td>{client.email}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <Footer />
    </div>
  );
};

export default AdminClientList;