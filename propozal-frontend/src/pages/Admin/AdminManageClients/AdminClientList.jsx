import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Pagination from 'react-bootstrap/Pagination';
import axiosInstance from '../../../api/axiosInstance';

const AdminClientList = () => {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [selectedCompanies, setSelectedCompanies] = useState(new Set());
  const [searchParams, setSearchParams] = useState({
    companyName: '',
    businessNumber: '',
    ceoName: '',
    address: '',
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchCompanies = async (page = 0) => {
    try {
      const response = await axiosInstance.get('/admin/company/search', {
        params: {
          ...searchParams,
          page,
          size: 10, // 페이지 당 10개
        },
      });
      setCompanies(response.data.content ?? []);
      setTotalPages(response.data.totalPages ?? 0);
      setCurrentPage(response.data.number ?? 0);
      setSelectedCompanies(new Set()); // 데이터 갱신 시 선택 초기화
    } catch (error) {
      console.error('회사 목록 조회 실패:', error?.response?.data || error.message);
      alert('회사 목록을 불러오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    fetchCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchChange = (e) => {
    setSearchParams((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCompanies(0); // 검색 시 첫 페이지로
  };

  const handleCheckboxChange = (companyId) => {
    setSelectedCompanies(prevSelected => {
      const newSet = new Set(prevSelected);
      if (newSet.has(companyId)) newSet.delete(companyId);
      else newSet.add(companyId);
      return newSet;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allCompanyIds = new Set(companies.map(company => company.id));
      setSelectedCompanies(allCompanyIds);
    } else {
      setSelectedCompanies(new Set());
    }
  };

  const handleAdd = () => {
    // 회사 등록 페이지로 라우팅
    navigate('/admin/client-registration');
  };

  const handleModify = () => {
    if (selectedCompanies.size === 1) {
      const companyId = Array.from(selectedCompanies)[0];
      // 회사 수정 페이지로 라우팅
      navigate(`/admin/clients/${companyId}/edit`);
    } else {
      alert('수정할 회사를 하나만 선택해주세요.');
    }
  };

  const handleDelete = async () => {
    if (selectedCompanies.size > 0) {
      const confirmDelete = window.confirm(`${selectedCompanies.size}개의 회사 정보를 정말 삭제하시겠습니까?`);
      if (!confirmDelete) return;

      try {
        // 개별 삭제 루프 (배치 엔드포인트가 있으면 거기로 교체 가능)
        for (const companyId of selectedCompanies) {
          await axiosInstance.delete(`/admin/company/profile/${companyId}`);
        }
        alert('선택된 회사가 삭제되었습니다.');
        fetchCompanies(currentPage); // 현재 페이지 갱신
      } catch (error) {
        console.error('회사 삭제 실패:', error?.response?.data || error.message);
        alert('회사 삭제에 실패했습니다.');
      }
    } else {
      alert('삭제할 회사를 선택해주세요.');
    }
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div className="container-fluid flex-grow-1" style={{ paddingTop: '100px' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>회사 목록</h2>
          <div>
            <Button variant="success" className="me-2" onClick={handleAdd}>추가</Button>
            <Button variant="warning" className="me-2" onClick={handleModify}>수정</Button>
            <Button variant="danger" onClick={handleDelete}>삭제</Button>
          </div>
        </div>

        {/* 검색 폼 */}
        <Form onSubmit={handleSearch} className="mb-4">
          <div className="row">
            <Form.Group className="col-md-3 mb-2">
              <Form.Control type="text" placeholder="회사명" name="companyName" value={searchParams.companyName} onChange={handleSearchChange} />
            </Form.Group>
            <Form.Group className="col-md-3 mb-2">
              <Form.Control type="text" placeholder="사업자등록번호" name="businessNumber" value={searchParams.businessNumber} onChange={handleSearchChange} />
            </Form.Group>
            <Form.Group className="col-md-3 mb-2">
              <Form.Control type="text" placeholder="대표자명" name="ceoName" value={searchParams.ceoName} onChange={handleSearchChange} />
            </Form.Group>
            <div className="col-md-3 mb-2">
              <Button variant="primary" type="submit">검색</Button>
            </div>
          </div>
        </Form>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>
                <Form.Check
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedCompanies.size === companies.length && companies.length > 0}
                />
              </th>
              <th>회사명</th>
              <th>사업자등록번호</th>
              <th>대표자명</th>
              <th>연락처</th>
              <th>이메일</th>
            </tr>
          </thead>
          <tbody>
            {companies.length > 0 ? (
              companies.map(company => (
                <tr key={company.id}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedCompanies.has(company.id)}
                      onChange={() => handleCheckboxChange(company.id)}
                    />
                  </td>
                  <td>{company.companyName}</td>
                  <td>{company.businessNumber}</td>
                  <td>{company.ceoName}</td>
                  <td>{company.contactPhone}</td>
                  <td>{company.email}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">등록된 회사 정보가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </Table>

        {/* 페이지네이션 */}
        {totalPages > 0 && (
          <div className="d-flex justify-content-center">
            <Pagination>
              <Pagination.First onClick={() => fetchCompanies(0)} disabled={currentPage === 0} />
              <Pagination.Prev onClick={() => fetchCompanies(currentPage - 1)} disabled={currentPage === 0} />
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={index === currentPage}
                  onClick={() => fetchCompanies(index)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next onClick={() => fetchCompanies(currentPage + 1)} disabled={currentPage === totalPages - 1} />
              <Pagination.Last onClick={() => fetchCompanies(totalPages - 1)} disabled={currentPage === totalPages - 1} />
            </Pagination>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default AdminClientList;