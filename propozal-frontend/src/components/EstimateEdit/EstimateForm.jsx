import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Alert, Modal, Spinner } from "react-bootstrap";
import axiosInstance from "../../api/axiosInstance";
import { BsPencilSquare } from "react-icons/bs";

const EstimateForm = ({
  estimateId,
  formData,
  onDataChange,
  readOnly = false,
}) => {
  const [showMemoModal, setShowMemoModal] = useState(false);
  const [memoText, setMemoText] = useState("");
  const [memoList, setMemoList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingMemo, setEditingMemo] = useState(null);

  useEffect(() => {}, [formData, readOnly]);

  useEffect(() => {
    if (readOnly || !estimateId) return;

    const fetchMemos = async () => {
      try {
        const res = await axiosInstance.get(`/estimates/${estimateId}/memos`);
        setMemoList(res.data);
      } catch (err) {
        console.error("메모 조회 실패:", err);
      }
    };

    fetchMemos();
  }, [estimateId, readOnly]);

  const handleChange = async (e) => {
    if (readOnly) return;
    const { name, value } = e.target;

    if (onDataChange) {
      onDataChange({ [name]: value });
    }

    try {
      await axiosInstance.patch(`/estimate/${estimateId}`, {
        [name]: value,
      });
    } catch (error) {
      console.error("고객 정보 업데이트 실패:", error);
    }
  };

  const handleEditClick = (memo) => {
    if (readOnly) return;
    setEditingMemo(memo);
    setMemoText(memo.content);
    setShowMemoModal(true);
  };

  const handleMemoSave = async () => {
    if (isSaving || readOnly) return;
    setIsSaving(true);
    try {
      if (editingMemo) {
        await axiosInstance.put(
          `/estimates/${estimateId}/memos/${editingMemo.id}`,
          { content: memoText }
        );
      } else {
        await axiosInstance.post(`/estimates/${estimateId}/memos`, {
          content: memoText,
        });
      }
      const res = await axiosInstance.get(`/estimates/${estimateId}/memos`);
      setMemoList(res.data);
      handleCloseModal();
    } catch (error) {
      console.error("메모 저장/수정 실패:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setShowMemoModal(false);
    setEditingMemo(null);
    setMemoText("");
  };

  const handleDeleteMemo = async (memoId) => {
    if (readOnly) return;
    if (!window.confirm("정말 이 메모를 삭제하시겠습니까?")) return;
    try {
      await axiosInstance.delete(`/estimates/${estimateId}/memos/${memoId}`);
      const res = await axiosInstance.get(`/estimates/${estimateId}/memos`);
      setMemoList(res.data);
    } catch (error) {
      console.error("메모 삭제 실패:", error);
    }
  };

  const safeFormData = formData || {};

  return (
    <Form>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">견적서 {readOnly ? "조회" : "작성"}</h3>
        {!readOnly && (
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              className="rounded-pill d-flex align-items-center gap-2"
              style={{
                paddingLeft: "20px",
                paddingRight: "20px",
                paddingTop: "8px",
                paddingBottom: "8px",
                fontSize: "15px",
                fontWeight: "bold",
                borderWidth: "2px",
              }}
              onClick={() => setShowMemoModal(true)}
            >
              <BsPencilSquare />
              메모하기
            </Button>
          </div>
        )}
      </div>

      <h4 className="mb-3">담당자 정보</h4>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>담당자 이름</Form.Label>
            <Form.Control
              type="text"
              value={safeFormData.user?.username || ""}
              readOnly
              style={{ backgroundColor: "#f1f1f1" }}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>담당자 이메일</Form.Label>
            <Form.Control
              type="email"
              value={safeFormData.user?.email || ""}
              readOnly
              style={{ backgroundColor: "#f1f1f1" }}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* 🔥 readOnly 모드가 아닐 때만 메모 목록 표시 */}
      {!readOnly && memoList.length > 0 && (
        <ul className="list-group mb-4">
          {memoList.map((memo) => (
            <li
              key={memo.id}
              className="list-group-item d-flex align-items-center"
            >
              <div>
                <div>{memo.content}</div>
                <small className="text-muted d-block mt-1">
                  작성일: {new Date(memo.createdAt).toLocaleString()}
                </small>
              </div>
              <div className="d-flex gap-2 ms-auto">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handleEditClick(memo)}
                >
                  수정
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDeleteMemo(memo.id)}
                >
                  삭제
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <hr className="my-4" />

      <h4 className="mb-3">고객 정보</h4>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>견적서 ID</Form.Label>
            <Form.Control
              type="text"
              value={estimateId}
              readOnly
              style={{ backgroundColor: "#f1f1f1" }}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>고객명 *</Form.Label>
            <Form.Control
              name="customerName"
              value={safeFormData.customerName || ""}
              onChange={handleChange}
              readOnly={readOnly}
              style={readOnly ? { backgroundColor: "#f8f9fa" } : {}}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>이메일 *</Form.Label>
            <Form.Control
              name="customerEmail"
              type="email"
              value={safeFormData.customerEmail || ""}
              onChange={handleChange}
              readOnly={readOnly}
              style={readOnly ? { backgroundColor: "#f8f9fa" } : {}}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>전화번호</Form.Label>
            <Form.Control
              name="customerPhone"
              value={safeFormData.customerPhone || ""}
              onChange={handleChange}
              readOnly={readOnly}
              style={readOnly ? { backgroundColor: "#f8f9fa" } : {}}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>회사명</Form.Label>
            <Form.Control
              name="customerCompanyName"
              value={safeFormData.customerCompanyName || ""}
              onChange={handleChange}
              readOnly={readOnly}
              style={readOnly ? { backgroundColor: "#f8f9fa" } : {}}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>직책</Form.Label>
            <Form.Control
              name="customerPosition"
              value={safeFormData.customerPosition || ""}
              onChange={handleChange}
              readOnly={readOnly}
              style={readOnly ? { backgroundColor: "#f8f9fa" } : {}}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>견적 송부일</Form.Label>
            <Form.Control
              type="date"
              name="sentDate"
              value={safeFormData.sentDate || ""}
              onChange={handleChange}
              readOnly={readOnly}
              style={readOnly ? { backgroundColor: "#f8f9fa" } : {}}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>견적 유효일</Form.Label>
            <Form.Control
              type="date"
              name="expirationDate"
              value={safeFormData.expirationDate || ""}
              onChange={handleChange}
              readOnly={readOnly}
              style={readOnly ? { backgroundColor: "#f8f9fa" } : {}}
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group className="mb-3">
            <Form.Label>프로세스 단계</Form.Label>
            <Form.Select
              name="dealStatus"
              value={safeFormData.dealStatus || ""}
              onChange={handleChange}
              disabled={readOnly}
              style={readOnly ? { backgroundColor: "#f8f9fa" } : {}}
            >
              <option value="">선택하세요</option>
              <option value="1">작성중</option>
              <option value="2">송부완료</option>
              <option value="3">검토중</option>
              <option value="4">승인완료</option>
              <option value="5">거절됨</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* 🔥 readOnly 모드가 아닐 때만 모달 렌더링 */}
      {!readOnly && (
        <Modal show={showMemoModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>메모하기</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>메모 내용</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                placeholder="메모를 입력하세요..."
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              닫기
            </Button>
            <Button
              variant="primary"
              onClick={handleMemoSave}
              disabled={isSaving}
            >
              {isSaving ? <Spinner as="span" size="sm" /> : "저장"}
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Form>
  );
};

export default EstimateForm;
