import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import axiosInstance from '../../api/axiosInstance';

import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';
import ProductDetailHeader from '../../components/Product/ProductDetailHeader';
import ProductImageSection from '../../components/Product/ProductImageSection';
import ProductInfoSection from '../../components/Product/ProductInfoSection';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axiosInstance.get(`/api/products/${productId}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error('제품 상세 불러오기 실패:', err);
        setProduct(null); // 에러 시 null 처리
      });
  }, [productId]);

  if (!product) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h4>로딩 중..</h4>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SalesNavbar />

      <main style={{ flex: 1 }}>
        <Container className="container-xl py-4 px-5" style={{ marginBottom: '30px' }}>
          <ProductDetailHeader product={product} />
          <Row>
            <Col md={5}>
              <ProductImageSection product={product} />
            </Col>
            <Col md={7}>
              <ProductInfoSection product={product} />
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </div>
  );
};

export default ProductDetailPage;
