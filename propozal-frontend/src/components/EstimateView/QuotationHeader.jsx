import React from 'react';
import { Button } from 'react-bootstrap';
import { FaEnvelope, FaDownload } from 'react-icons/fa';
import './QuotationHeader.css';

const QuotationHeader = () => {
  return (
    <div className="quotation-header container py-4">
      <div className="header-row d-flex flex-column flex-md-row align-items-center justify-content-between">
        <h1 className="quotation-title mb-3 mb-md-0">견적서</h1>
        <div className="button-group d-flex flex-wrap gap-3">
          <Button variant="outline-primary" className="pill-button">
            <FaEnvelope className="me-2" /> 이메일 전송
          </Button>
          <Button variant="outline-success" className="pill-button">
            <FaDownload className="me-2" /> 다운로드
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuotationHeader;
