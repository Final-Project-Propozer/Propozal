import React, { useEffect, useState } from 'react';
import {
  Table,
  Container,
  Spinner,
  Alert,
  Badge,
  Pagination,
  Form
} from 'react-bootstrap';
import axiosInstance from '../../api/axiosInstance';
import { Link } from 'react-router-dom';

const CompletedEstimateList = () => {
  const [estimates, setEstimates] = useState([]);
  const [filteredEstimates, setFilteredEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const [searchType, setSearchType] = useState('company');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [dealStatusFilter, setDealStatusFilter] = useState('all');

  const itemsPerPage = 15;

  useEffect(() => {
    const fetchEstimates = async () => {
      try {
        const res = await axiosInstance.get('/api/estimate/completed');
        const data = res.data || [];
        setEstimates(data);
        setFilteredEstimates(data);
      } catch (err) {
        setError('완성된 견적서 목록을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchEstimates();
  }, []);

  const renderDealStatus = (status) => {
    switch (status) {
      case 1:
        return <Badge bg="primary">발송 완료</Badge>;
      case 2:
        return <Badge bg="success">승인</Badge>;
      case 3:
        return <Badge bg="danger">거절</Badge>;
      default:
        return <Badge bg="dark">알 수 없음</Badge>;
    }
  };

  useEffect(() => {
    let filtered = [...estimates];

    if (searchKeyword.trim()) {
      if (searchType === 'company') {
        filtered = filtered.filter(e =>
          e.customerCompanyName?.toLowerCase().includes(searchKeyword.toLowerCase())
        );
      } else if (searchType === 'id') {
        filtered = filtered.filter(e =>
          e.id.toString().includes(searchKeyword.trim())
        );
      }
    }

    if (dealStatusFilter !== 'all') {
      const statusMap = {
        sent: 1,
        approved: 2,
        rejected: 3
      };
      filtered = filtered.filter(e => e.dealStatus === statusMap[dealStatusFilter]);
    }

    setFilteredEstimates(filtered);
    setCurrentPage(1);
  }, [searchKeyword, searchType, dealStatusFilter, estimates]);

  const totalPages = Math.ceil(filteredEstimates.length / itemsPerPage);
  const paginatedEstimates = filteredEstimates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container className="py-4" style={{ marginTop: '0px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0 fw-bold">완성된 견적서 목록 조회</h2>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Form.Select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            style={{ height: '38px', width: '100px', fontSize: '0.9rem' }}
          >
            <option value="company">회사명</option>
            <option value="id">#</option>
          </Form.Select>

          <Form.Control
            type="text"
            placeholder={
              searchType === 'company' ? '회사명으로 검색' : '견적서 번호로 검색'
            }
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ height: '38px', width: '160px', fontSize: '0.9rem' }}
          />

          <Form.Select
            value={dealStatusFilter}
            onChange={(e) => setDealStatusFilter(e.target.value)}
            style={{ height: '38px', width: '140px', fontSize: '0.9rem' }}
          >
            <option value="all">전체 상태</option>
            <option value="sent">발송 완료</option>
            <option value="approved">승인</option>
            <option value="rejected">거절</option>
          </Form.Select>

          {/* ✅ 새 견적서 버튼 추가 */}
          <Link
            to="/estimate"
            className="btn btn-success btn-pill"
            style={{ marginLeft: '32px' }}
          >
            + 새 견적서
          </Link>
        </div>
      </div>

      {loading && <Spinner animation="border" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>제목</th>
                <th>고객 회사명</th>
                <th>총액 (₩)</th>
                <th>거래 상태</th>
                <th>수정일</th>
              </tr>
            </thead>
            <tbody>
              {paginatedEstimates.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center text-muted">견적서가 없습니다.</td>
                </tr>
              ) : (
                paginatedEstimates.map((estimate) => (
                  <tr key={estimate.id}>
                    <td>{estimate.id}</td>
                    <td>
                      <Link to={`/estimate/${estimate.id}`}>
                        견적서 #{estimate.id}
                      </Link>
                    </td>
                    <td>{estimate.customerCompanyName?.trim() || '미입력'}</td>
                    <td>{estimate.totalAmount?.toLocaleString() || '0'}원</td>
                    <td>{renderDealStatus(estimate.dealStatus)}</td>
                    <td>{estimate.updatedAt ? new Date(estimate.updatedAt).toLocaleDateString('ko-KR') : '날짜 없음'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <Pagination className="justify-content-center">
            {[...Array(totalPages)].map((_, index) => (
              <Pagination.Item
                key={index + 1}
                active={index + 1 === currentPage}
                onClick={() => setCurrentPage(index + 1)}
              >
                {index + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default CompletedEstimateList;
