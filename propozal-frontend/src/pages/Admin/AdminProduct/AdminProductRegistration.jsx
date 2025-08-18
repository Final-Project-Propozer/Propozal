import React, { useState } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const AdminProductRegistration = () => {
  const [productName, setProductName] = useState('');
  const [productCode, setProductCode] = useState('');
  const [category, setCategory] = useState('기본 카테고리');
  const [unitPrice, setUnitPrice] = useState('');
  const [maxDiscountRate, setMaxDiscountRate] = useState('');
  const [vatApplied, setVatApplied] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('https://via.placeholder.com/300');
  const [showModal, setShowModal] = useState(false);
  
  // 카테고리 목록 상태 관리
  const [categories, setCategories] = useState([
    { id: 1, name: '', isSelected: false },
    { id: 2, name: '', isSelected: false },
    { id: 3, name: '', isSelected: false },
  ]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setPreviewUrl('https://via.placeholder.com/300');
    }
  };

  const handleShow = () => {
    setShowModal(true);
  };
  
  const handleClose = () => {
    setShowModal(false);
  };

  const handleCategoryChange = (e, id) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, name: e.target.value } : cat
    ));
  };
  
  const handleCheckboxChange = (id) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, isSelected: !cat.isSelected } : cat
    ));
  };
  
  const handleAddCategory = () => {
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    setCategories([...categories, { id: newId, name: '', isSelected: false }]);
  };
  
  const handleDeleteCategory = () => {
    setCategories(categories.filter(cat => !cat.isSelected));
  };
  
  const handleModifyCategory = () => {
    // 실제 수정 로직은 백엔드 API를 호출해야 합니다.
    // 여기서는 선택된 항목이 수정되었다는 알림만 표시합니다.
    const selected = categories.filter(cat => cat.isSelected);
    if (selected.length > 0) {
      alert(`${selected.length}개의 항목이 수정되었습니다.`);
    }
  };
  
  const handleApplySelection = () => {
    const selectedNames = categories.filter(cat => cat.isSelected && cat.name.trim() !== '').map(cat => cat.name);
    setCategory(selectedNames.join(', '));
    handleClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = {
      productName,
      productCode,
      category,
      unitPrice,
      maxDiscountRate,
      vatApplied,
      productDescription,
      imageFile,
    };
    console.log('제품 등록 데이터:', formData);
    alert('제품 정보가 등록되었습니다!');
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div className="container-fluid flex-grow-1 py-5" style={{ paddingTop: '60px' }}>
        <h2 className="mb-4">제품 정보 등록</h2>
        <form onSubmit={handleSubmit}>
          <div className="row">
            {/* 왼쪽: 이미지 업로드 */}
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

            {/* 오른쪽: 제품 정보 입력 */}
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="productName" className="form-label"><b>제품명</b></label>
                <input
                  type="text"
                  className="form-control"
                  id="productName"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  style={{ border: '0.3pt solid #A3B18A', borderRadius: '4px' }}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="productCode" className="form-label"><b>제품코드</b></label>
                <input
                  type="text"
                  className="form-control"
                  id="productCode"
                  value={productCode}
                  onChange={(e) => setProductCode(e.target.value)}
                  style={{ border: '0.3pt solid #A3B18A', borderRadius: '4px' }}
                  required
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label me-2 mb-0 text-nowrap"><b>카테고리</b></label>
                <div
                  className="form-control"
                  style={{ border: '0.3pt solid #A3B18A', borderRadius: '4px', marginRight: '5px', padding: '0.375rem 0.75rem', flexGrow: 1 }}
                >
                  {category}
                </div>
                <button type="button" className="btn btn-outline-secondary btn-sm" onClick={handleShow}>설정</button>
              </div>
              <div className="mb-3">
                <label htmlFor="unitPrice" className="form-label"><b>단가</b></label>
                <input
                  type="number"
                  className="form-control"
                  id="unitPrice"
                  value={unitPrice}
                  onChange={(e) => setUnitPrice(e.target.value)}
                  style={{ border: '0.3pt solid #A3B18A', borderRadius: '4px' }}
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="maxDiscountRate" className="form-label"><b>최대 할인율</b></label>
                <input
                  type="number"
                  className="form-control"
                  id="maxDiscountRate"
                  value={maxDiscountRate}
                  onChange={(e) => setMaxDiscountRate(e.target.value)}
                  style={{ border: '0.3pt solid #A3B18A', borderRadius: '4px' }}
                  required
                />
              </div>
              <div className="mb-3 d-flex align-items-center">
                <label className="form-label mb-0 me-3"><b>VAT 적용 여부</b></label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="vatApplied"
                      id="vatYes"
                      value="yes"
                      checked={vatApplied === 'yes'}
                      onChange={(e) => setVatApplied(e.target.value)}
                      required
                    />
                    <label className="form-check-label" htmlFor="vatYes"><b>예</b></label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="vatApplied"
                      id="vatNo"
                      value="no"
                      checked={vatApplied === 'no'}
                      onChange={(e) => setVatApplied(e.target.value)}
                      required
                    />
                    <label className="form-check-label" htmlFor="vatNo"><b>아니오</b></label>
                  </div>
                </div>
              </div>
              <div className="mb-3">
                <label htmlFor="productDescription" className="form-label"><b>제품 설명</b></label>
                <textarea
                  className="form-control"
                  id="productDescription"
                  rows="3"
                  value={productDescription}
                  onChange={(e) => setProductDescription(e.target.value)}
                  style={{ border: '0.3pt solid #A3B18A', borderRadius: '4px' }}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary">등록</button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
      {/* 카테고리 설정 모달 */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>카테고리 설정</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            {categories.map(cat => (
              <div key={cat.id} className="d-flex align-items-center mb-2">
                {cat.name.trim() !== '' && (
                  <Form.Check
                    className="me-2"
                    type="checkbox"
                    checked={cat.isSelected}
                    onChange={() => handleCheckboxChange(cat.id)}
                  />
                )}
                <Form.Control
                  type="text"
                  value={cat.name}
                  onChange={(e) => handleCategoryChange(e, cat.id)}
                  placeholder="새 카테고리 입력"
                />
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-between">
          <div>
            <Button variant="success" onClick={handleAddCategory} className="me-2">추가</Button>
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