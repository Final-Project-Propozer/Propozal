import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import axiosInstance from '../../api/axiosInstance';

import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';
import ProductSearchBar from '../../components/Product/ProductSearchBar';
import CategoryFilterMenu from '../../components/Product/CategoryFilterMenu';
import ProductList from '../../components/Product/ProductList';

const ProductPageLayout = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState({
    lv1: null,
    lv2: null,
    lv3: null
  });
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // ✅ 제품 목록 요청 (검색어 또는 카테고리 조건에 따라)
  useEffect(() => {
    const fetchProducts = async () => {
      const params = {
        page: currentPage,
        size: 8
      };

      if (searchTerm.trim()) {
        params.keyword = searchTerm;
      } else {
        if (selectedCategories.lv1) params.categoryLv1Id = selectedCategories.lv1;
        if (selectedCategories.lv2) params.categoryLv2Id = selectedCategories.lv2;
        if (selectedCategories.lv3) params.categoryLv3Id = selectedCategories.lv3;
      }

      try {
        const res = await axiosInstance.get('/products/search', { params });
        setAllProducts(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('제품 목록 불러오기 실패:', err);
        if (err.response?.status === 401) {
          alert('로그인이 필요합니다. 다시 로그인해주세요.');
          window.location.href = '/login';
        }
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm, selectedCategories]);

  // ✅ 검색어 입력 시 카테고리 초기화
  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setSelectedCategories({ lv1: null, lv2: null, lv3: null });
    setCurrentPage(0);
  };

  // ✅ 카테고리 선택 시 검색어 초기화
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

  // ✅ 카테고리 필터 초기화
  const handleClearFilters = () => {
    setSelectedCategories({ lv1: null, lv2: null, lv3: null });
    setCurrentPage(0);
  };

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
                onSearchChange={handleSearchChange}
              />
              <CategoryFilterMenu
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
                onClearFilters={handleClearFilters}
              />
            </Col>

            {/* 오른쪽 제품 목록 */}
            <Col xs={12} md={9}>
              <ProductList products={allProducts} />

              {/* 페이지네이션 버튼 */}
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
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default ProductPageLayout;
