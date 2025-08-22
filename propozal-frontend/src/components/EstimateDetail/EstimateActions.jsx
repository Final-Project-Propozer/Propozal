import React, { useEffect, useState } from 'react';
import { Button, Row, Col, Alert, Spinner, Form, Table } from 'react-bootstrap';
import axiosInstance from '../../api/axiosInstance';

const EstimateActions = ({ estimateId, readOnly = false, forceEditTerms = false }) => {
  const [items, setItems] = useState([]);
  const [supplyAmount, setSupplyAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [specialTerms, setSpecialTerms] = useState('');
  const [managerNote, setManagerNote] = useState('');
  const [dealStatus, setDealStatus] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/estimate/${estimateId}`);
      const data = res.data || {};
      setItems(Array.isArray(data.items) ? data.items : []);
      setSpecialTerms(data.terms ?? data.specialTerms ?? '');
      setDealStatus(data.dealStatus ?? ''); // 서버 상태 보존
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

  // 특약 사항 편집 가능 여부: 강제 허용 or 작성중(dealStatus===1) & not readOnly
  const canEditTerms =
    forceEditTerms ||
    (!readOnly && (String(dealStatus) === '1' || dealStatus === 1));

  const handleSaveVersion = async () => {
    if (readOnly && !forceEditTerms) return;

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
        specialTerms,
      };

      // 특약 사항 본문에도 반영(terms/specialTerms 둘 다 전송)
      await axiosInstance.patch(`/estimate/${estimateId}`, {
        terms: specialTerms,
        specialTerms: specialTerms,
      });

      await axiosInstance.post(`/estimate/${estimateId}/versions`, {
        estimateData,
        memo: managerNote,
      });

      setMessage('견적서가 저장되었습니다.');
    } catch (err) {
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

      {/* 특약 사항: 읽기전용이더라도 forceEditTerms면 편집 허용 */}
      {canEditTerms ? (
        <Form className="mt-4">
          <Form.Group className="mb-3">
            <Form.Label>특약 사항</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={specialTerms}
              onChange={(e) => setSpecialTerms(e.target.value)}
              placeholder="예: 납품일은 계약 후 2주 이내"
            />
            <div className="text-muted mt-1" style={{ fontSize: 12 }}>
              {specialTerms.length}자
            </div>
          </Form.Group>

          <div className="d-flex gap-2">
            <Button variant="primary" onClick={handleSaveVersion} disabled={saving}>
              {saving ? (
                <>
                  <Spinner as="span" size="sm" className="me-1" />
                  저장 중...
                </>
              ) : (
                '현재 버전 저장'
              )}
            </Button>
            <Button
              variant="outline-secondary"
              onClick={fetchItems}
              disabled={loading || saving}
            >
              다시 계산/새로고침
            </Button>
          </div>
        </Form>
      ) : (
        <>
          <h5 className="mt-4">특약 사항</h5>
          <div className="p-3 border rounded bg-light" style={{ whiteSpace: 'pre-wrap' }}>
            {specialTerms || '등록된 특약 사항이 없습니다.'}
          </div>
          <small className="text-muted">
            ※ 특약 사항은 고객 정보란에서 수정해주세요.
          </small>
        </>
      )}
    </>
  );
};

export default EstimateActions;