import React from 'react';
import { Image, Row, Col } from 'react-bootstrap';

const ProductImageSection = ({ product }) => {
  const mainImage = product.imageUrl || 'https://placehold.co/400x300?text=No+Image';
  const thumbnails = product.thumbnailUrls || [mainImage]; // 썸네일 없으면 메인 이미지 반복

  return (
    <div className="p-3">
      {/* 메인 이미지 */}
      <Image
        src={mainImage}
        alt={`${product.name} 메인 이미지`}
        fluid
        rounded
        className="mb-3 shadow-sm"
        style={{ maxHeight: '400px', objectFit: 'cover' }}
      />

      {/* 썸네일 이미지 */}
      <Row className="g-2">
        {thumbnails.map((src, idx) => (
          <Col xs={3} key={idx} className="px-1">
            <Image
              src={src}
              alt={`썸네일 ${idx + 1}`}
              thumbnail
              style={{ height: '80px', objectFit: 'cover' }}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ProductImageSection;

