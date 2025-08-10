import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';
import ProductSearchBar from '../../components/Product/ProductSearchBar';
import CategoryFilterMenu from '../../components/Product/CategoryFilterMenu';
import ProductList from '../../components/Product/ProductList';

// 예시 즐겨찾기 제품 데이터
const favoriteProducts = [
  {
    image: '/lion_main.png',
    name: '멋쟁이 사자 인형',
    code: 'A12345678',
    category: '완구',
    price: 4000,
  },
  {
    image: '/lion_main.png',
    name: '고속 베어링',
    code: 'B98765432',
    category: '기계부품',
    price: 12000,
  },
  // ...백엔드 연동 시 즐겨찾기된 제품만 받아오기
];

const ProductFavoritePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);

  // 카테고리 필터 토글
  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // 필터링된 즐겨찾기 제품 목록
  const filteredFavorites = favoriteProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

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
                onSearchChange={setSearchTerm}
              />
              <CategoryFilterMenu
                selectedCategories={selectedCategories}
                onCategoryChange={handleCategoryChange}
              />
            </Col>

            {/* 오른쪽 즐겨찾기 제품 목록 */}
            <Col xs={12} md={9}>
              <h4 className="fw-bold mb-4">즐겨찾기한 제품</h4>
              <ProductList products={filteredFavorites} />
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default ProductFavoritePage;
