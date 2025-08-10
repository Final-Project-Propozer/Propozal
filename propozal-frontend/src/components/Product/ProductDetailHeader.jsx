import React from 'react';
import { Button } from 'react-bootstrap';
import { ArrowLeft } from 'react-bootstrap-icons';

const ProductDetailHeader = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="d-flex align-items-center"
    style={{ width: '100%', overflow: 'visible', padding: '0 1rem' }}>
      <Button variant="outline-secondary" onClick={handleGoBack} className="me-3 rounded-circle">
        <ArrowLeft size={20} />
      </Button>
      <h4 className="fw-bold mb-0" style={{ color: '#3a5a40' }}>
        제품 상세 정보
      </h4>
    </div>
  );
};

export default ProductDetailHeader;
