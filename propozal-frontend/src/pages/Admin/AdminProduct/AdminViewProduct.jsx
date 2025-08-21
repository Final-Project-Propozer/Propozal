import React, { useState, useEffect } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';

const AdminViewProduct = () => {
  // 실제 백엔드에서 받아올 데이터 (더미 데이터)
  const [productData, setProductData] = useState(null);

  useEffect(() => {
    // 백엔드 API 호출을 시뮬레이션
    const fetchProductData = () => {
      // 예시 더미 데이터
      const dummyData = {
        productName: '프리미엄 무선 헤드셋 Pro',
        productCode: 'HW-PRO-001',
        category: '음향기기',
        unitPrice: '150,000 원',
        maxDiscountRate: '15 %',
        vatApplied: 'yes',
        productDescription: '최고급 음질과 편안한 착용감을 자랑하는 무선 헤드셋입니다. 노이즈 캔슬링 기능이 탑재되어 몰입도를 높여줍니다.',
        imageUrl: 'https://via.placeholder.com/300/4CAF50/FFFFFF?text=Product+Image',
      };
      setProductData(dummyData);
    };

    fetchProductData();
  }, []);

  if (!productData) {
    return <div>로딩 중...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div className="container-fluid flex-grow-1" style={{ paddingTop: '100px' }}>
        <h2 className="mb-4">제품 정보 확인</h2>
        <div className="row">
          {/* 왼쪽: 이미지 표시 */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label"><b>제품 이미지</b></label>
              <div className="mt-2">
                <img
                  src={productData.imageUrl}
                  alt="제품 이미지"
                  className="img-fluid rounded border p-1"
                  style={{ maxWidth: '100%', height: 'auto', maxHeight: '300px' }}
                />
              </div>
            </div>
          </div>

          {/* 오른쪽: 제품 정보 표시 */}
          <div className="col-md-6">
            <div className="mb-3">
              <label className="form-label"><b>제품명</b></label>
              <div
                style={{ border: '0.3pt solid #A3B18A', padding: '8px', borderRadius: '4px' }}
              >
                {productData.productName}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label"><b>제품코드</b></label>
              <div
                style={{ border: '0.3pt solid #A3B18A', padding: '8px', borderRadius: '4px' }}
              >
                {productData.productCode}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label"><b>카테고리</b></label>
              <div
                style={{ border: '0.3pt solid #A3B18A', padding: '8px', borderRadius: '4px' }}
              >
                {productData.category}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label"><b>단가</b></label>
              <div
                style={{ border: '0.3pt solid #A3B18A', padding: '8px', borderRadius: '4px' }}
              >
                {productData.unitPrice}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label"><b>최대 할인율</b></label>
              <div
                style={{ border: '0.3pt solid #A3B18A', padding: '8px', borderRadius: '4px' }}
              >
                {productData.maxDiscountRate}
              </div>
            </div>
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label mb-0 me-3"><b>VAT 적용 여부</b></label>
              <div
                style={{ border: '0.3pt solid #Aa3B18A', padding: '8px', borderRadius: '4px', flexGrow: 1 }}
              >
                {productData.vatApplied === 'yes' ? '예' : '아니오'}
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label"><b>제품 설명</b></label>
              <div
                style={{ border: '0.3pt solid #A3B18A', padding: '8px', borderRadius: '4px' }}
              >
                {productData.productDescription}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminViewProduct;