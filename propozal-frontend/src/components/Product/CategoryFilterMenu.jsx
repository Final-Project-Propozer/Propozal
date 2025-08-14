import React, { useEffect, useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import axiosInstance from '../../api/axiosInstance';

const CategoryFilterMenu = ({ selectedCategories, onCategoryChange, onClearFilters }) => {
  const [categoryTree, setCategoryTree] = useState({});
  const [loading, setLoading] = useState(true);

  // ✅ 카테고리 트리 불러오기
  useEffect(() => {
    axiosInstance.get('/api/categories/tree')
      .then((res) => {
        setCategoryTree(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('카테고리 트리 불러오기 실패:', err);
        setLoading(false);
      });
  }, []);

  const handleSelect = (level, value) => {
    onCategoryChange(level, value);
  };

  return (
    <div>
      <h5 className="mb-3">카테고리 필터링</h5>

      {/* ✅ 선택된 필터 표시 */}
      {(selectedCategories.lv1 || selectedCategories.lv2 || selectedCategories.lv3) && (
        <div className="mb-3">
          <strong>선택된 카테고리:</strong>
          <div className="mt-2">
            {selectedCategories.lv1 && (
              <span className="badge bg-primary me-2">{selectedCategories.lv1Name}</span>
            )}
            {selectedCategories.lv2 && (
              <span className="badge bg-success me-2">{selectedCategories.lv2Name}</span>
            )}
            {selectedCategories.lv3 && (
              <span className="badge bg-warning text-dark me-2">{selectedCategories.lv3Name}</span>
            )}
            <Button variant="outline-danger" size="sm" onClick={onClearFilters}>
              필터 초기화
            </Button>
          </div>
        </div>
      )}

      {/* ✅ 카테고리 선택 */}
      {loading ? (
        <Spinner animation="border" size="sm" />
      ) : (
        <div className="d-flex flex-column gap-2">
          {/* 1단계 */}
          {Object.keys(categoryTree).map((lv1) => (
            <Button
              key={lv1}
              variant={selectedCategories.lv1 === lv1 ? 'primary' : 'outline-primary'}
              onClick={() => handleSelect('lv1', lv1)}
            >
              {lv1}
            </Button>
          ))}

          {/* 2단계 */}
          {selectedCategories.lv1 &&
            Object.keys(categoryTree[selectedCategories.lv1] || {}).map((lv2) => (
              <Button
                key={lv2}
                variant={selectedCategories.lv2 === lv2 ? 'success' : 'outline-success'}
                className="ms-3"
                onClick={() => handleSelect('lv2', lv2)}
              >
                └ {lv2}
              </Button>
            ))}

          {/* 3단계 */}
          {selectedCategories.lv2 &&
            (categoryTree[selectedCategories.lv1]?.[selectedCategories.lv2] || []).map((lv3) => (
              <Button
                key={lv3}
                variant={selectedCategories.lv3 === lv3 ? 'warning' : 'outline-warning'}
                className="ms-4"
                onClick={() => handleSelect('lv3', lv3)}
              >
                └─ {lv3}
              </Button>
            ))}
        </div>
      )}
    </div>
  );
};

export default CategoryFilterMenu;
