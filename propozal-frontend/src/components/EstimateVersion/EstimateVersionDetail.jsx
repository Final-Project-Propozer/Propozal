import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import './EstimateVersionDetail.css'; // CSS 파일 import

const EstimateVersionDetail = () => {
  const { versionId } = useParams();
  const [versionData, setVersionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVersionDetail = async () => {
      try {
        const res = await axiosInstance.get(`/estimate/versions/${versionId}`);
        setVersionData(res.data);
      } catch (error) {
        console.error('상세 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVersionDetail();
  }, [versionId]);

  if (loading) return <p className="loading">상세 정보를 불러오는 중...</p>;
  if (!versionData) return <p className="error">해당 버전을 찾을 수 없습니다.</p>;

  const {
    customerName,
    customerEmail,
    customerPhone,
    customerCompanyName,
    customerPosition,
    totalAmount,
    vatIncluded,
    specialTerms,
    expirationDate,
    createdAt,
    updatedAt,
    estimateItems,
  } = versionData;

  return (
    <div className="estimate-container">
      <h2>📄 견적서 상세 정보</h2>
      <div className="section">
        <h3>고객 정보</h3>
        <p><strong>이름:</strong> {customerName}</p>
        <p><strong>이메일:</strong> {customerEmail}</p>
        <p><strong>전화번호:</strong> {customerPhone}</p>
        <p><strong>회사명:</strong> {customerCompanyName}</p>
        <p><strong>직책:</strong> {customerPosition}</p>
      </div>

      <div className="section">
        <h3>견적 정보</h3>
        <p><strong>총 금액:</strong> {totalAmount.toLocaleString()} 원</p>
        <p><strong>VAT 포함:</strong> {vatIncluded ? '예' : '아니오'}</p>
        <p><strong>특이사항:</strong> {specialTerms}</p>
        <p><strong>유효기간:</strong> {expirationDate}</p>
        <p><strong>작성일:</strong> {new Date(createdAt).toLocaleString()}</p>
        <p><strong>수정일:</strong> {new Date(updatedAt).toLocaleString()}</p>
      </div>

      <div className="section">
        <h3>📦 제품 항목</h3>
        {estimateItems.map((item) => (
          <div key={item.id} className="item-card">
            <p><strong>제품명:</strong> {item.product.name}</p>
            <p><strong>제품 코드:</strong> {item.product.code}</p>
            <p><strong>카테고리:</strong> {item.product.categoryLv1.name} > {item.product.categoryLv2.name} > {item.product.categoryLv3.name}</p>
            <p><strong>수량:</strong> {item.quantity}</p>
            <p><strong>단가:</strong> {item.unitPrice.toLocaleString()} 원</p>
            <p><strong>할인율:</strong> {(item.discountRate * 100).toFixed(1)}%</p>
            <p><strong>소계:</strong> {item.subtotal.toLocaleString()} 원</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EstimateVersionDetail;
