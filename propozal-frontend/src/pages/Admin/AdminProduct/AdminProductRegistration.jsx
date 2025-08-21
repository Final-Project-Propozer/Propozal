import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

const AdminProductRegistration = () => {
  // 제품 정보 상태 관리
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  
  // 계층형 카테고리 ID 상태
  const [categoryLv1Id, setCategoryLv1Id] = useState(null);
  const [categoryLv2Id, setCategoryLv2Id] = useState(null);
  const [categoryLv3Id, setCategoryLv3Id] = useState(null);
  
  // UI 관련 상태 관리
  const [previewUrl, setPreviewUrl] = useState('https://dummyimage.com/300x300/000/fff');
  const [showModal, setShowModal] = useState(false);
  
  // 카테고리 관련 상태 관리
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedCategoryName, setSelectedCategoryName] = useState('');

  // 제품 코드 자동 생성
  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  useEffect(() => {
    setCode(generateRandomCode());
  }, []);

  // 평면 배열을 트리 구조로 변환
  const buildCategoryTree = (data) => {
    const map = new Map();
    data.forEach(item => {
      map.set(item.id, { ...item, children: [] });
    });
    const tree = [];
    map.forEach(item => {
      if (item.parentId !== null) {
        const parent = map.get(item.parentId);
        if (parent) {
          parent.children.push(item);
        }
      } else {
        tree.push(item);
      }
    });

    const sortTree = (nodes) => {
      nodes.sort((a, b) => a.name.localeCompare(b.name));
      nodes.forEach(node => {
        if (node.children.length > 0) {
          sortTree(node.children);
        }
      });
      return nodes;
    };
    return sortTree(tree);
  };
  
  // 카테고리 목록 불러오기
  const fetchCategories = async () => {
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }
    try {
      const response = await axios.get('/api/admin/categories', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const tree = buildCategoryTree(response.data);
      setCategories(tree);
    } catch (error) {
      console.error('카테고리 목록 불러오기 실패:', error.response?.data);
      alert('카테고리 목록을 불러오는 데 실패했습니다.');
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchCategories();
    }
  }, [showModal]);

  // 이미지 업로드 로직
  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
      const accessToken = localStorage.getItem('accessToken') ? localStorage.getItem('accessToken').trim() : '';
      if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
      }
      try {
        const formData = new FormData();
        formData.append('file', file);
        const uploadResponse = await axios.post(
          '/api/files/upload/product-images',
          formData,
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        setImageUrl(uploadResponse.data);
        alert('이미지 업로드 성공!');
      } catch (error) {
        console.error('이미지 업로드 실패:', error.response?.data);
        console.error('상태 코드:', error.response?.status);
        if (error.response?.status === 401) {
            alert('인증 실패: 다시 로그인해주세요.');
        } else {
            alert('이미지 업로드에 실패했습니다. 다시 시도해 주세요.');
        }
        setPreviewUrl('https://dummyimage.com/300x300/000/fff');
      }
    }
  };

  const handleShow = () => {
    fetchCategories();
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
  };
  
  // 최종 수정된 카테고리 체크박스 핸들러
  const handleCheckboxChange = (id) => {
      setCategories(prevCategories => {
          const toggleSelection = (nodes) => {
              return nodes.map(cat => {
                  if (cat.id === id) {
                      return { ...cat, isSelected: !cat.isSelected };
                  } else {
                      return { ...cat, isSelected: false, children: cat.children ? toggleSelection(cat.children) : [] };
                  }
              });
          };
          return toggleSelection(prevCategories);
      });
  };
  
  // 카테고리 추가 로직
  const handleAddCategory = async () => {
    if (newCategoryName.trim() === '') {
      alert("카테고리 이름을 입력해주세요.");
      return;
    }
    
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    const selectedCategory = getSelectedCategory(categories);
    const parentId = selectedCategory ? selectedCategory.id : null;
    const newLevel = selectedCategory ? selectedCategory.level + 1 : 1;
    
    const requestBody = {
      name: newCategoryName,
      level: newLevel,
      parentId: parentId
    };

    try {
      const response = await axios.post(
        '/api/admin/categories/insert', 
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const newCatData = response.data;
      await fetchCategories();
      setNewCategoryName('');
      alert(`'${newCatData.name}' 카테고리가 추가되었습니다.`);
    } catch (error) {
      console.error('카테고리 추가 실패:', error.response?.data);
      alert('카테고리 추가에 실패했습니다.');
    }
  };
  
  // 선택된 카테고리 찾는 헬퍼 함수
  const getSelectedCategory = (nodes) => {
    for (const node of nodes) {
      if (node.isSelected) return node;
      if (node.children.length > 0) {
        const found = getSelectedCategory(node.children);
        if (found) return found;
      }
    }
    return null;
  };
  
  // 카테고리 수정 로직
  const handleModifyCategory = async () => {
    const selected = getSelectedCategory(categories);
    if (!selected) {
      alert("수정할 카테고리를 하나만 선택해 주세요.");
      return;
    }
    const newName = prompt(`'${selected.name}'의 새로운 이름을 입력하세요:`, selected.name);
    if (newName && newName.trim() !== '') {
      const accessToken = localStorage.getItem('accessToken');
      try {
        await axios.patch(
          `/api/admin/categories/${selected.id}/update`,
          { name: newName },
          { headers: { 'Authorization': `Bearer ${accessToken}` } }
        );
        alert(`'${selected.name}'이(가) '${newName}'으로 수정되었습니다.`);
        await fetchCategories();
      } catch (error) {
        console.error('카테고리 수정 실패:', error.response?.data);
        alert('카테고리 수정에 실패했습니다.');
      }
    }
  };

  // 카테고리 삭제 로직
  const handleDeleteCategory = async () => {
    const selected = getSelectedCategory(categories);
    if (!selected) {
      alert("삭제할 카테고리를 선택해 주세요.");
      return;
    }
    if (window.confirm(`'${selected.name}'을(를) 삭제하시겠습니까?`)) {
      const accessToken = localStorage.getItem('accessToken');
      try {
        await axios.delete(`/api/admin/categories/${selected.id}/delete`, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        alert("선택된 카테고리가 삭제되었습니다.");
        await fetchCategories();
      } catch (error) {
        console.error('카테고리 삭제 실패:', error.response?.data);
        alert('카테고리 삭제에 실패했습니다.');
      }
    }
  };
  
  // 🟢 최종 수정된 함수: 선택된 카테고리 정보로 계층별 ID 상태 업데이트
  const handleApplySelection = () => {
    const selectedCat = getSelectedCategory(categories);
    
    // 디버깅 로그
    console.log('handleApplySelection 실행, getSelectedCategory 결과:', selectedCat);
    
    if (selectedCat) {
      setSelectedCategoryName(selectedCat.name);
      
      const level = parseInt(selectedCat.level); // 🟢 level 값을 정수로 변환
      
      if (level === 1) {
        setCategoryLv1Id(selectedCat.id);
        setCategoryLv2Id(null);
        setCategoryLv3Id(null);
      } else if (level === 2) {
        const lv1Cat = findCategoryById(categories, selectedCat.parentId);
        setCategoryLv1Id(lv1Cat ? lv1Cat.id : null);
        setCategoryLv2Id(selectedCat.id);
        setCategoryLv3Id(null);
      } else if (level === 3) {
        const lv2Cat = findCategoryById(categories, selectedCat.parentId);
        const lv1Cat = lv2Cat ? findCategoryById(categories, lv2Cat.parentId) : null;
        
        setCategoryLv3Id(selectedCat.id);
        setCategoryLv2Id(lv2Cat ? lv2Cat.id : null);
        setCategoryLv1Id(lv1Cat ? lv1Cat.id : null);
      } else {
          // 🟢 예상치 못한 level 값에 대한 처리
          console.error(`Unexpected category level: ${selectedCat.level}`);
          setCategoryLv1Id(null);
          setCategoryLv2Id(null);
          setCategoryLv3Id(null);
      }
    } else {
      setCategoryLv1Id(null);
      setCategoryLv2Id(null);
      setCategoryLv3Id(null);
    }
    handleClose();
  };

  // 계층 구조에서 특정 ID를 가진 카테고리를 찾는 헬퍼 함수
  const findCategoryById = (nodes, id) => {
    if (!id) return null;
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children.length > 0) {
        const found = findCategoryById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // 재귀적으로 카테고리 UI 렌더링
  const renderCategories = (nodes, level = 0) => {
    return nodes.map(cat => (
      <div key={cat.id} style={{ marginLeft: `${level * 20}px` }}>
        <div className="d-flex align-items-center mb-2">
          <Form.Check
            className="me-2"
            type="checkbox"
            checked={!!cat.isSelected}
            onChange={() => handleCheckboxChange(cat.id)}
          />
          <Form.Control
            type="text"
            value={cat.name}
            readOnly
          />
        </div>
        {cat.children.length > 0 && renderCategories(cat.children, level + 1)}
      </div>
    ));
  };
  
  // handleSubmit 함수: 유효성 검사 및 API 호출
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // 디버깅 로그
    console.log('handleSubmit 실행, categoryLv1Id:', categoryLv1Id);

    if (!categoryLv1Id) { 
        alert('제품 카테고리를 선택해주세요.');
        return;
    }
    
    const finalImageUrl = imageUrl || 'https://dummyimage.com/300x300/000/fff';
    
    const productData = {
      name,
      code,
      description,
      price: parseFloat(price),
      categoryLv1Id,
      categoryLv2Id,
      categoryLv3Id,
      imageUrl: finalImageUrl,
    };

    console.log('백엔드로 전송할 데이터:', productData);

    const API_URL = '/api/admin/products/insert';
    const accessToken = localStorage.getItem('accessToken');
    if (!accessToken) {
        alert("로그인이 필요합니다.");
        return;
    }

    try {
      await axios.post(API_URL, productData, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      alert('제품이 성공적으로 등록되었습니다!');
      // 폼 초기화
      setName('');
      setCode(generateRandomCode());
      setPrice('');
      setDescription('');
      setImageUrl('');
      setPreviewUrl('https://dummyimage.com/300x300/000/fff');
      setSelectedCategoryName('');
      setCategoryLv1Id(null);
      setCategoryLv2Id(null);
      setCategoryLv3Id(null);
    } catch (error) {
      console.error('제품 등록 실패:', error.response?.data);
      alert('제품 등록에 실패했습니다. 입력값을 확인해 주세요.');
    }
  };
  
  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div className="container-fluid flex-grow-1" style={{ paddingTop: '100px' }}>
        <h2 className="mb-4">제품 정보 등록</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="productImage" className="form-label"><b>제품 이미지</b></label>
                <div className="mt-2">
                  <img
                    src={previewUrl}
                    alt="제품 이미지"
                    className="img-fluid rounded border p-1"
                    style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px' }}
                  />
                </div>
                <input
                  className="form-control mt-2"
                  type="file"
                  id="productImage"
                  onChange={handleImageChange}
                  style={{ border: '0.3pt solid #A3B18A', borderRadius: '4px' }}
                />
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="name" className="form-label"><b>제품명</b></label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{ border: '0.3pt solid #A3B18A', borderRadius: '4px' }}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="code" className="form-label"><b>제품코드</b></label>
                <input
                  type="text"
                  className="form-control"
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{ border: '0.3pt solid #A3B18A', borderRadius: '4px' }}
                  required
                  readOnly
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label me-2 mb-0 text-nowrap"><b>카테고리</b></label>
                <div
                  className="form-control"
                  style={{ border: '0.3pt solid #A3B18A', borderRadius: '4px', marginRight: '5px', padding: '0.375rem 0.75rem', flexGrow: 1 }}
                >
                  {selectedCategoryName || '카테고리 선택'}
                </div>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleShow}>설정</button>
              </div>
              <div className="mb-3">
                <label htmlFor="price" className="form-label"><b>단가</b></label>
                <input
                  type="number"
                  className="form-control"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  style={{ border: '0.3pt solid #A3B11A', borderRadius: '4px' }}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="description" className="form-label"><b>제품 설명</b></label>
                <textarea
                  className="form-control"
                  id="description"
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  style={{ border: '0.3pt solid #A3B11A', borderRadius: '4px' }}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">등록</button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>카테고리 설정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Form.Control
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder={getSelectedCategory(categories) ? `'${getSelectedCategory(categories).name}'의 하위 카테고리 이름 입력` : "최상위 카테고리 이름 입력"}
              className="mb-2"
            />
            <Button variant="success" onClick={handleAddCategory}>추가</Button>
          </div>
          
          <div className="mb-3">
            {renderCategories(categories)}
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div>
            <Button variant="warning" onClick={handleModifyCategory} className="me-2">수정</Button>
            <Button variant="danger" onClick={handleDeleteCategory}>삭제</Button>
          </div>
          <div>
            <Button variant="secondary" onClick={handleClose} className="me-2">닫기</Button>
            <Button variant="primary" onClick={handleApplySelection}>선택 완료</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminProductRegistration;