import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col, Modal, Spinner } from "react-bootstrap";
import axiosInstance from "../../api/axiosInstance";
import { BsPencilSquare } from "react-icons/bs";

const toDateInput = (d) => {
  if (!d) return "";
  const s = String(d);
  return s.length >= 10 ? s.slice(0, 10) : s;
};

const normalizeFormData = (raw = {}) => ({
  customerCompanyName: raw.customerCompanyName ?? "",
  customerEmail: raw.customerEmail ?? "",
  customerName: raw.customerName ?? "",
  customerPhone: raw.customerPhone ?? "",
  customerPosition: raw.customerPosition ?? "",
  dealStatus: raw.dealStatus ?? "",
  expirationDate: toDateInput(raw.expirationDate),
  sentDate: toDateInput(raw.sentDate),
  id: raw.id,
  items: Array.isArray(raw.items) ? raw.items : [],
  totalAmount: raw.totalAmount ?? 0,
  createdAt: raw.createdAt ?? "",
  updatedAt: raw.updatedAt ?? "",
  user: raw.user ?? null,
});

const EstimateForm = ({
  estimateId,
  formData,
  onDataChange,
  readOnly = false,
}) => {
  // ✅ 로컬 상태로 항상 컨트롤드 보장
  const [localForm, setLocalForm] = useState(() => normalizeFormData(formData));

  // formData가 새로 들어오면 (특히 id가 바뀔 때) 로컬 초기화
  useEffect(() => {
    setLocalForm(normalizeFormData(formData));
  }, [formData?.id]); // id 기준으로만 동기화 → 일시적 undefined에도 안정

  const [showMemoModal, setShowMemoModal] = useState(false);
  const [memoText, setMemoText] = useState("");
  const [memoList, setMemoList] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [editingMemo, setEditingMemo] = useState(null);

  const [hasChanges, setHasChanges] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    console.log("EstimateForm: formData 변경됨:", formData);
    console.log("EstimateForm: readOnly 모드:", readOnly);
  }, [formData, readOnly]);

  useEffect(() => {
    if (readOnly || !estimateId) return;
    (async () => {
      try {
        const res = await axiosInstance.get(`/estimates/${estimateId}/memos`);
        setMemoList(res.data);
      } catch (err) {
        console.error("메모 조회 실패:", err);
      }
    })();
  }, [estimateId, readOnly]);

  const handleChange = (e) => {
    if (readOnly) return;
    const { name, value } = e.target;

    setLocalForm((prev) => {
      const next = { ...prev, [name]: value };
      // 부모가 치환 세터여도 안전하도록 전체 객체 전달
      onDataChange?.(next);
      return next;
    });

    setHasChanges(true);
    setSaveMessage("");
  };

  const handleSaveCustomerInfo = async () => {
    if (readOnly || !hasChanges) return;

    if (!localForm.customerName || localForm.customerName.trim() === "") {
      setSaveMessage("고객명은 필수입니다.");
      return;
    }
    if (!localForm.customerEmail || localForm.customerEmail.trim() === "") {
      setSaveMessage("고객 이메일은 필수입니다.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(localForm.customerEmail)) {
      setSaveMessage("올바른 이메일 형식을 입력해주세요.");
      return;
    }

    setIsSaving(true);
    setSaveMessage("");

    try {
      const updateData = {
        customerName: localForm.customerName,
        customerEmail: localForm.customerEmail,
        customerPhone: localForm.customerPhone || "",
        customerCompanyName: localForm.customerCompanyName || "",
        customerPosition: localForm.customerPosition || "",
        sentDate: localForm.sentDate || null,
        expirationDate: localForm.expirationDate || null,
        // 백엔드가 숫자 기대 시: parseInt(localForm.dealStatus, 10)
        dealStatus: localForm.dealStatus || "",
      };

      console.log("🔄 고객 정보 저장:", updateData);
      await axiosInstance.patch(`/estimate/${estimateId}`, updateData);

      setHasChanges(false);
      setSaveMessage("고객 정보가 저장되었습니다.");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      console.error("❌ 고객 정보 저장 실패:", error);
      setSaveMessage(
        error.response?.data?.message || "저장 중 오류가 발생했습니다."
      );
    } finally {
      setIsSaving(false);
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
              value={localForm.user?.username || ""}
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
              value={localForm.user?.email || ""}
              readOnly
              style={{ backgroundColor: "#f1f1f1" }}
            />
          </Form.Group>
        </Col>
      </Row>

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

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">고객 정보</h4>

        {!readOnly && (
          <div className="d-flex align-items-center gap-2">
            {saveMessage && (
              <span
                className={`text-${
                  saveMessage.includes("저장되었습니다") ? "success" : "danger"
                }`}
              >
                {saveMessage}
              </span>
            )}
            <Button
              variant={hasChanges ? "primary" : "outline-secondary"}
              size="sm"
              onClick={handleSaveCustomerInfo}
              disabled={isSaving || !hasChanges}
            >
              {isSaving ? (
                <>
                  <Spinner as="span" size="sm" className="me-1" />
                  저장 중...
                </>
              ) : hasChanges ? (
                "저장하기"
              ) : (
                "저장됨"
              )}
            </Button>
          </div>
        )}
      </div>

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
            <Form.Label>
              고객명 * {!readOnly && <small className="text-muted">(필수)</small>}
            </Form.Label>
            <Form.Control
              name="customerName"
              value={localForm.customerName || ""}
              onChange={handleChange}
              readOnly={readOnly}
              style={readOnly ? { backgroundColor: "#f8f9fa" } : {}}
              isInvalid={
                !readOnly &&
                hasChanges &&
                (!localForm.customerName ||
                  localForm.customerName.trim() === "")
              }
            />
          </Form.Group>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>
              이메일 * {!readOnly && <small className="text-muted">(필수)</small>}
            </Form.Label>
            <Form.Control
              name="customerEmail"
              type="email"
              value={localForm.customerEmail || ""}
              onChange={handleChange}
              readOnly={readOnly}
              style={readOnly ? { backgroundColor: "#f8f9fa" } : {}}
              isInvalid={
                !readOnly &&
                hasChanges &&
                (!localForm.customerEmail ||
                  localForm.customerEmail.trim() === "")
              }
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>전화번호</Form.Label>
            <Form.Control
              name="customerPhone"
              value={localForm.customerPhone || ""}
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
              value={localForm.customerCompanyName || ""}
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
              value={localForm.customerPosition || ""}
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
              value={localForm.sentDate || ""}
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
              value={localForm.expirationDate || ""}
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
              value={String(localForm.dealStatus || "")}
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
