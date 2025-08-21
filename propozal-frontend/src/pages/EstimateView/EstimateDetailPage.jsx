import React, { useEffect, useState, useRef } from "react";
import {
  Container,
  Spinner,
  Alert,
  Button,
  Modal,
  ListGroup,
  Form,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

import SalesNavbar from "../../components/Navbar/SalesNavbar";
import Footer from "../../components/Footer/Footer";

import EstimateForm from "../../components/EstimateEdit/EstimateForm";
import EstimateItemTable from "../../components/EstimateEdit/EstimateItemTable";
import EstimateActions from "../../components/EstimateEdit/EstimateActions";

const EstimateDetailPage = () => {
  const { id: estimateId } = useParams();
  const navigate = useNavigate();
  const pdfRef = useRef();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [displayData, setDisplayData] = useState(null);
  const [viewInfo, setViewInfo] = useState(" (최신 상태)");

  // 🔥 컴포넌트 리렌더링을 강제하기 위한 key 추가
  const [componentKey, setComponentKey] = useState(0);

  const [isViewingLatest, setIsViewingLatest] = useState(true);

  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");

  const handleLoadLatest = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/estimate/${estimateId}`);
      setDisplayData(res.data);
      setViewInfo(" (최신 상태)");
      setIsViewingLatest(true);
      // 🔥 컴포넌트 key 업데이트로 강제 리렌더링
      setComponentKey((prev) => prev + 1);
    } catch (err) {
      setError("최신 견적서를 불러오는 데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (estimateId) {
      handleLoadLatest();
    }
  }, [estimateId]);

  const handleShowVersionModal = async () => {
    setShowVersionModal(true);
    setModalLoading(true);
    setSelectedVersion(null);
    try {
      const res = await axiosInstance.get(`/estimate/${estimateId}/versions`);
      const sortedVersions = [...res.data].sort(
        (a, b) => new Date(b.savedAt) - new Date(a.savedAt)
      );
      setVersions(sortedVersions);
    } catch (err) {
      console.error("버전 목록 조회 실패:", err);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseVersionModal = () => setShowVersionModal(false);

  const handleVersionSelect = async (versionId) => {
    setModalLoading(true);
    try {
      const res = await axiosInstance.get(`/estimate/versions/${versionId}`);

      const parsedData =
        typeof res.data === "string" ? JSON.parse(res.data) : res.data;

      setSelectedVersion({
        ...parsedData,
        versionId: versionId,
      });

      console.log("파싱된 버전 데이터:", parsedData);
    } catch (err) {
      console.error("버전 데이터 로딩 실패:", err);
      alert("버전 정보를 불러오는 데 실패했습니다.");
    } finally {
      setModalLoading(false);
    }
  };

  const handleLoadVersionToPage = () => {
    if (!selectedVersion) return;

    const versionIndex = versions.findIndex(
      (v) => v.versionId === selectedVersion.versionId
    );
    const versionNumber = versions.length - versionIndex;

    // 🔥 버전 데이터를 로드할 때 완전히 새로운 객체로 설정하고 컴포넌트 key 업데이트
    const newDisplayData = {
      ...selectedVersion,
      // 🔥 items 배열도 완전히 새로운 배열로 복사
      items: selectedVersion.items ? [...selectedVersion.items] : [],
    };

    setDisplayData(newDisplayData);
    setViewInfo(` (버전 ${versionNumber} 불러옴)`);
    setIsViewingLatest(false);

    // 🔥 컴포넌트들이 새 데이터를 인식하도록 key 변경
    setComponentKey((prev) => prev + 1);

    handleCloseVersionModal();

    console.log("🔄 버전 데이터 로드 완료:", newDisplayData);
  };

  const handleNavigateToEdit = () => {
    if (!displayData) return;
    navigate(`/estimate/${estimateId}/edit`, {
      state: { versionData: displayData },
    });
  };

  const handleDownload = async () => {
    const element = pdfRef.current;
    if (!element || !displayData) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    // 버전 데이터일 때 경고
    if (!isViewingLatest) {
      const confirmed = window.confirm(
        "현재 이전 버전을 보고 있습니다. 이 버전의 PDF를 다운로드하시겠습니까?"
      );
      if (!confirmed) return;
    }

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;
      const usableWidth = pageWidth - margin * 2;

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = usableWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      const maxImgHeight = pageHeight - margin * 2;
      const finalImgHeight = Math.min(imgHeight, maxImgHeight);

      pdf.addImage(imgData, "PNG", margin, margin, imgWidth, finalImgHeight);
      pdf.save(`견적서_${estimateId}.pdf`);
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert("PDF 생성 중 오류가 발생했습니다.");
    }
  };

  const handleShowEmailModal = () => {
    if (!displayData) return;
    setShowEmailModal(true);
    setSendError("");
    setRecipientEmail(displayData.customerEmail || "");
  };

  const handleCloseEmailModal = () => setShowEmailModal(false);

  const executeSendEmail = async () => {
    if (!recipientEmail || recipientEmail.trim() === "") {
      setSendError("수신자 이메일을 입력해주세요.");
      return;
    }
    setIsSending(true);
    setSendError("");
    try {
      const response = await axiosInstance.get(`/estimate/${estimateId}`);
      const freshData = response.data;

      const { id, user, sender, ...restOfData } = freshData;

      const versionPayload = {
        memo: "이메일 발송",
        estimateData: {
          ...restOfData,
          items: freshData.items.map(({ product, ...item }) => item),
        },
      };

      const versionRes = await axiosInstance.post(
        `/estimate/${estimateId}/versions`,
        versionPayload
      );
      const newVersionId = versionRes.data.versionId;
      if (!newVersionId) {
        throw new Error("버전 ID를 받아오지 못했습니다.");
      }

      const emailPayload = { recipientEmail };
      await axiosInstance.post(
        `/estimate/versions/${newVersionId}/send`,
        emailPayload
      );

      alert("최신 버전의 견적서가 성공적으로 전송되었습니다.");
      handleCloseEmailModal();
    } catch (err) {
      console.error("이메일 전송 오류:", err);
      setSendError(
        "이메일 전송 중 오류가 발생했습니다. 개발자 콘솔을 확인해주세요."
      );
    } finally {
      setIsSending(false);
    }
  };

  const now = new Date();
  const formattedDate = now.toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <>
      <SalesNavbar />

      <Container className="py-4" style={{ marginTop: "70px" }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0" style={{ fontWeight: "bold" }}>
            견적서 상세 조회
            <span
              style={{
                fontSize: "1.2rem",
                color: "#6c757d",
                marginLeft: "10px",
              }}
            >
              {viewInfo}
            </span>
          </h2>
          <div className="d-flex gap-2">
            <Button
              variant="outline-secondary"
              onClick={handleShowVersionModal}
              style={{ borderWidth: "2px" }}
            >
              버전 불러오기
            </Button>

            <Button
              variant="outline-success"
              onClick={handleNavigateToEdit}
              style={{ borderWidth: "2px" }}
            >
              {isViewingLatest ? "수정하기" : "이 버전으로 수정하기"}
            </Button>

            <Button
              variant="outline-primary"
              onClick={handleDownload}
              style={{ borderWidth: "2px" }}
            >
              다운로드
            </Button>

            <Button
              variant="outline-dark"
              onClick={handleShowEmailModal}
              style={{ borderWidth: "2px" }}
            >
              이메일 전송
            </Button>
          </div>
        </div>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && displayData && (
          <div ref={pdfRef}>
            {/* PDF 다운로드 시에만 포함될 숨겨진 영역 */}
            <div style={{ display: "none" }}>
              <div
                style={{
                  fontSize: "14px",
                  fontWeight: "bold",
                  marginBottom: "4px",
                }}
              >
                출력 날짜: {formattedDate}
              </div>
              <div
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  marginBottom: "10px",
                }}
              >
                견적서 상세 정보
              </div>
            </div>

            {/* 🔥 key props 추가로 강제 리렌더링 */}
            <EstimateForm
              key={`form-${componentKey}`}
              estimateId={estimateId}
              formData={displayData}
              readOnly
            />

            <EstimateItemTable
              key={`table-${componentKey}`}
              estimateId={estimateId}
              initialItems={displayData.items || []}
              readOnly
            />

            <EstimateActions
              key={`actions-${componentKey}`}
              estimateId={estimateId}
              estimateData={displayData}
              readOnly
            />
          </div>
        )}
      </Container>

      <Modal
        show={showVersionModal}
        onHide={handleCloseVersionModal}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>버전 불러오기</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: "70vh", overflowY: "auto" }}>
          <div className="row">
            <div className="col-md-4">
              <h5>버전 목록</h5>
              {modalLoading && !versions.length ? (
                <Spinner animation="border" size="sm" />
              ) : (
                <ListGroup>
                  {versions.map((v, index) => (
                    <ListGroup.Item
                      key={v.versionId}
                      action
                      onClick={() => handleVersionSelect(v.versionId)}
                    >
                      <strong>버전 {versions.length - index}</strong> (
                      {new Date(v.savedAt).toLocaleDateString()})
                      <br />
                      <small className="text-muted">
                        {v.memo || "메모 없음"}
                      </small>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </div>
            <div className="col-md-8">
              <h5>미리보기</h5>
              {modalLoading && <Spinner animation="border" />}
              {!modalLoading && selectedVersion ? (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  {/* 고객 정보 */}
                  <div className="mb-3">
                    <h6 className="text-primary">👤 고객 정보</h6>
                    <div className="bg-light p-2 rounded">
                      <p className="mb-1">
                        <strong>고객명:</strong>{" "}
                        {selectedVersion.customerName || "미입력"}
                      </p>
                      <p className="mb-1">
                        <strong>회사명:</strong>{" "}
                        {selectedVersion.customerCompanyName || "미입력"}
                      </p>
                      <p className="mb-1">
                        <strong>이메일:</strong>{" "}
                        {selectedVersion.customerEmail || "미입력"}
                      </p>
                      <p className="mb-1">
                        <strong>전화번호:</strong>{" "}
                        {selectedVersion.customerPhone || "미입력"}
                      </p>
                      <p className="mb-0">
                        <strong>직책:</strong>{" "}
                        {selectedVersion.customerPosition || "미입력"}
                      </p>
                    </div>
                  </div>

                  {/* 품목 목록 */}
                  <div className="mb-3">
                    <h6 className="text-primary">📦 품목 목록</h6>
                    {selectedVersion.items &&
                    selectedVersion.items.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-sm table-bordered">
                          <thead className="table-light">
                            <tr>
                              <th>상품명</th>
                              <th>상품코드</th>
                              <th>수량</th>
                              <th>단가</th>
                              <th>할인율</th>
                              <th>소계</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedVersion.items.map((item, index) => (
                              <tr key={index}>
                                <td>{item.productName || "미입력"}</td>
                                <td>{item.productCode || "미입력"}</td>
                                <td>{item.quantity || 0}</td>
                                <td>
                                  {item.unitPrice
                                    ? item.unitPrice.toLocaleString() + "원"
                                    : "0원"}
                                </td>
                                <td>
                                  {item.discountRate
                                    ? (item.discountRate * 100).toFixed(1) + "%"
                                    : "0%"}
                                </td>
                                <td>
                                  {item.subtotal
                                    ? item.subtotal.toLocaleString() + "원"
                                    : "0원"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="bg-light p-3 text-center text-muted rounded">
                        품목이 없습니다.
                      </div>
                    )}
                  </div>

                  {/* 금액 정보 */}
                  <div className="mb-3">
                    <h6 className="text-primary">💰 금액 정보</h6>
                    <div className="bg-light p-2 rounded">
                      <div className="row">
                        <div className="col-6">
                          <p className="mb-1">
                            <strong>공급가액:</strong>{" "}
                            {selectedVersion.supplyAmount
                              ? selectedVersion.supplyAmount.toLocaleString() +
                                "원"
                              : "0원"}
                          </p>
                          <p className="mb-1">
                            <strong>할인액:</strong>{" "}
                            {selectedVersion.discountAmount
                              ? selectedVersion.discountAmount.toLocaleString() +
                                "원"
                              : "0원"}
                          </p>
                        </div>
                        <div className="col-6">
                          <p className="mb-1">
                            <strong>VAT:</strong>{" "}
                            {selectedVersion.vatAmount
                              ? selectedVersion.vatAmount.toLocaleString() +
                                "원"
                              : "0원"}
                          </p>
                          <p className="mb-1 text-primary">
                            <strong>총 견적금액:</strong>{" "}
                            {selectedVersion.totalAmount
                              ? selectedVersion.totalAmount.toLocaleString() +
                                "원"
                              : "0원"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 특약사항 */}
                  <div>
                    <h6 className="text-primary">📋 특약사항</h6>
                    <div className="bg-light p-2 rounded">
                      <p className="mb-0">
                        {selectedVersion.specialTerms || "특약사항이 없습니다."}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted p-4">
                  <p>왼쪽 목록에서 버전을 선택하세요.</p>
                </div>
              )}
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseVersionModal}>
            닫기
          </Button>
          <Button
            variant="primary"
            onClick={handleLoadVersionToPage}
            disabled={!selectedVersion || modalLoading}
          >
            이 버전 불러오기
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showEmailModal} onHide={handleCloseEmailModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>이메일 전송</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>현재 보고 있는 견적서를 아래 이메일 주소로 발송합니다.</p>
          <Form.Group controlId="recipientEmail">
            <Form.Label>수신자 이메일</Form.Label>
            <Form.Control
              type="email"
              placeholder="name@example.com"
              value={recipientEmail}
              onChange={(e) => setRecipientEmail(e.target.value)}
              autoFocus
            />
          </Form.Group>
          {sendError && (
            <Alert variant="danger" className="mt-3">
              {sendError}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseEmailModal}
            disabled={isSending}
          >
            취소
          </Button>
          <Button
            variant="primary"
            onClick={executeSendEmail}
            disabled={isSending}
          >
            {isSending ? <Spinner as="span" size="sm" /> : "전송"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Footer />
    </>
  );
};

export default EstimateDetailPage;
