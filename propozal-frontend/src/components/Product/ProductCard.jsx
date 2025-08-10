import React, { useState } from 'react';
import { Card, Button } from 'react-bootstrap';
import { StarFill, Star } from 'react-bootstrap-icons';
import QuoteModal from './QuoteModal'; // 모달 컴포넌트 import

const ProductCard = ({ image, name, code, category, price }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [showModal, setShowModal] = useState(false); // 모달 상태

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <Card className="mb-4 shadow-sm">
        <Card.Img variant="top" src={image} alt={name} />
        <Card.Body>
          {/* 제품명 + 즐겨찾기 아이콘 */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Card.Title className="mb-0">{name}</Card.Title>
            <span
              onClick={toggleFavorite}
              style={{ cursor: 'pointer', color: '#fcbf49' }}
              title={isFavorite ? '즐겨찾기 취소' : '즐겨찾기 추가'}
            >
              {isFavorite ? <StarFill size={24} /> : <Star size={24} />}
            </span>
          </div>

          {/* 제품 정보 */}
          <Card.Text className="text-muted" style={{ fontSize: '0.9rem' }}>
            코드번호: {code}
            <br />
            [소분류] {category}
            <br />
            <strong>{price.toLocaleString()}원</strong>
          </Card.Text>

          {/* 견적서 추가 버튼 */}
          <Button variant="success" size="m" className="w-100" onClick={handleOpenModal}>
            + 견적서에 추가
          </Button>
        </Card.Body>
      </Card>

      {/* 견적서 선택 모달 */}
      <QuoteModal show={showModal} handleClose={handleCloseModal} />
    </>
  );
};

export default ProductCard;
