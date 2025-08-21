import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import SalesNavbar from "../../components/Navbar/SalesNavbar";
import Footer from "../../components/Footer/Footer";
import ProductSearchBar from "../../components/Product/ProductSearchBar";
import CategoryFilterMenu from "../../components/Product/CategoryFilterMenu";
import ProductList from "../../components/Product/ProductList";
import QuoteModal from "../../components/Product/QuoteModal";

const ProductPageLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isFavoritesListPage = location.pathname === "/products";

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState({
    lv1: null,
    lv2: null,
    lv3: null,
  });
  const [allProducts, setAllProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // 모드 전환 시 검색/필터/페이지 초기화
  useEffect(() => {
    setSearchTerm("");
    setSelectedCategories({ lv1: null, lv2: null, lv3: null });
    setCurrentPage(0);
  }, [isFavoritesListPage]);

  useEffect(() => {
    const fetchProducts = async () => {
      const params = { page: currentPage, size: 8 };

      if (!isFavoritesListPage) {
        if (searchTerm.trim()) {
          params.keyword = searchTerm;
        } else {
          if (selectedCategories.lv1)
            params.categoryLv1Id = selectedCategories.lv1.id;
          if (selectedCategories.lv2)
            params.categoryLv2Id = selectedCategories.lv2.id;
          if (selectedCategories.lv3)
            params.categoryLv3Id = selectedCategories.lv3.id;
        }
      }

      try {
        const endpoint = isFavoritesListPage
          ? "/products"
          : "/products/favorites";

        const res = await axiosInstance.get(endpoint, { params });
        setAllProducts(res.data.content || []);
        setTotalPages(res.data.totalPages ?? 1);
      } catch (err) {
        console.error("제품 목록 불러오기 실패:", err);
        if (err.response?.status === 401) {
          alert("로그인이 필요합니다. 다시 로그인해주세요.");
          window.location.href = "/login";
        }
      }
    };

    fetchProducts();
  }, [currentPage, searchTerm, selectedCategories, isFavoritesListPage]);

  const handleSearchChange = (term) => {
    if (isFavoritesListPage) return; // 즐겨찾기 페이지에서는 검색 비활성
    setSearchTerm(term);
    setSelectedCategories({ lv1: null, lv2: null, lv3: null });
    setCurrentPage(0);
  };

  const handleCategoryChange = (level, value) => {
    if (isFavoritesListPage) return; // 즐겨찾기 페이지에서는 필터 비활성
    setSelectedCategories((prev) => {
      const updated = { ...prev, [level]: value };
      if (level === "lv1") {
        updated.lv2 = null;
        updated.lv3 = null;
      } else if (level === "lv2") {
        updated.lv3 = null;
      }
      return updated;
    });
    setSearchTerm("");
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    if (isFavoritesListPage) return; // 즐겨찾기 페이지에서는 필터 비활성
    setSelectedCategories({ lv1: null, lv2: null, lv3: null });
    setCurrentPage(0);
  };

  const handleProductClick = (productId) => {
    setSelectedProductId(productId);
    setIsModalOpen(true);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <SalesNavbar />

      <main style={{ flex: 1 }}>
        <Container fluid className="py-4 px-5">
          {/* 상단: 타이틀 + 새 견적서 작성 */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">
              {isFavoritesListPage ? "즐겨찾기 목록" : "전체 제품 목록"}
            </h4>
            <Button
              variant="success"
              onClick={() => navigate("/estimate")}
              style={{
                borderRadius: "25px",
                padding: "8px 20px",
                fontWeight: "bold",
              }}
            >
              📄 새 견적서 작성
            </Button>
          </div>

          <Row>
            {/* 왼쪽 필터: 전체 제품 목록에서만 표시 */}
            {!isFavoritesListPage && (
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
            )}

            {/* 오른쪽 제품 영역 */}
            <Col xs={12} md={isFavoritesListPage ? 12 : 9}>
              <ProductList
                products={allProducts}
                onProductClick={handleProductClick}
                favoriteToggleMode={isFavoritesListPage ? "remove" : "add"}
              />

              {/* 페이지네이션 */}
              <div className="d-flex justify-content-center mt-4">
                {[...Array(totalPages)].map((_, idx) => (
                  <Button
                    key={idx}
                    variant={idx === currentPage ? "primary" : "outline-secondary"}
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

      {/* 견적 모달 */}
      <QuoteModal
        show={isModalOpen}
        handleClose={() => setIsModalOpen(false)}
        productId={selectedProductId}
      />
    </div>
  );
};

export default ProductPageLayout;