import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import './ProductSearchBar.css'; // 스타일 분리

const ProductSearchBar = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="mb-4 position-relative">
      <h5 className="mb-3">제품 검색</h5>
      <div className="search-input-wrapper">
        <Form.Control
          type="text"
          placeholder="제품명 또는 코드 입력"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        <Search className="search-icon" />
      </div>
    </div>
  );
};

export default ProductSearchBar;
