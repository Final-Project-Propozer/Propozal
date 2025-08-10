import React, { useState } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { Star } from 'react-bootstrap-icons';
import QuoteModal from './QuoteModal'; // 모달 컴포넌트 import
import './ProductInfoSection.css';

const ProductInfoSection = () => {
  const [quantity, setQuantity] = useState(10);
  const [showModal, setShowModal] = useState(false); // 모달 상태

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div className="p-3">
      {/* 제품 번호 */}
      <div
        className="text-dark mb-2 px-2 py-1 rounded"
        style={{ backgroundColor: '#bbdfbc', display: 'inline-block' }}
      >
        NO. 127
      </div>

      {/* 제품명 + 즐겨찾기 */}
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="fw-bold mb-0">멋쟁이사자처럼 인형</h3>
        <Button
          variant="outline-warning"
          size="lg"
          className="text-dark rounded-pill px-3 py-2"
          style={{
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)',
            fontSize: '1.05rem',
            fontWeight: 500,
          }}
        >
          <Star className="me-2" style={{ marginTop: '-2px' }} /> 즐겨찾기 추가
        </Button>
      </div>

      {/* 코드 정보 */}
      <div className="mb-2 text-secondary">
        카테고리: OOOOOO | 남은 수량: 17EX | 코드번호: K620680
      </div>

      {/* 가격 */}
     <div className="fs-3 fw-bold mb-3" style={{ color: '#188754' }}>
       단가: 18,562원
     </div>

      {/* 설명 */}
      <div className="mb-4">
        <h6 className="fw-semibold">설명</h6>
        <p className="mb-1">대충 제품 설명 내용 / 제품 세부 정보</p>
        <p className="mb-1">대충 제품 설명 내용 / 제품 세부 정보2</p>
        <p className="mb-1">대충 제품 설명 내용 / 제품 세부 정보3</p>
        <p className="mb-1">대충 제품 설명 내용 / 제품 세부 정보3</p>
        <p className="mb-1">대충 제품 설명 내용 / 제품 세부 정보3</p>
        <p className="mb-1">대충 제품 설명 내용 / 제품 세부 정보3</p>
        <p className="mb-1">대충 제품 설명 내용 / 제품 세부 정보3</p>
      </div>

      {/* 수량 선택 카드 */}
      <Card className="p-3 shadow-sm align-items-center">
        <Form.Group style={{ marginBottom: '0' }}>
          <div className="d-flex align-items-center flex-wrap gap-3">
            {/* 수량 선택 라벨 */}
            <Form.Label className="mb-0 fw-bold" style={{ fontSize: '1.3rem' }}>
              수량 선택
            </Form.Label>

            {/* 수량 조절 버튼 & 입력창 */}
            <div className="d-flex align-items-center">
              <Button
                variant="outline-secondary"
                onClick={() => handleQuantityChange(-1)}
                style={{ fontSize: '1.1rem', padding: '0.4rem 0.8rem' }}
              >
                -
              </Button>

              <Form.Control
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="mx-2 text-center no-spinner"
                style={{
                  maxWidth: '100px',
                  fontSize: '1.1rem',
                  padding: '0.4rem 0.6rem',
                  height: '2.6rem',
                  lineHeight: '2.6rem',
                  verticalAlign: 'middle',
                }}
              />

              <Button
                variant="outline-secondary"
                onClick={() => handleQuantityChange(1)}
                style={{ fontSize: '1.1rem', padding: '0.4rem 0.8rem' }}
              >
                +
              </Button>
            </div>

            {/* 견적서에 추가하기 버튼 */}
            <Button
              variant="success"
              style={{
                fontSize: '1.1rem',
                padding: '0.5rem 1rem',
                whiteSpace: 'nowrap',
              }}
              onClick={handleOpenModal}
            >
              견적서에 추가하기
            </Button>
          </div>
        </Form.Group>
      </Card>

      {/* 견적서 선택 모달 */}
      <QuoteModal show={showModal} handleClose={handleCloseModal} />
    </div>
  );
};

export default ProductInfoSection;
