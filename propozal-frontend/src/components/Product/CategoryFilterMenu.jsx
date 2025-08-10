import React from 'react';
import { Form, Button } from 'react-bootstrap';

// 계층적 카테고리 구조
const categoryTree = {
  전자제품: ['노트북', '모니터', '키보드'],
  기계부품: ['베어링', '모터', '기어'],
  원자재: ['철', '알루미늄', '플라스틱'],
};

const CategoryFilterMenu = ({
  selectedCategories = [], // 기본값 설정
  onCategoryChange,
  onClearFilters,
}) => {
  const handleToggle = (category) => {
    onCategoryChange(category);
  };

  return (
    <div>
      <h5 className="mb-3">카테고리 필터링</h5>

      {/* 선택된 필터 표시 */}
      {selectedCategories.length > 0 && (
        <div className="mb-3">
          <strong>적용된 필터:</strong>{' '}
          {selectedCategories.map((cat) => (
            <span key={cat} className="badge bg-secondary me-2">
              {cat}
            </span>
          ))}

          {/* 필터 초기화 버튼 */}
          <div className="mt-2">
            <Button variant="outline-danger" size="sm" onClick={onClearFilters}>
              필터 초기화
            </Button>
          </div>
        </div>
      )}

      {/* 카테고리 체크박스 */}
      <Form>
        {Object.entries(categoryTree).map(([parent, children]) => (
          <div key={parent} className="mb-2">
            <Form.Check
              type="checkbox"
              label={parent}
              checked={selectedCategories.includes(parent)}
              onChange={() => handleToggle(parent)}
            />

            {selectedCategories.includes(parent) &&
              children.map((child) => (
                <Form.Check
                  key={child}
                  type="checkbox"
                  label={`— ${child}`}
                  checked={selectedCategories.includes(child)}
                  onChange={() => handleToggle(child)}
                  className="ms-3"
                />
              ))}
          </div>
        ))}
      </Form>
    </div>
  );
};

export default CategoryFilterMenu;
