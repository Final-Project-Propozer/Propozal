import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, Alert } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

function QuoteModal({ show, handleClose, productId, product, quantity = 1 }) {
  const [currentEstimate, setCurrentEstimate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (show) {
      checkCurrentEstimate();
    }
  }, [show]);

  // ✅ 현재 편집 중인 견적서 확인
  const getCurrentEstimateId = () => {
    // URL에서 견적서 ID 추출 (/estimate/:id/edit 또는 /estimate/:id)
    const pathMatch = window.location.pathname.match(/\/estimate\/(\d+)/);
    console.log("🔍 QuoteModal: URL 패턴 매치:", pathMatch);
    if (pathMatch) {
      console.log("🔍 QuoteModal: URL에서 견적서 ID 찾음:", pathMatch[1]);
      return pathMatch[1];
    }

    // sessionStorage에서 현재 작성 중인 견적서 ID 확인
    const currentEstimateId = sessionStorage.getItem("currentEstimateId");
    console.log(
      "🔍 QuoteModal: sessionStorage에서 견적서 ID:",
      currentEstimateId
    );
    return currentEstimateId;
  };

  const checkCurrentEstimate = async () => {
    setLoading(true);
    setError("");

    const currentEstimateId = getCurrentEstimateId();
    console.log("🔍 QuoteModal: 현재 견적서 ID:", currentEstimateId);

    if (currentEstimateId) {
      try {
        // 현재 견적서 정보 가져오기
        const res = await axiosInstance.get(`/estimate/${currentEstimateId}`);
        console.log("✅ QuoteModal: 현재 견적서 정보 조회 성공:", res.data);
        setCurrentEstimate({
          ...res.data,
          id: currentEstimateId,
        });
      } catch (err) {
        console.error("❌ QuoteModal: 현재 견적서 정보 조회 실패:", err);
        setError("현재 견적서 정보를 불러올 수 없습니다.");
        setCurrentEstimate(null);
      }
    } else {
      console.log("⚠️ QuoteModal: 현재 견적서 ID가 없음");
      setCurrentEstimate(null);
    }

    setLoading(false);
  };

  const handleAddToCurrentEstimate = async () => {
    if (!currentEstimate || !productId) return;

    try {
      setLoading(true);
      await axiosInstance.post(`/estimate/${currentEstimate.id}/items`, {
        productId,
        quantity: quantity || 1,
        discountRate: 0,
      });

      alert("현재 작성 중인 견적서에 제품이 추가되었습니다.");
      handleClose();

      // 견적서 편집 페이지로 이동
      navigate(`/estimate/${currentEstimate.id}/edit`);
    } catch (err) {
      console.error("제품 추가 실패:", err);
      setError("제품 추가에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewEstimate = async () => {
    try {
      setLoading(true);

      // 새 견적서 생성
      const res = await axiosInstance.post("/estimate");
      const newEstimateId = res.data.id;

      // 생성된 견적서에 제품 추가
      await axiosInstance.post(`/estimate/${newEstimateId}/items`, {
        productId,
        quantity: quantity || 1,
        discountRate: 0,
      });

      // sessionStorage에 새 견적서 ID 저장
      sessionStorage.setItem("currentEstimateId", newEstimateId);

      alert("새로운 견적서가 생성되고 제품이 추가되었습니다.");
      handleClose();
      navigate(`/estimate/${newEstimateId}/edit`);
    } catch (err) {
      console.error("새 견적서 생성 및 제품 추가 실패:", err);
      setError("새 견적서 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="fw-bold">제품을 견적서에 추가</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" />
            <div className="mt-2">처리 중...</div>
          </div>
        ) : error ? (
          <Alert variant="danger">{error}</Alert>
        ) : currentEstimate ? (
          // ✅ 작성 중인 견적서가 있는 경우
          <div>
            <div className="alert alert-info">
              <h6 className="mb-2">🔄 현재 작성 중인 견적서가 있습니다</h6>
              <div>
                <strong>견적서:</strong>{" "}
                {currentEstimate.customerCompanyName ||
                  currentEstimate.customerName ||
                  `견적서 #${currentEstimate.id}`}
              </div>
              {currentEstimate.totalAmount && (
                <div>
                  <strong>현재 금액:</strong>{" "}
                  {currentEstimate.totalAmount.toLocaleString()}원
                </div>
              )}
              <div>
                <strong>제품 수:</strong> {currentEstimate.items?.length || 0}개
              </div>
            </div>
            <p className="mb-0">이 견적서에 제품을 추가하시겠습니까?</p>
          </div>
        ) : (
          // ✅ 작성 중인 견적서가 없는 경우
          <div>
            <div className="alert alert-warning">
              <h6 className="mb-2">📝 작성 중인 견적서가 없습니다</h6>
              <p className="mb-0">
                새로운 견적서를 생성하여 제품을 추가하시겠습니까?
              </p>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        {currentEstimate ? (
          // ✅ 작성 중인 견적서가 있는 경우의 버튼들
          <div className="d-flex gap-2 w-100">
            <Button
              variant="success"
              onClick={handleAddToCurrentEstimate}
              disabled={loading}
              className="flex-fill"
            >
              {loading ? "추가 중..." : "현재 견적서에 추가"}
            </Button>
            <Button
              variant="outline-success"
              onClick={handleCreateNewEstimate}
              disabled={loading}
              className="flex-fill"
            >
              새 견적서 생성
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              취소
            </Button>
          </div>
        ) : (
          // ✅ 작성 중인 견적서가 없는 경우의 버튼들
          <div className="d-flex gap-2 w-100">
            <Button
              variant="success"
              onClick={handleCreateNewEstimate}
              disabled={loading}
              className="flex-fill"
            >
              {loading ? "생성 중..." : "새 견적서 생성하여 추가"}
            </Button>
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              취소
            </Button>
          </div>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default QuoteModal;
