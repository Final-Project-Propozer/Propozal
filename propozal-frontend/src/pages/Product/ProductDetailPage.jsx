import React from 'react';
import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';
import ProductDetailHeader from '../../components/Product/ProductDetailHeader';
import ProductImageSection from '../../components/Product/ProductImageSection'; // 2번 컴포넌트
import ProductInfoSection from '../../components/Product/ProductInfoSection';   // 3번 컴포넌트
import { Container, Row, Col } from 'react-bootstrap';

const ProductDetailPage = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 상단 네비게이션 */}
      <SalesNavbar />

      {/* 본문 영역 */}
      <main style={{ flex: 1 }}>
        <Container
          className="container-xl py-4 px-5"
          style={{ marginBottom: '30px' }}
        >
          <ProductDetailHeader />
          <Row>
            <Col md={5}>
              <ProductImageSection />
            </Col>
            <Col md={7}>
              <ProductInfoSection />
            </Col>
          </Row>
        </Container>
      </main>

      {/* 하단 푸터 */}
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
