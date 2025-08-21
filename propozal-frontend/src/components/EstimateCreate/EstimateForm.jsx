import React, { useEffect, useState, useCallback } from "react";
import { Form, Button, Row, Col, Alert, Spinner, Modal } from "react-bootstrap";
import axiosInstance from "../../api/axiosInstance";
import { BsPencilSquare } from 'react-icons/bs';

const EstimateForm = ({ estimateId, initialData, readOnly = false }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    customerCompanyName: "",
    customerPosition: "",
    expirationDate: "",
    dealStatus: "",
    sentDate: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [showMemoModal, setShowMemoModal] = useState(false);
  const [memoText, setMemoText] = useState("");
  const [memoList, setMemoList] = useState([]);

  const [showLoadModal, setShowLoadModal] = useState(false);
  const [versionList, setVersionList] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [previewData, setPreviewData] = useState(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        customerName: initialData.customerName || "",
        customerEmail: initialData.customerEmail || "",
        customerPhone: initialData.customerPhone || "",
        customerCompanyName: initialData.customerCompanyName || "",
        customerPosition: initialData.customerPosition || "",
        expirationDate: initialData.expirationDate || "",
        dealStatus: initialData.dealStatus?.toString() || "",
        sentDate: initialData.sentDate || "",
      });
    }

    const fetchMemos = async () => {
      try {
        const res = await axiosInstance.get(`/estimates/${estimateId}/memos`);
        setMemoList(res.data);
      } catch (err) {
        console.error("메모 조회 실패:", err);
      }
    };

    if (estimateId) {
      fetchMemos();
    }
  }, [estimateId, initialData]);

  const handleChange = (e) => {
    if (readOnly) return;
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (readOnly) return;

    setSaving(true);
    setError("");
    setSuccess(false);

    try {
      await axiosInstance.patch(`/estimate/${estimateId}`, formData);
      setSuccess(true);
    } catch {
      setError("저장 중 오류가 발생했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const handleLoad = async () => {
    try {
      const res = await axiosInstance.get(`/estimate/${estimateId}/versions`);
      console.log('버전 목록 응답:', res.data);
      setVersionList(res.data);
      setShowLoadModal(true);
    } catch {
      alert("버전 목록을 불러오지 못했습니다.");
    }
  };

  const handleVersionSelect = async (versionId) => {
    if (!versionId) {
      alert("버전 ID가 없습니다.");
      return;
    }

    try {
      const res = await axiosInstance.get(`/estimate/versions/${versionId}`);
      const parsed = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      setSelectedVersion(versionId);
      setPreviewData(parsed);
    } catch {
      alert("버전 데이터를 불러오지 못했습니다.");
    }
  };

  const handleApplyVersion = () => {
    if (
      !previewData ||
      !window.confirm("기존 내용이 사라집니다. 계속하시겠습니까?")
    )
      return;

    setFormData({
      customerName: previewData.customerName || "",
      customerEmail: previewData.customerEmail || "",
      customerPhone: previewData.customerPhone || "",
      customerCompanyName: previewData.customerCompanyName || "",
      customerPosition: previewData.customerPosition || "",
      expirationDate: previewData.expirationDate || "",
      dealStatus: previewData.dealStatus?.toString() || "",
      sentDate: previewData.sentDate || "",
    });

    setShowLoadModal(false);
    setSelectedVersion(null);
    setPreviewData(null);
  };

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await axiosInstance.delete(`/estimate/${estimateId}`);
      alert('삭제되었습니다.');
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const handleMemoSave = async () => {
    try {
      await axiosInstance.post(`/estimates/${estimateId}/memos`, {
        content: memoText
      });
      setMemoText("");
      setShowMemoModal(false);
      const res = await axiosInstance.get(`/estimates/${estimateId}/memos`);
      setMemoList(res.data);
    } catch {
      alert("메모 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">견적서 작성</h3>
          <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            className="rounded-pill d-flex align-items-center gap-2"
            style={{
              paddingLeft: '20px',
              paddingRight: '20px',
              paddingTop: '8px',
              paddingBottom: '8px',
              fontSize: '15px',
              fontWeight: 'bold',         // 텍스트 굵게
              borderWidth: '2px'
            }}
            onClick={() => setShowMemoModal(true)}
          >
            <BsPencilSquare />
            메모하기
          </Button>
{/*             <Button variant="outline-success" onClick={handleLoad}> */}
{/*               불러오기 */}
{/*             </Button> */}
{/*             <Button variant="outline-danger" onClick={handleDelete}> */}
{/*               삭제하기 */}
{/*             </Button> */}
          </div>
        </div>

        {/* 담당자 정보 섹션 */}
        <h4 className="mb-3">담당자 정보</h4>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>담당자 이름</Form.Label>
              <Form.Control
                type="text"
                value={initialData?.user?.username || ""}
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
                value={initialData?.user?.email || ""}
                readOnly
                style={{ backgroundColor: "#f1f1f1" }}
              />
            </Form.Group>
          </Col>
        </Row>
        <hr className="my-4" />

        <h4 className="mb-3">고객 정보</h4>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">저장되었습니다.</Alert>}

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
                value={formData.customerName}
                onChange={handleChange}
                readOnly={readOnly}
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
                value={formData.customerEmail}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>전화번호</Form.Label>
              <Form.Control
                name="customerPhone"
                value={formData.customerPhone}
                onChange={handleChange}
                readOnly={readOnly}
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
                value={formData.customerCompanyName}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>직책</Form.Label>
              <Form.Control
                name="customerPosition"
                value={formData.customerPosition}
                onChange={handleChange}
                readOnly={readOnly}
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
                value={formData.sentDate}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>견적 유효일</Form.Label>
              <Form.Control
                type="date"
                name="expirationDate"
                value={formData.expirationDate}
                onChange={handleChange}
                readOnly={readOnly}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>프로세스 단계</Form.Label>
              <Form.Select
                name="dealStatus"
                value={formData.dealStatus}
                onChange={handleChange}
                disabled={readOnly}
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
          <div className="d-flex justify-content-end">
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
              style={{ width: "100px" }}
            >
              {saving ? "저장 중..." : "확인"}
            </Button>
          </div>
        )}
      </Form>

      {/* 메모 모달 */}
      <Modal show={showMemoModal} onHide={() => setShowMemoModal(false)}>
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
              readOnly={readOnly}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowMemoModal(false)}>
            닫기
          </Button>
          {!readOnly && (
            <Button variant="primary" onClick={handleMemoSave}>
              저장
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* 버전 불러오기 모달 */}
      <Modal
        show={showLoadModal}
        onHide={() => setShowLoadModal(false)}
        size="lg"
        scrollable // ✅ 스크롤 활성화
      >
        <Modal.Header closeButton>
          <Modal.Title>견적서 버전 불러오기</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>버전 목록</h5>
          {versionList.length === 0 ? (
            <p className="text-muted">저장된 버전이 없습니다.</p>
          ) : (
            <ul className="list-group mb-3">
              {versionList.map((ver, index) => (
                <li
                  key={ver.versionId}
                  className={`list-group-item d-flex justify-content-between align-items-center ${
                    selectedVersion === ver.versionId ? "active" : ""
                  }`}
                  onClick={() => handleVersionSelect(ver.versionId)}
                  style={{ cursor: "pointer" }}
                >
                  <span>{`버전 ${index + 1}`}</span>
                  <small className="text-muted">
                    {ver.memo || ver.savedBy}
                  </small>
                </li>
              ))}
            </ul>
          )}

          {previewData && (
            <>
              <h5>미리보기</h5>
              <div className="border p-3 mb-3">
                <p>
                  <strong>고객명:</strong> {previewData.customerName}
                </p>
                <p>
                  <strong>이메일:</strong> {previewData.customerEmail}
                </p>
                <p>
                  <strong>전화번호:</strong> {previewData.customerPhone}
                </p>
                <p>
                  <strong>회사명:</strong> {previewData.customerCompanyName}
                </p>
                <p>
                  <strong>직책:</strong> {previewData.customerPosition}
                </p>
                <p>
                  <strong>견적 송부일:</strong> {previewData.sentDate}
                </p>
                <p>
                  <strong>견적 유효일:</strong> {previewA.expirationDate}
                </p>
                <p>
                  <strong>프로세스 단계:</strong> {previewData.dealStatus}
                </p>
              </div>
              <Button variant="success" onClick={handleApplyVersion}>
                적용하기
              </Button>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLoadModal(false)}>
            닫기
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 메모 목록 */}
      {memoList.length > 0 && (
        <div className="mt-5">
          <h5>작성된 메모</h5>
          <ul className="list-group">
            {memoList.map((memo) => (
              <li key={memo.id} className="list-group-item">
                <div>{memo.content}</div>
                {memo.createdAt && (
                  <small className="text-muted d-block mt-1">
                    작성일: {new Date(memo.createdAt).toLocaleString()}
                  </small>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
};

export default EstimateForm;

