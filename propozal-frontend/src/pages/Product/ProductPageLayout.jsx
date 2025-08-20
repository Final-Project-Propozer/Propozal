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

  useEffect(() => {
    const fetchProducts = async () => {
      const params = { page: currentPage, size: 8 };

      if (searchTerm.trim()) {
        params.keyword = searchTerm;
      } else {
        if (selectedCategories.lv1) params.categoryLv1Id = selectedCategories.lv1.id;
        if (selectedCategories.lv2) params.categoryLv2Id = selectedCategories.lv2.id;
        if (selectedCategories.lv3) params.categoryLv3Id = selectedCategories.lv3.id;
      }

      try {
        const res = await axiosInstance.get('/products/search', { params });
        setAllProducts(res.data.content);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error('제품 목록 불러오기 실패:', err);
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm, selectedCategories]);

  const handleSearchChange = (term) => {
    setSearchTerm(term);
    setSelectedCategories({ lv1: null, lv2: null, lv3: null });
    setCurrentPage(0);
  };

  const handleCategoryChange = (level, value) => {
    setSelectedCategories(prev => {
      const updated = { ...prev, [level]: value };
      if (level === 'lv1') { updated.lv2 = null; updated.lv3 = null; }
      else if (level === 'lv2') { updated.lv3 = null; }
      return updated;
    });
    setSearchTerm('');
    setCurrentPage(0);
  };

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
              <Col xs={12} md={3} className="mb-4">
                <ProductSearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
                <CategoryFilterMenu
                    selectedCategories={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                    onClearFilters={handleClearFilters}
                />
              </Col>
              <Col xs={12} md={9}>
                <ProductList products={allProducts} />
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
