import React from 'react';
import { Card } from 'react-bootstrap';
import { FaExclamationCircle } from 'react-icons/fa';
import './QuotationFooterInfo.css';

const QuotationFooterInfo = () => {
  return (
    <div className="quotation-footer container text-center my-4">
      {/* 특약사항 카드 */}
      <Card className="special-terms-card mb-3 shadow-sm">
        <Card.Body className="d-flex justify-content-center align-items-center">
          <FaExclamationCircle className="me-2 text-warning" />
          <span className="terms-text">특약사항 없음</span>
        </Card.Body>
      </Card>

      {/* 담당자 정보 */}
      <div className="contact-info mb-3 text-start">
        <p className="contact-text">
          담당자: <strong>영업 1팀 김영업 사원 | 010-1234-5678</strong> | sales@company.com
        </p>
      </div>

      {/* 회사 정보 */}
      <div className="company-info-row">
        <img src="/logo.png" alt="회사 로고" className="company-logo" />
        <p className="company-name">(주)제조미래테크</p>
        <img src="/seal.png" alt="회사 직인" className="company-seal" />
      </div>
    </div>
  );
};

export default QuotationFooterInfo;
