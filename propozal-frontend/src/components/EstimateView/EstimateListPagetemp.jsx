import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Spinner,
  Alert,
  Badge,
  Pagination,
  Form,
} from "react-bootstrap";
import axiosInstance from "../../api/axiosInstance";
import { Link } from "react-router-dom";

const EstimateListPagetemp = () => {
  const [estimates, setEstimates] = useState([]);
  const [filteredEstimates, setFilteredEstimates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [searchType, setSearchType] = useState("company");
  const [searchKeyword, setSearchKeyword] = useState("");

  const itemsPerPage = 15;

  useEffect(() => {
    const fetchEstimates = async () => {
      try {
        const res = await axiosInstance.get('/estimate/drafts');
        const data = res.data || [];
        setEstimates(data);
        setFilteredEstimates(data);
      } catch (err) {
        setError("견적서 목록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchEstimates();
  }, []);

  const renderDealStatus = (status) => {
    switch (status) {
      case 0:
        return <Badge bg="secondary">임시저장</Badge>;
      case 1:
        return <Badge bg="info">작성중</Badge>;
      case 2:
        return <Badge bg="success">계약 완료</Badge>;
      case 3:
        return <Badge bg="danger">거절</Badge>;
      default:
        return <Badge bg="dark">알 수 없음</Badge>;
    }
  };

  useEffect(() => {
    let filtered = [...estimates];

    if (searchKeyword.trim()) {
      if (searchType === "company") {
        filtered = filtered.filter((e) =>
          e.customerCompanyName
            ?.toLowerCase()
            .includes(searchKeyword.toLowerCase())
        );
      } else if (searchType === "id") {
        filtered = filtered.filter((e) =>
          e.id.toString().includes(searchKeyword.trim())
        );
      }
    }

    setFilteredEstimates(filtered);
    setCurrentPage(1);
  }, [searchKeyword, searchType, estimates]);

  const totalPages = Math.ceil(filteredEstimates.length / itemsPerPage);
  const paginatedEstimates = filteredEstimates.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Container className="py-4" style={{ marginTop: "0px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="mb-0 fw-bold">📄 임시 저장된 견적서 목록</h2>

        <div className="d-flex align-items-center gap-2 flex-wrap">
          <Form.Select
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
            style={{ height: "38px", width: "100px", fontSize: "0.9rem" }}
          >
            <option value="company">회사명</option>
            <option value="id">#</option>
          </Form.Select>

          <Form.Control
            type="text"
            placeholder={
              searchType === "company"
                ? "회사명으로 검색"
                : "견적서 번호로 검색"
            }
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            style={{ height: "38px", width: "160px", fontSize: "0.9rem" }}
          />

          <Link
            to="/estimate"
            className="btn btn-success btn-pill"
            style={{ marginLeft: "32px" }}
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
                  <td colSpan="6" className="text-center text-muted">
                    견적서가 없습니다.
                  </td>
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
                    <td>{estimate.customerCompanyName?.trim() || "미입력"}</td>
                    <td>{estimate.totalAmount?.toLocaleString() || "0"}원</td>
                    <td>{renderDealStatus(estimate.dealStatus)}</td>
                    <td>
                      {estimate.updatedAt
                        ? new Date(estimate.updatedAt).toLocaleDateString(
                            "ko-KR"
                          )
                        : "날짜 없음"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          <Pagination className="justify-content-center">
            <Pagination.First
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              «
            </Pagination.First>

            {(() => {
              const pageItems = [];
              const maxVisible = 5;
              let startPage = Math.max(
                1,
                currentPage - Math.floor(maxVisible / 2)
              );
              let endPage = startPage + maxVisible - 1;

              if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxVisible + 1);
              }

              for (let i = startPage; i <= endPage; i++) {
                pageItems.push(
                  <Pagination.Item
                    key={i}
                    active={i === currentPage}
                    onClick={() => setCurrentPage(i)}
                  >
                    {i}
                  </Pagination.Item>
                );
              }

              return pageItems;
            })()}

            <Pagination.Last
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              »
            </Pagination.Last>
          </Pagination>
        </>
      )}
    </Container>
  );
};

export default EstimateListPagetemp;
