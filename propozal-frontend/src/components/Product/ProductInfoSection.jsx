import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Spinner } from 'react-bootstrap';
import { Star } from 'react-bootstrap-icons';
import axiosInstance from '../../api/axiosInstance';
import QuoteModal from './QuoteModal';
import './ProductInfoSection.css';

const ProductInfoSection = ({ product }) => {
  const [quantity, setQuantity] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);

  // ✅ 초기 즐겨찾기 상태 확인 (전체 목록 기반)
  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const res = await axiosInstance.get('/products/favorites');
        const favoriteIds = res.data.content?.map((item) => item.id) || [];
        setIsFavorite(favoriteIds.includes(product.id));
      } catch (err) {
        console.error('즐겨찾기 상태 확인 실패:', err);
        setIsFavorite(false);
      }
    };

    if (product?.id) {
      fetchFavoriteStatus();
    }
  }, [product.id]);

  // ✅ 즐겨찾기 토글 함수
  const toggleFavorite = async () => {
    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        await axiosInstance.delete(`/products/favorites/${product.id}`);
      } else {
        await axiosInstance.post('/products/favorites', { productId: product.id });
      }
      setIsFavorite(!isFavorite);
    } catch (err) {
      console.error('즐겨찾기 변경 실패:', err);
      alert('즐겨찾기 처리 중 오류가 발생했습니다.');
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="p-3">
      {/* 제품 번호 */}
      <div className="text-dark mb-2 px-2 py-1 rounded" style={{ backgroundColor: '#bbdfbc', display: 'inline-block' }}>
        NO. {product.id}
      </div>

      {/* 제품명 + 즐겨찾기 */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="fw-bold mb-0">{product.name}</h3>
        <Button
          variant={isFavorite ? 'warning' : 'outline-warning'}
          size="lg"
          className="text-dark rounded-pill px-3 py-2"
          style={{
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            fontSize: '1.05rem',
            fontWeight: 500,
            pointerEvents: loadingFavorite ? 'none' : 'auto',
            opacity: loadingFavorite ? 0.6 : 1
          }}
          onClick={toggleFavorite}
        >
          {loadingFavorite ? (
            <Spinner animation="border" size="sm" className="me-2" />
          ) : (
            <Star className="me-2" style={{ marginTop: '-2px' }} />
          )}
          {isFavorite ? '즐겨찾기 취소' : '즐겨찾기 추가'}
        </Button>
      </div>

      {/* 코드 정보 */}
      <div className="mb-2 text-secondary">
{/*         카테고리: {product.category?.name || '없음'} | 남은 수량: {product.stock || '정보 없음'} |  */}
        코드번호: {product.code}
      </div>

      {/* 가격 */}
      <div className="fs-3 fw-bold mb-3" style={{ color: '#188754' }}>
        단가: {product.basePrice?.toLocaleString()}원
      </div>

      {/* 설명 */}
      <div className="mb-4">
        <h6 className="fw-semibold">설명</h6>
        <p className="mb-1">{product.description || '설명 정보가 없습니다.'}</p>
      </div>

      {/* 수량 선택 카드 */}
      <Card className="p-3 shadow-sm align-items-center">
        <Form.Group style={{ marginBottom: '0' }}>
          <div className="d-flex align-items-center flex-wrap gap-3">
            <Form.Label className="mb-0 fw-bold" style={{ fontSize: '1.3rem' }}>
              수량 선택
            </Form.Label>

            <div className="d-flex align-items-center">
              <Button variant="outline-secondary" onClick={() => handleQuantityChange(-1)}> - </Button>
              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mx-2 text-center no-spinner"
                style={{ maxWidth: '100px' }}
              />
              <Button variant="outline-secondary" onClick={() => handleQuantityChange(1)}> + </Button>
            </div>

            <Button variant="success" onClick={handleOpenModal}>
              견적서에 추가하기
            </Button>
          </div>
        </Form.Group>
      </Card>

      {/* 견적서 선택 모달 */}
      <QuoteModal show={showModal} handleClose={handleCloseModal} product={product} quantity={quantity} />
    </div>
  );
};

export default ProductInfoSection;
