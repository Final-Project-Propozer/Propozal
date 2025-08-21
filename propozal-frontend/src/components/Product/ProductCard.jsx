import React, { useState } from 'react';
import { Card, Button, Spinner } from 'react-bootstrap';
import { StarFill, Star } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onFavoriteToggle, onProductClick }) => {
  const [loading, setLoading] = useState(false);

  const handleToggle = async () => {
    setLoading(true);
    await onFavoriteToggle(product.id, !product.isFavorite);
    setLoading(false);
  };

  const handleAddToEstimate = () => {
    if (onProductClick) onProductClick(product.id);
  };

  const isFavorite = product.isFavorite;

  return (
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
                onClick={handleToggle}
                style={{
                  cursor: loading ? 'not-allowed' : 'pointer',
                  color: isFavorite ? '#fcbf49' : '#ccc',
                  fontSize: '1.4rem',
                  pointerEvents: loading ? 'none' : 'auto',
                }}
                title={isFavorite ? '즐겨찾기 취소' : '즐겨찾기 추가'}
            >
            {loading ? <Spinner animation="border" size="sm" /> : isFavorite ? <StarFill size={24} /> : <Star size={24} />}
          </span>
          </div>

          <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>
            코드번호: {product.code}
            <br />
            [소분류] {product.category?.nameLv3 || '카테고리 없음'}
            <br />
            <strong>{product.basePrice?.toLocaleString()}원</strong>
          </Card.Text>

          <Button variant="success" size="m" className="w-100" onClick={handleAddToEstimate}>
            + 견적서에 추가
          </Button>
        </Card.Body>
      </Card>
  );
};

export default ProductCard;
