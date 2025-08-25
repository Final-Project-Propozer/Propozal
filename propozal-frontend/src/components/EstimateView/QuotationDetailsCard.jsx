import React from 'react';
import { Card, Table } from 'react-bootstrap';
import './QuotationDetailsCard.css';

const QuotationDetailsCard = () => {
  const items = [
    { name: '멋쟁이 사자 인형', quantity: 2, unitPrice: 5000 },
    { name: '멋쟁이 아기사자 인형', quantity: 3, unitPrice: 6000 },
  ];

  const supplyTotal = 28000;
  const discount = 2800;
  const vat = 2800;
  const total = 28000;

  return (
    <div className="quotation-details container my-4">
      <Card className="quotation-details-card shadow-sm">
        <Card.Body>
          <Card.Title className="mb-4">견적 상세 내역</Card.Title>
          <Table responsive bordered className="mb-4">
            <thead className="table-light">
              <tr>
                <th>품목</th>
                <th>수량</th>
                <th>단가 (₩)</th>
                <th>공급 가액 (₩)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>{item.unitPrice.toLocaleString()}</td>
                  <td>{(item.quantity * item.unitPrice).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Card.Title className="mb-3">총 견적 금액</Card.Title>
          <Table bordered>
            <tbody>
              <tr>
                <td>총 공급가액 (₩)</td>
                <td>{supplyTotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td>할인액 (₩)</td>
                <td>{discount.toLocaleString()}</td>
              </tr>
              <tr>
                <td>VAT (₩)</td>
                <td>{vat.toLocaleString()}</td>
              </tr>
              <tr className="table-light">
                <td><strong>총 견적금액 (₩)</strong></td>
                <td style={{ color: 'green', fontWeight: 'bold' }}>
                  {total.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default QuotationDetailsCard;
