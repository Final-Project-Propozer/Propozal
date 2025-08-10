import React from 'react';
import { Image, Row, Col } from 'react-bootstrap';

const ProductImageSection = () => {
  const thumbnails = [
    '/lion_main.png',
    '/lion_main.png',
    '/lion_main.png',
  ];

  return (
    <div className="p-3">
      {/* 메인 이미지 */}
      <Image
        src="/lion_main.png"
        alt="Main Lion Plush"
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
              alt={`Thumbnail ${idx + 1}`}
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
