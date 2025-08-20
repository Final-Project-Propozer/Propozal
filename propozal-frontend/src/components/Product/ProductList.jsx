import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import ProductCard from './ProductCard';
import axiosInstance from '../../api/axiosInstance';

const ProductList = ({ products }) => {
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [localProducts, setLocalProducts] = useState([]);

  // ✅ 초기 제품 목록 복사
  useEffect(() => {
    setLocalProducts(products);
  }, [products]);

  // ✅ 즐겨찾기 목록 불러오기
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

  // ✅ 즐겨찾기 상태 반영된 제품 목록
  const productsWithFavorite = localProducts.map((product) => ({
    ...product,
    isFavorite: product.isFavorite ?? favoriteIds.includes(product.id)
  }));

  const totalPages = Math.ceil(productsWithFavorite.length / itemsPerPage);

  // ✅ 페이지 번호 보정 (즐겨찾기 해제 후)
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
      <h4 className="mb-4">제품 목록</h4>

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
