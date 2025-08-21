import React, { useEffect, useState, useRef } from "react";
import { Container, Spinner, Alert, Button } from "react-bootstrap";
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
  const [exists, setExists] = useState(false);
  const [estimateData, setEstimateData] = useState(null);

  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const res = await axiosInstance.get(`/api/estimate/${estimateId}`);
        setEstimateData(res.data);
        setExists(true);
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

  const handleEdit = () => {
    navigate(`/estimate/${estimateId}/edit`);
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

  const handleSendEmail = () => {
    alert("이메일 전송 기능은 아직 구현되지 않았습니다.");
  };

  // 현재 날짜 및 시간
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
          </h2>
          <div className="d-flex gap-2">
            <Button
              variant="outline-success"
              onClick={handleEdit}
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
              onClick={handleSendEmail}
              style={{ borderWidth: "2px" }}
            >
              이메일 전송
            </Button>
          </div>
        </div>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && exists && (
          <div ref={pdfRef}>
            {/* ✅ PDF 전용 텍스트: 화면에서는 숨김 */}
            <div
              style={{
                display: "none", // 화면에서는 숨김
              }}
            >
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
                  marginBottom: "10px", // 빈 줄 역할
                }}
              >
                견적서 상세 정보
              </div>
            </div>

            <EstimateForm
              estimateId={estimateId}
              estimateData={estimateData}
              readOnly
            />
            <hr className="my-4" />
            <EstimateItemTable
              estimateId={estimateId}
              estimateData={estimateData}
              readOnly
            />
            <hr className="my-4" />
            <EstimateActions
              estimateId={estimateId}
              estimateData={estimateData}
              readOnly
            />
          </div>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default EstimateDetailPage;
