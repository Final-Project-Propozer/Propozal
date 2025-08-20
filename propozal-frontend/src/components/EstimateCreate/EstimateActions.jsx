import React, { useEffect, useState } from "react";
import {
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  Form,
  Table,
  Modal,
} from "react-bootstrap";
import axiosInstance from "../../api/axiosInstance";
import PreviewComponent from "./PreviewComponent"; // 미리보기 컴포넌트

const EstimateActions = ({ estimateId, readOnly = false }) => {
  const [items, setItems] = useState([]);
  const [supplyAmount, setSupplyAmount] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [vatAmount, setVatAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [specialTerms, setSpecialTerms] = useState("");
  const [managerNote, setManagerNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [showPreview, setShowPreview] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    setError(""); // 에러 초기화

    try {
      const res = await axiosInstance.get(`/api/estimate/${estimateId}`);
      console.log("📋 견적서 데이터 로드:", res.data);

      const estimateData = res.data || {};

      // 안전하게 items 설정
      const itemsData = Array.isArray(estimateData.items)
        ? estimateData.items
        : [];
      console.log("📋 아이템 데이터:", itemsData);

      setItems(itemsData);

      // API에서 이미 계산된 금액이 있다면 사용
      if (estimateData.totalAmount && estimateData.totalAmount > 0) {
        console.log("📊 API 계산된 금액 사용:", {
          supplyAmount: estimateData.supplyAmount || 0,
          discountAmount: estimateData.discountAmount || 0,
          vatAmount: estimateData.vatAmount || 0,
          totalAmount: estimateData.totalAmount || 0,
        });

        setSupplyAmount(estimateData.supplyAmount || 0);
        setDiscountAmount(estimateData.discountAmount || 0);
        setVatAmount(estimateData.vatAmount || 0);
        setTotalAmount(estimateData.totalAmount || 0);
      }

      // 기타 정보 설정
      setSpecialTerms(estimateData.specialTerms || "");
      setManagerNote(estimateData.managerNote || "");
    } catch (err) {
      console.error("❌ 데이터 로드 실패:", err);
      setError("품목 정보를 불러오지 못했습니다.");
      // 에러 시 안전한 기본값
      setItems([]);
      setSupplyAmount(0);
      setDiscountAmount(0);
      setVatAmount(0);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    try {
      if (!Array.isArray(items) || items.length === 0) {
        console.log("📊 계산할 아이템이 없음");
        // 아이템이 없으면 0으로 설정 (단, API에서 이미 값이 있다면 유지)
        if (totalAmount === 0) {
          setSupplyAmount(0);
          setDiscountAmount(0);
          setVatAmount(0);
          setTotalAmount(0);
        }
        return;
      }

      let supply = 0;
      let discount = 0;

      console.log("📊 금액 계산 시작 - 아이템 수:", items.length);

      items.forEach((item, index) => {
        try {
          // 안전한 숫자 변환
          const unitPrice = Number(item.unitPrice || item.price || 0);
          const quantity = Number(item.quantity || 1);
          const rate = Number(item.discountRate || 0);

          console.log(
            `📊 아이템 ${index + 1} (${item.productName || "Unknown"}):`,
            {
              unitPrice,
              quantity,
              rate,
            }
          );

          if (unitPrice > 0 && quantity > 0) {
            const original = unitPrice * quantity;
            const discounted = original * rate;

            supply += original;
            discount += discounted;
          }
        } catch (itemError) {
          console.error(`❌ 아이템 ${index + 1} 계산 오류:`, itemError);
        }
      });

      const netAmount = supply - discount;
      const vat = Math.round(netAmount * 0.1);
      const total = netAmount + vat;

      console.log("💰 계산 완료:", {
        supply,
        discount,
        netAmount,
        vat,
        total,
      });

      setSupplyAmount(supply);
      setDiscountAmount(discount);
      setVatAmount(vat);
      setTotalAmount(total);
    } catch (calcError) {
      console.error("❌ 금액 계산 전체 오류:", calcError);
      setError("금액 계산 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    if (estimateId) {
      fetchItems();
    }
  }, [estimateId]);

  useEffect(() => {
    // API에서 totalAmount가 없거나 0이고, items가 있을 때만 계산
    if (totalAmount === 0 && Array.isArray(items) && items.length > 0) {
      console.log("📊 클라이언트 계산 실행");
      calculateTotals();
    } else {
      console.log("📊 계산 건너뛰기 - API 값 사용 또는 아이템 없음");
    }
  }, [items]);

  const handleSaveVersion = async () => {
    if (readOnly) return;

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const estimateData = {
        items,
        supplyAmount,
        discountAmount,
        vatAmount,
        totalAmount,
        specialTerms,
      };

      console.log("💾 저장할 데이터:", estimateData);

      await axiosInstance.post(`/api/estimate/${estimateId}/versions`, {
        estimateData,
        memo: managerNote,
      });

      setMessage("견적서가 저장되었습니다.");
    } catch (err) {
      console.error("❌ 저장 실패:", err);
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  // 안전한 숫자 포맷팅
  const safeFormatNumber = (value) => {
    try {
      const num = Number(value || 0);
      return isNaN(num) ? "0" : num.toLocaleString();
    } catch {
      return "0";
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="text-center py-4">
        <Spinner animation="border" />
        <div className="mt-2">견적 금액을 계산하는 중...</div>
      </div>
    );
  }

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
                <td className="text-end">{safeFormatNumber(supplyAmount)}원</td>
              </tr>
              <tr>
                <th>할인액</th>
                <td className="text-end">
                  {safeFormatNumber(discountAmount)}원
                </td>
              </tr>
              <tr>
                <th>VAT</th>
                <td className="text-end">{safeFormatNumber(vatAmount)}원</td>
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
                      {safeFormatNumber(totalAmount)}원
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
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={handlePreview}
              >
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

      {/* 🧩 미리보기 모달 */}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>견적서 미리보기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PreviewComponent estimateId={estimateId} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EstimateActions;
