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

  // ✅ 현재 화면에 표시되는 견적서 데이터를 관리 (최신본 또는 불러온 버전)
  const [displayData, setDisplayData] = useState(null);
  // ✅ 현재 보고 있는 데이터의 종류를 표시하기 위한 상태
  const [viewInfo, setViewInfo] = useState(" (최신 상태)");

  // --- 버전 모달 관련 상태 ---
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versions, setVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null); // 미리보기용
  const [modalLoading, setModalLoading] = useState(false);

  // --- 이메일 모달 관련 상태 ---
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");

  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const res = await axiosInstance.get(`/estimate/${estimateId}`);
        setDisplayData(res.data); // 초기 데이터는 최신본으로 설정
      } catch (err) {
        setError("견적서를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (estimateId) {
      fetchEstimate();
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

  // 모달에서 특정 버전을 '미리보기' 위해 선택
  const handleVersionSelect = async (versionId) => {
    setModalLoading(true);
    try {
      const res = await axiosInstance.get(`/estimate/versions/${versionId}`);
      setSelectedVersion(res.data);
    } catch (err) {
      console.error("버전 데이터 로딩 실패:", err);
      alert("버전 정보를 불러오는 데 실패했습니다.");
    } finally {
      setModalLoading(false);
    }
  };

  // ✅ 모달에서 '이 버전 불러오기' 버튼 클릭 시, 페이지 전체 데이터를 교체
  const handleLoadVersionToPage = () => {
    if (!selectedVersion) return;
    const versionNumber = versions.findIndex(
      (v) => v.versionId === selectedVersion.versionId
    );
    setDisplayData(selectedVersion); // 페이지 데이터를 선택한 버전으로 교체
    setViewInfo(` (버전 ${versions.length - versionNumber} 불러옴)`); // 상단 제목 정보 변경
    handleCloseVersionModal(); // 모달 닫기
  };

  // [수정하기] 버튼 로직
  const handleNavigateToEdit = () => {
    if (!displayData) return;
    // 현재 화면에 보이는 데이터를 가지고 수정 페이지로 이동
    navigate(`/estimate/${estimateId}/edit`, {
      state: { versionData: displayData },
    });
  };

  const handleDownload = async () => {
    const element = pdfRef.current;
    if (!element) return;

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
  };

  // [이메일 전송] 버튼 로직 ("저장 후 발송" 방식 사용)
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
      // 1단계: 이메일 전송을 위해 서버에서 최신 데이터를 새로 받아옵니다.
      const response = await axiosInstance.get(`/estimate/${estimateId}`);
      const freshData = response.data; // 가장 최신 데이터

      // 2단계: 새로 받은 데이터에서 DTO에 없는 불필요한 필드를 제거합니다.
      const { id, user, sender, ...restOfData } = freshData;

      const versionPayload = {
        memo: "이메일 발송",
        estimateData: {
          ...restOfData,
          items: freshData.items.map(({ product, ...item }) => item),
        },
      };

      // 3단계: 가공된 데이터를 기반으로 새 버전을 저장합니다.
      const versionRes = await axiosInstance.post(
        `/estimate/${estimateId}/versions`,
        versionPayload
      );
      const newVersionId = versionRes.data.versionId;
      if (!newVersionId) {
        throw new Error("버전 ID를 받아오지 못했습니다.");
      }

      // 4단계: 새로 생성된 버전 ID로 이메일을 전송합니다.
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
          {/* ✅ 4개의 메인 버튼 */}
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
              수정하기
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

            {/* 자식 컴포넌트에 estimateId와 표시할 데이터(displayData) 전달 */}
            <EstimateForm
              estimateId={estimateId}
              estimateData={displayData}
              readOnly
            />
            <hr className="my-4" />
            <EstimateItemTable
              estimateId={estimateId}
              estimateData={displayData}
              readOnly
            />
            <hr className="my-4" />
            <EstimateActions
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
                <div>
                  <EstimateForm
                    estimateId={estimateId}
                    initialData={selectedVersion}
                    readOnly
                  />
                  <hr />
                  <EstimateItemTable
                    estimateId={estimateId}
                    initialItems={selectedVersion.items}
                    readOnly
                  />
                </div>
              ) : (
                <p className="text-muted">왼쪽 목록에서 버전을 선택하세요.</p>
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

      {/* --- 이메일 전송 모달 --- */}
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
