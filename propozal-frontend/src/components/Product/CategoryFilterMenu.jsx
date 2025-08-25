import React, { useEffect, useState } from 'react';
import { Form, Spinner, Button, Badge } from 'react-bootstrap';
import axiosInstance from '../../api/axiosInstance';

const CategoryFilterMenu = ({ selectedCategories, onCategoryChange, onClearFilters }) => {
  const [categoryTree, setCategoryTree] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/admin/categories')
        .then(res => {
          setCategoryTree(buildCategoryTree(res.data));
          setLoading(false);
        })
        .catch(err => {
          console.error('카테고리 불러오기 실패:', err);
          setLoading(false);
        });
  }, []);

  const buildCategoryTree = (categories) => {
    const map = {};
    categories.forEach(c => map[c.id] = { ...c, children: {} });
    const tree = {};
    categories.forEach(c => {
      if (!c.parentId) {
        tree[c.id] = map[c.id];
      } else if (map[c.parentId]) {
        map[c.parentId].children[c.id] = map[c.id];
      }
    });
    return tree;
  };

  const handleSelect = (level, cat) => {
    const updated = { ...selectedCategories };
    if (level === 'lv1') {
      updated.lv1 = cat;
      updated.lv2 = null;
      updated.lv3 = null;
    } else if (level === 'lv2') {
      updated.lv2 = cat;
      updated.lv3 = null;
    } else {
      updated.lv3 = cat;
    }
    onCategoryChange(level, cat);
  };

  // 부분 초기화: 해당 레벨만 null
  const handleRemoveLevel = (level) => {
    const updated = { ...selectedCategories };
    if (level === 'lv1') {
      updated.lv1 = null;
      updated.lv2 = null;
      updated.lv3 = null;
    } else if (level === 'lv2') {
      updated.lv2 = null;
      updated.lv3 = null;
    } else {
      updated.lv3 = null;
    }
    onCategoryChange(level, null);
  };

  const renderTree = (tree, level = 1) => {
    return Object.values(tree).map(cat => {
      const isSelected = selectedCategories[`lv${level}`]?.id === cat.id;
      const marginLeft = `${(level - 1) * 20}px`;

      return (
          <div key={cat.id} style={{ marginLeft }}>
            <Form.Check
                type="checkbox"
                id={`cat-${cat.id}`}
                label={cat.name}
                checked={isSelected}
                onChange={() => handleSelect(`lv${level}`, { id: cat.id, name: cat.name })}
            />
            {isSelected && cat.children && Object.keys(cat.children).length > 0 &&
                renderTree(cat.children, level + 1)
            }
          </div>
      );
    });
  };

  return (
      <div>
        <h5 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
          {/* 필터 아이콘 */}
          <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              fill="currentColor"
              viewBox="0 0 16 16"
          >
            <path d="M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5zm-3-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-2-4a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z"/>
          </svg>
          필터
        </h5>

        {/* 구분선 */}
        <div style={{ height: '1px', backgroundColor: '#ddd', margin: '4px 0 12px 0' }}></div>


        {/* 선택된 카테고리 표시 */}
        {(selectedCategories.lv1 || selectedCategories.lv2 || selectedCategories.lv3) && (
            <div className="mb-2">
              <strong>선택된 카테고리:</strong>
              <div className="mt-1 d-flex flex-wrap gap-1">
                {selectedCategories.lv1 && (
                    <Badge bg="secondary" pill>
                      {selectedCategories.lv1.name}
                      <span
                          className="ms-1"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleRemoveLevel('lv1')}
                      >
                  &times;
                </span>
                    </Badge>
                )}
                {selectedCategories.lv2 && (
                    <Badge bg="secondary" pill>
                      {selectedCategories.lv2.name}
                      <span
                          className="ms-1"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleRemoveLevel('lv2')}
                      >
                  &times;
                </span>
                    </Badge>
                )}
                {selectedCategories.lv3 && (
                    <Badge bg="secondary" pill>
                      {selectedCategories.lv3.name}
                      <span
                          className="ms-1"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleRemoveLevel('lv3')}
                      >
                  &times;
                </span>
                    </Badge>
                )}
              </div>
            </div>
        )}

        {/* 전체 초기화 버튼 */}
        <button
            onClick={onClearFilters}
            style={{
              padding: '4px 12px',
              fontSize: '0.875rem',
              border: '1px solid #ccc',
              borderRadius: '6px',
              backgroundColor: '#f8f9fa',
              color: '#333',
              cursor: 'pointer',
              transition: 'all 0.2s',
              marginTop: '8px'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#e2e6ea'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#f8f9fa'}
        >
          전체 초기화
        </button>

        {/* 구분선 */}
        <div style={{
          height: '1px',
          backgroundColor: '#ddd',
          margin: '12px 0'
        }}></div>


        {/* 카테고리 트리 */}
        <div className="mt-2">
          {loading ? <Spinner animation="border" size="sm" /> : renderTree(categoryTree)}
        </div>
      </div>
  );
};

export default CategoryFilterMenu;
