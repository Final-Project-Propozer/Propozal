// ./PreviewComponent.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const PreviewComponent = ({ estimateId }) => {
  const [estimate, setEstimate] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      const res = await axiosInstance.get(`/estimate/${estimateId}`);
      setEstimate(res.data);
    };
    fetchPreview();
  }, [estimateId]);

  if (!estimate) return <p>불러오는 중...</p>;

  return (
    <div>
      <h5>견적서 #{estimate.id}</h5>
      <p>고객사: {estimate.customerCompanyName}</p>
      <p>총액: {estimate.totalAmount?.toLocaleString()}원</p>
      {/* 필요한 정보 더 추가 가능 */}
    </div>
  );
};

export default PreviewComponent;
