import React, { useState } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { StarFill, Star } from 'react-bootstrap-icons';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const ProductCard = ({ product, onFavoriteRemove }) => {
  const [isFavorite, setIsFavorite] = useState(product.isFavorite !== false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { estimateId } = location.state || {};

  const toggleFavorite = async () => {
    setLoadingFavorite(true);
    try {
      if (isFavorite) {
        await axiosInstance.delete(`/products/favorites/${product.id}`);
        setIsFavorite(false);

        // ✅ 부모에게 알림: 즐겨찾기 목록에서 제거
        if (onFavoriteRemove) {
          onFavoriteRemove(product.id);
        }
      } else {
        await axiosInstance.post('/products/favorites', { productId: product.id });
        setIsFavorite(true);
      }
    } catch (err) {
      console.error('즐겨찾기 변경 실패:', err);
      alert('즐겨찾기 처리 중 오류가 발생했습니다.');
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleAddToEstimate = () => {
    if (estimateId) {
      // ✅ 기존 견적서 수정 페이지로 이동
      navigate(`/estimate/${estimateId}/edit`, { state: { product } });
    } else {
      // ✅ 새 견적서 작성 페이지로 이동
      navigate(`/estimate`, { state: { product } });
    }
  };

  return (
    <>
      <Card className="mb-4 shadow-sm">
        <Link to={`/products/${product.id}`}>
          <Card.Img
            variant="top"
            src={product.imageUrl || 'https://placehold.co/300x200?text=No+Image'}
            alt={product.name}
            style={{ cursor: 'pointer' }}
          />
        </Link>

        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Card.Title className="mb-0">
              <Link to={`/products/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {product.name}
              </Link>
            </Card.Title>

            <span
              onClick={toggleFavorite}
              style={{
                cursor: loadingFavorite ? 'not-allowed' : 'pointer',
                color: isFavorite ? '#fcbf49' : '#ccc',
                fontSize: '1.4rem',
                pointerEvents: loadingFavorite ? 'none' : 'auto'
              }}
              title={isFavorite ? '즐겨찾기 취소' : '즐겨찾기 추가'}
            >
              {loadingFavorite ? (
                <Spinner animation="border" size="sm" />
              ) : isFavorite ? (
                <StarFill size={24} />
              ) : (
                <Star size={24} />
              )}
            </span>
          </div>

          <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>
            코드번호: {product.code}
            <br />
            [소분류] {product.category?.name || '카테고리 없음'}
            <br />
            <strong>{product.basePrice?.toLocaleString()}원</strong>
          </Card.Text>

          <Button variant="success" size="m" className="w-100" onClick={handleAddToEstimate}>
            + 견적서에 추가
          </Button>
        </Card.Body>
      </Card>
    </>
  );
};

export default ProductCard;
