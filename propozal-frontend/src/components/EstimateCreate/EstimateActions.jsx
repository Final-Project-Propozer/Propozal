import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import PreviewComponent from "./PreviewComponent"; // 미리보기 컴포넌트 (경로 확인 필요)

// ✅ 1. Props 변경: estimateId와 함께 estimateData를 받음
const EstimateActions = ({ estimateId, estimateData, readOnly = false }) => {
  const navigate = useNavigate();

  // ✅ 2. 자체 데이터 상태와 로딩 상태 대부분 제거. 저장 로직을 위한 최소한의 상태만 남김
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  // ✅ 수정된 코드
  const handleSaveVersion = async () => {
    if (readOnly || !estimateData) return;

    const memo = prompt(
      "변경 사항에 대한 메모를 남겨주세요 (선택 사항):",
      "내용 수정"
    );
    if (memo === null) {
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const cleanEstimateData = {
        ...estimateData,
        items:
          estimateData.items?.map((item) => ({
            productName: item.productName,
            productCode: item.productCode,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discountRate: item.discountRate,
            subtotal: item.subtotal,
          })) || [],
      };

      const payload = {
        memo: memo,
        estimateData: cleanEstimateData,
      };

      await axiosInstance.post(`/estimate/${estimateId}/versions`, payload);

      setMessage("새로운 버전으로 저장되었습니다.");
      alert("새로운 버전으로 저장되었습니다.");
      navigate(`/estimate/${estimateId}`);
    } catch (err) {
      setError("버전 저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  // 금액 포맷팅 함수
  const safeFormatNumber = (value) => {
    const num = Number(value || 0);
    return isNaN(num) ? "0" : num.toLocaleString();
  };

  // ✅ 4. JSX는 부모로부터 받은 estimateData를 사용해 렌더링
  return (
    <>
      <h4 className="mb-3">견적금액 요약</h4>

      {message && !readOnly && <Alert variant="success">{message}</Alert>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="align-items-center mb-3">
        {/* 왼쪽 열: 공급가액, 할인액, VAT 테이블 */}
        <Col md={7}>
          <Table bordered size="sm" className="mb-0">
            <tbody>
              <tr>
                <th style={{ width: "30%", backgroundColor: "#f8f9fa" }}>
                  총공급가액
                </th>
                <td className="text-end">
                  {safeFormatNumber(estimateData?.supplyAmount)}원
                </td>
              </tr>
              <tr>
                <th style={{ backgroundColor: "#f8f9fa" }}>할인액</th>
                <td className="text-end">
                  {safeFormatNumber(estimateData?.discountAmount)}원
                </td>
              </tr>
              <tr>
                <th style={{ backgroundColor: "#f8f9fa" }}>VAT</th>
                <td className="text-end">
                  {safeFormatNumber(estimateData?.vatAmount)}원
                </td>
              </tr>
            </tbody>
          </Table>
        </Col>

        {/* 오른쪽 열: 총 견적금액 */}
        <Col md={5}>
          <div className="text-end bg-light p-3 rounded">
            <h6 className="mb-1 text-muted">총 견적금액</h6>
            <strong style={{ fontSize: "2rem", color: "#0d6efd" }}>
              {safeFormatNumber(estimateData?.totalAmount)}원
            </strong>
          </div>
        </Col>
      </Row>

      {!readOnly && (
        <Form>
          <Form.Group className="mb-4">
            <Form.Label>특약 사항</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={estimateData?.specialTerms || ""}
              // 특약사항 등도 부모가 관리하도록 onChange 핸들러를 연결해야 하지만,
              // 우선 저장 로직부터 해결하기 위해 여기서는 생략합니다.
              readOnly
              placeholder="특약 사항은 고객 정보란에서 수정해주세요."
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
                {saving ? "저장 중..." : "새 버전으로 저장"}
              </Button>
            </Col>
          </Row>
        </Form>
      )}

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
          {/* 미리보기 컴포넌트에 현재 데이터를 전달해야 할 수 있습니다. */}
          <PreviewComponent estimateId={estimateId} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default EstimateActions;
