import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import ProductCard from './ProductCard';
import axiosInstance from '../../api/axiosInstance';

const ProductList = ({ products, onProductClick }) => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [localProducts, setLocalProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const isFavoritesPage = location.pathname === '/products/favorites';

  // 1️⃣ 초기 제품 세팅 (localStorage 기반 즐겨찾기)
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    setLocalProducts(
      products.map((p) => ({
        ...p,
        isFavorite: savedFavorites.includes(p.id),
      }))
    );
  }, [products]);

  // 2️⃣ 서버 즐겨찾기 가져오기 (동기화)
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axiosInstance.get('/products/favorites');
        const favoriteIds = res.data.content?.map((item) => item.id) || [];

        setLocalProducts((prev) =>
          prev.map((p) => ({ ...p, isFavorite: favoriteIds.includes(p.id) }))
        );

        // localStorage 동기화
        localStorage.setItem('favorites', JSON.stringify(favoriteIds));
      } catch (err) {
        console.error('즐겨찾기 목록 불러오기 실패:', err);
      }
    };
    fetchFavorites();
  }, []);

  // 3️⃣ 즐겨찾기 토글
  const handleFavoriteToggle = async (productId, newValue) => {
    try {
      if (newValue) {
        await axiosInstance.post('/products/favorites', { productId });
      } else {
        await axiosInstance.delete(`/products/favorites/${productId}`);
      }

      setLocalProducts((prev) => {
        const updated = prev.map((p) =>
          p.id === productId ? { ...p, isFavorite: newValue } : p
        );

        // localStorage 업데이트
        const favoriteIds = updated.filter((p) => p.isFavorite).map((p) => p.id);
        localStorage.setItem('favorites', JSON.stringify(favoriteIds));

        return updated;
      });
    } catch (err) {
      console.error('즐겨찾기 토글 실패:', err);
      alert('즐겨찾기 처리 중 오류가 발생했습니다.');
    }
  };

  const totalPages = Math.ceil(localProducts.length / itemsPerPage);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(Math.max(1, totalPages));
  }, [totalPages, currentPage]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // 페이지별 분기
  const handleSwitchList = () => {
    if (isFavoritesPage) navigate('/products');
    else navigate('/products/favorites');
  };

  const paginatedProducts = localProducts.slice(
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
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <Container fluid>
      <Row className="align-items-center mb-3">
        <Col>
          <h4 className="mb-0">제품 목록</h4>
        </Col>
        <Col className="text-end">
          <Button
            onClick={handleSwitchList}
            style={{
              backgroundColor: 'white',
              border: '2px solid #ffc107',
              color: 'black',
              fontWeight: '400',
              borderRadius: '50px',
              padding: '7px 16px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ffc107';
              e.target.style.color = 'black';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = 'black';
            }}
          >
            {isFavoritesPage ? '📦 전체 품목 목록' : '⭐ 즐겨찾기 목록'}
          </Button>
        </Col>
      </Row>

      <Row>
        {paginatedProducts.map((product, idx) => (
          <Col key={product.id || `product-${idx}`} xs={12} sm={6} md={4} lg={3}>
            <ProductCard
              product={product}
              onFavoriteToggle={handleFavoriteToggle}
              onProductClick={onProductClick}
            />
          </Col>
        ))}
      </Row>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
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
            />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default ProductList;
