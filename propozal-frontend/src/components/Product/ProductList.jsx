import React, { useState } from 'react';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import ProductCard from './ProductCard';

const ProductList = ({ products }) => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 페이지네이션 숫자 범위 계산
  const getPageNumbers = () => {
    const maxVisible = 5;
    let start = Math.max(currentPage - Math.floor(maxVisible / 2), 1);
    let end = start + maxVisible - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(end - maxVisible + 1, 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <Container fluid>
      <h4 className="mb-4">제품 목록</h4>

      <Row>
        {paginatedProducts.map((product, index) => (
          <Col key={index} xs={12} sm={6} md={4} lg={3}>
            <ProductCard {...product} />
          </Col>
        ))}
      </Row>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            {/* 이전 페이지 */}
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &lt;
            </Pagination.Prev>

            {/* 숫자 페이지 */}
            {getPageNumbers().map((pageNum) => (
              <Pagination.Item
                key={pageNum}
                active={pageNum === currentPage}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Pagination.Item>
            ))}

            {/* 다음 페이지 */}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              &gt;
            </Pagination.Next>
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default ProductList;
