import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Alert, Spinner, Form, Table } from 'react-bootstrap';
import axiosInstance from '../../api/axiosInstance';

const EstimateActions = ({ estimateId, readOnly = false }) => {
  const [items, setItems] = useState([]);
  const [supplyAmount, setSupplyAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [specialTerms, setSpecialTerms] = useState('');
  const [managerNote, setManagerNote] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/estimate/${estimateId}`);
      const data = res.data || {};
      setItems(data.items || []);
      // 특약 사항 상태를 서버 값으로 초기화(terms / specialTerms 둘 다 대응)
      setSpecialTerms(data.terms ?? data.specialTerms ?? '');
      setError('');
    } catch (err) {
      setError('품목 정보를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    let supply = 0;
    let discount = 0;

    items.forEach(item => {
      const unitPrice = item.unitPrice || 0;
      const quantity = item.quantity || 0;
      const rate = item.discountRate || 0;

      const original = unitPrice * quantity;
      const discounted = original * rate;

      supply += original;
      discount += discounted;
    });

    const vat = Math.round((supply - discount) * 0.1);
    const total = supply - discount + vat;

    setSupplyAmount(supply);
    setDiscountAmount(discount);
    setVatAmount(vat);
    setTotalAmount(total);
  };

  useEffect(() => {
    fetchItems();
  }, [estimateId]);

  useEffect(() => {
    if (items.length > 0) {
      calculateTotals();
    }
  }, [items]);

  const handleSaveVersion = async () => {
    if (readOnly) return;

    console.log('✅ 저장 함수 실행됨');

    setSaving(true);
    setMessage('');
    setError('');

    try {
      const estimateData = {
        items,
        supplyAmount,
        discountAmount,
        vatAmount,
        totalAmount,
        specialTerms
      };

      console.log('📦 전송할 데이터:', estimateData);

      // 특약 사항을 견적 본문에도 저장(terms / specialTerms 모두 전송해 호환 확보)
      await axiosInstance.patch(`/estimate/${estimateId}`, {
        terms: specialTerms,
        specialTerms: specialTerms,
      });

      // 버전 저장
      await axiosInstance.post(`/estimate/${estimateId}/versions`, {
        estimateData,
        memo: managerNote
      });

      setMessage('견적서가 저장되었습니다.');
    } catch (err) {
      console.error('❌ 저장 중 오류:', err);
      setError('저장 중 오류가 발생했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading && items.length === 0) return <Spinner animation="border" />;

  return (
    <>
      <h4 className="mb-3">견적금액 요약</h4>

      {message && !readOnly && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col md={6}>
          <Table bordered size="sm">
            <tbody>
              <tr>
                <th>총공급가액</th>
                <td className="text-end">{supplyAmount.toLocaleString()}원</td>
              </tr>
              <tr>
                <th>할인액</th>
                <td className="text-end">{discountAmount.toLocaleString()}원</td>
              </tr>
              <tr>
                <th>VAT</th>
                <td className="text-end">{vatAmount.toLocaleString()}원</td>
              </tr>
            </tbody>
          </Table>
        </Col>

        <Col md={6}>
          <Table bordered size="sm">
            <tbody>
              <tr>
                <th>총 견적금액</th>
                <td className="text-end align-middle">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong style={{ fontSize: '1.5rem', color: '#007bff' }}>
                      {totalAmount.toLocaleString()}원
                    </strong>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={fetchItems}
                      disabled={loading}
                    >
                      {loading ? '불러오는 중...' : '새로고침'}
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>
      </Row>

      {!readOnly && (
        <Form>
          <Form.Group className="mb-4">
            <Form.Label>특약 사항</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={specialTerms}
              onChange={(e) => setSpecialTerms(e.target.value)}
              placeholder="예: 납품일은 계약 후 2주 이내"
            />
          </Form.Group>

          {/* 저장 트리거가 이 컴포넌트 외부에 있으면 아래 버튼은 생략 가능 */}
          <div className="d-flex gap-2">
            <Button
              variant="primary"
              onClick={handleSaveVersion}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner as="span" size="sm" className="me-1" />
                  저장 중...
                </>
              ) : (
                '현재 버전 저장'
              )}
            </Button>
          </div>
        </Form>
      )}
    </>
  );
};

export default EstimateActions;