import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard';
import axiosInstance from '../../api/axiosInstance';

const ProductList = ({ products }) => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [localProducts, setLocalProducts] = useState([]);
  const navigate = useNavigate(); // ✅ 추가

  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axiosInstance.get('/products/favorites');
        const ids = res.data.content?.map((item) => item.id) || [];
        setFavoriteIds(ids);
      } catch (err) {
        console.error('즐겨찾기 목록 불러오기 실패:', err);
      }
    };

    fetchFavorites();
  }, []);

  const productsWithFavorite = localProducts.map((product) => ({
    ...product,
    isFavorite: product.isFavorite ?? favoriteIds.includes(product.id)
  }));

  const totalPages = Math.ceil(productsWithFavorite.length / itemsPerPage);

  useEffect(() => {
    const maxPage = Math.ceil(productsWithFavorite.length / itemsPerPage);
    if (currentPage > maxPage) {
      setCurrentPage(Math.max(1, maxPage));
    }
  }, [productsWithFavorite]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleFavoriteRemove = (productId) => {
    setLocalProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleGoToFavorites = () => {
    navigate('/products/favorites'); // ✅ 경로 이동
  };

  const paginatedProducts = productsWithFavorite.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
      <Row className="align-items-center mb-3">
        <Col>
          <h4 className="mb-0">제품 목록</h4>
        </Col>
        <Col className="text-end">
         <Button
           onClick={handleGoToFavorites}
           style={{
             backgroundColor: 'white',
             border: '2px solid #ffc107',     // 얇은 노란 테두리
             color: 'black',                  // 얇은 검정 텍스트
             fontWeight: '400',              // 텍스트 얇게
             borderRadius: '50px',
             padding: '7px 16px',            // 버튼 높이 줄임
             fontSize: '16px',
             cursor: 'pointer',
             transition: 'all 0.3s ease'
           }}
           onMouseEnter={(e) => {
             e.target.style.backgroundColor = '#ffc107';
             e.target.style.color = 'black'; // 호버 시에도 검정 텍스트 유지
           }}
           onMouseLeave={(e) => {
             e.target.style.backgroundColor = 'white';
             e.target.style.color = 'black';
           }}
         >
           ⭐ 즐겨찾기 목록
         </Button>

        </Col>
      </Row>

      <Row>
        {paginatedProducts.map((product, index) => (
          <Col key={product.id || `product-${index}`} xs={12} sm={6} md={4} lg={3}>
            <ProductCard product={product} onFavoriteRemove={handleFavoriteRemove} />
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              &lt;
            </Pagination.Prev>

            {getPageNumbers().map((pageNum) => (
              <Pagination.Item
                key={pageNum}
                active={pageNum === currentPage}
                onClick={() => handlePageChange(pageNum)}
              >
                {pageNum}
              </Pagination.Item>
            ))}

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
