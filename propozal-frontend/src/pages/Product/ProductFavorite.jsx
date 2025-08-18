import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axiosInstance from '../../api/axiosInstance';

import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';
import ProductSearchBar from '../../components/Product/ProductSearchBar';
import CategoryFilterMenu from '../../components/Product/CategoryFilterMenu';
import ProductList from '../../components/Product/ProductList';

const ProductFavoritePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState({
    lv1: null,
    lv2: null,
    lv3: null
  });
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ 즐겨찾기 제품 불러오기 (페이징 포함)
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await axiosInstance.get('/api/products/favorites', {
          params: { page: currentPage, size: 8 }
        });

        const favorites = res.data.content || [];
        const withFlag = favorites.map((product) => ({
          ...product,
          isFavorite: true
        }));

        setFavoriteProducts(withFlag);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        console.error('즐겨찾기 목록 불러오기 실패:', err);
      }
    };

    fetchFavorites();
  }, [currentPage]);

  // ✅ 즐겨찾기 해제 시 목록에서 제거
  const handleFavoriteRemove = (productId) => {
    setFavoriteProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  // ✅ 카테고리 필터 변경
  const handleCategoryChange = (level, value) => {
    setSelectedCategories((prev) => {
      const updated = { ...prev, [level]: value };
      if (level === 'lv1') {
        updated.lv2 = null;
        updated.lv3 = null;
      } else if (level === 'lv2') {
        updated.lv3 = null;
      }
      return updated;
    });
    setSearchTerm('');
    setCurrentPage(0);
  };

  // ✅ 필터링된 즐겨찾기 제품 목록
  const filteredFavorites = favoriteProducts.filter((product) => {
    const name = product.name?.toLowerCase() || '';
    const code = product.code?.toLowerCase() || '';
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      code.includes(searchTerm.toLowerCase());

    const categoryId = product.category?.id;
    const parentId = product.category?.parent?.id;
    const grandParentId = product.category?.parent?.parent?.id;

    const matchesCategory =
      !selectedCategories.lv1 ||
      categoryId === selectedCategories.lv1 ||
      parentId === selectedCategories.lv1 ||
      grandParentId === selectedCategories.lv1;

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SalesNavbar />

      <main style={{ flex: 1 }}>
        <Container fluid className="py-4 px-5">
          <Row>
            {/* 왼쪽 필터 영역 */}
            <Col xs={12} md={3} className="mb-4">
              <ProductSearchBar
                searchTerm={searchTerm}
                onSearchChange={(term) => {
                  setSearchTerm(term);
                  setSelectedCategories({ lv1: null, lv2: null, lv3: null });
                  setCurrentPage(0);
                }}
              />
              <CategoryFilterMenu
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                onClearFilters={() =>
                  setSelectedCategories({ lv1: null, lv2: null, lv3: null })
                }
              />
            </Col>

            {/* 오른쪽 즐겨찾기 제품 목록 */}
            <Col xs={12} md={9}>
              <h4 className="fw-bold mb-4">즐겨찾기한 제품</h4>
              {filteredFavorites.length > 0 ? (
                <>
                  <ProductList
                    products={filteredFavorites}
                    onFavoriteRemove={handleFavoriteRemove}
                  />
                  <div className="d-flex justify-content-center mt-4">
                    {[...Array(totalPages)].map((_, idx) => (
                      <Button
                        key={idx}
                        variant={idx === currentPage ? 'primary' : 'outline-secondary'}
                        size="sm"
                        className="mx-1"
                        onClick={() => setCurrentPage(idx)}
                      >
                        {idx + 1}
                      </Button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-muted">즐겨찾기한 제품이 없습니다.</div>
              )}
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default ProductFavoritePage;
