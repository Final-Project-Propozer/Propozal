import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

const PreviewComponent = ({ estimateId, onClose }) => {
  const [estimate, setEstimate] = useState(null);

  useEffect(() => {
    const fetchPreview = async () => {
      const res = await axiosInstance.get(`/estimate/${estimateId}`);
      setEstimate(res.data);
    };
    fetchPreview();
  }, [estimateId]);

  if (!estimate) return <p>불러오는 중...</p>;

  const {
    customerName,
    customerEmail,
    customerPhone,
    customerCompanyName,
    customerPosition,
    specialTerms,
    managerNote,
    managerName,
    totalAmount,
    items = []
  } = estimate;

  // 계산 함수
  const calculateSubtotal = (item) =>
    item.unitPrice * item.quantity * (1 - (item.discountRate ?? 0));

  const calculateVATIncluded = (item) =>
    calculateSubtotal(item) * 1.1;

  // 전체 금액 계산
  const supplyAmountCalc = items.reduce((sum, item) => {
    return sum + item.unitPrice * item.quantity;
  }, 0);

  const discountAmountCalc = items.reduce((sum, item) => {
    return sum + item.unitPrice * item.quantity * (item.discountRate ?? 0);
  }, 0);

  const vatAmountCalc = Math.floor((supplyAmountCalc - discountAmountCalc) * 0.1);
  const totalAmountCalc = supplyAmountCalc - discountAmountCalc + vatAmountCalc;

  return (
    <div
      style={{
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '8px',
        maxHeight: '80vh',
        overflowY: 'auto',
        backgroundColor: '#fff'
      }}
    >
      <h4 className="mb-3">📄 견적서 미리보기</h4>
      <p><strong>견적 번호:</strong> {estimateId}</p>

      <h5 className="mt-4">👥 고객 정보</h5>
      <ul>
        <li>고객명: {customerName || '입력되지 않음'}</li>
        <li>이메일: {customerEmail || '입력되지 않음'}</li>
        <li>전화번호: {customerPhone || '입력되지 않음'}</li>
        <li>회사명: {customerCompanyName || '입력되지 않음'}</li>
        <li>직책: {customerPosition || '입력되지 않음'}</li>
      </ul>

      <h5 className="mt-4">📦 품목 목록</h5>
      {items.length > 0 ? (
        <table className="table table-bordered table-sm">
          <thead>
            <tr>
              <th>품목명</th>
              <th>단가</th>
              <th>수량</th>
              <th>할인율</th>
              <th>공급가액</th>
              <th>VAT 포함 금액</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const subtotal = calculateSubtotal(item);
              const vatIncluded = calculateVATIncluded(item);
              return (
                <tr key={idx}>
                  <td><strong>{item.productName || '—'}</strong></td>
                  <td>{item.unitPrice?.toLocaleString()}원</td>
                  <td>{item.quantity}</td>
                  <td>{(item.discountRate ?? 0) * 100}%</td>
                  <td>{subtotal.toLocaleString()}원</td>
                  <td>{vatIncluded.toLocaleString()}원</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p className="text-muted">품목이 없습니다.</p>
      )}

      <h5 className="mt-4">💰 금액 요약</h5>
      <ul>
        <li>공급가액: {supplyAmountCalc.toLocaleString()}원</li>
        <li>할인액: {discountAmountCalc.toLocaleString()}원</li>
        <li>VAT: {vatAmountCalc.toLocaleString()}원</li>
        <li><strong>총 견적금액: {totalAmountCalc.toLocaleString()}원</strong></li>
      </ul>

      <h5 className="mt-4">📌 특약 사항</h5>
      <p>{specialTerms?.trim() ? specialTerms : '입력된 특약 사항이 없습니다.'}</p>

{/*       <h5 className="mt-4">👤 담당자 정보</h5> */}
{/*       <ul> */}
{/*         <li>담당자명: {managerName || '입력되지 않음'}</li> */}
{/*         <li>비고: {managerNote || '입력된 비고가 없습니다.'}</li> */}
{/*       </ul> */}

      <div className="mt-4 text-end">
{/*         <button className="btn btn-secondary" onClick={onClose}> */}
{/*           닫기 */}
{/*         </button> */}
      </div>
    </div>
  );
};

export default PreviewComponent;
