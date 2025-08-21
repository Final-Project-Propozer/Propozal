import React, { useEffect, useState } from "react";
import { Button, Row, Col, Alert, Spinner, Form, Table } from "react-bootstrap";
import axiosInstance from "../../api/axiosInstance";

const EstimateActions = ({ estimateId, estimateData, readOnly = false }) => {
  // ✅ estimateData props에서 items 우선 사용
  const [items, setItems] = useState([]);
  const [supplyAmount, setSupplyAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [specialTerms, setSpecialTerms] = useState("");
  const [managerNote, setManagerNote] = useState("");

  const [loading, setLoading] = useState(false); // ✅ props 있으면 로딩 안함
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/estimate/${estimateId}`);
      setItems(res.data.items || []);
      setError("");
    } catch (err) {
      console.log("품목 정보 조회 중 오류 (무시됨):", err);
      if (!readOnly) {
        setError("품목 정보를 불러오지 못했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    let supply = 0;
    let discount = 0;

    items.forEach((item) => {
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

  // ✅ estimateData props가 있으면 해당 데이터 사용
  useEffect(() => {
    if (estimateData && estimateData.items) {
      console.log(
        "✅ EstimateActions - props에서 items 사용:",
        estimateData.items
      );
      setItems(estimateData.items);
      setLoading(false);
    } else if (estimateId) {
      console.log("🔄 EstimateActions - API 호출로 데이터 조회");
      fetchItems();
    }
  }, [estimateId, estimateData]);

  useEffect(() => {
    if (items.length > 0) {
      console.log("💰 금액 계산 시작 - items:", items);
      calculateTotals();
    } else {
      console.log("❌ items가 없어서 금액 계산 안함");
    }
  }, [items]);

  const handleSaveVersion = async () => {
    if (readOnly) return;

    console.log("✅ 저장 함수 실행됨");

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const estimateDataForSave = {
        items,
        supplyAmount,
        discountAmount,
        vatAmount,
        totalAmount,
        specialTerms,
      };

      console.log("📦 전송할 데이터:", estimateDataForSave);

      await axiosInstance.post(`/estimate/${estimateId}/versions`, {
        estimateData,
        memo: managerNote
      });

      setMessage("견적서가 저장되었습니다.");
    } catch (err) {
      console.error("❌ 저장 중 오류:", err);
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && items.length === 0) return <Spinner animation="border" />;

  return (
    <>
      <h4 className="mb-3">견적금액 요약</h4>

      {message && !readOnly && <Alert variant="success">{message}</Alert>}
      {!readOnly && error && <Alert variant="danger">{error}</Alert>}

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
                <td className="text-end">
                  {discountAmount.toLocaleString()}원
                </td>
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
                    <strong style={{ fontSize: "1.5rem", color: "#007bff" }}>
                      {totalAmount.toLocaleString()}원
                    </strong>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={fetchItems}
                      disabled={loading}
                    >
                      {loading ? "불러오는 중..." : "새로고침"}
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

          <Form.Group className="mb-3">
            <Form.Label>담당자 정보</Form.Label>
            <Form.Control
              type="text"
              value={managerNote}
              onChange={(e) => setManagerNote(e.target.value)}
              placeholder="홍길동 / 010-1234-5678 / sales@company.com"
              readOnly={readOnly}
              style={{ backgroundColor: "#f8f9fa" }}
            />
          </Form.Group>

          <Row className="mb-5">
            <Col className="text-end">
              <Button variant="outline-primary" className="me-2">
                미리보기
              </Button>
              <Button
                variant="success"
                onClick={handleSaveVersion}
                disabled={saving}
              >
                {saving ? "저장 중..." : "저장하기"}
              </Button>
            </Col>
          </Row>
        </Form>
      )}
    </>
  );
};

export default EstimateActions;
