import React, { useEffect, useState } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import SalesNavbar from "../../components/Navbar/SalesNavbar";
import Footer from "../../components/Footer/Footer";

import EstimateForm from "../../components/EstimateEdit/EstimateForm";
import EstimateItemTable from "../../components/EstimateEdit/EstimateItemTable";
import EstimateActions from "../../components/EstimateEdit/EstimateActions";

const EstimateDetailPage = () => {
  const { id: estimateId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [exists, setExists] = useState(false);

  // ✅ 견적서 데이터를 저장할 state 추가
  const [estimateData, setEstimateData] = useState(null);

  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const res = await axiosInstance.get(`/estimate/${estimateId}`);
        console.log('견적서 조회 성공:', res.data);

        // ✅ 데이터를 state에 저장
        setEstimateData(res.data);
        setExists(true);
      } catch (err) {
        console.error("견적서 조회 실패:", err);
        setError("견적서를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };

    if (estimateId) {
      fetchEstimate();
    }
  }, [estimateId]);
  return (
    <>
      <SalesNavbar />

      <Container className="py-4" style={{ marginTop: "70px" }}>
        <h2 className="mb-4" style={{ fontWeight: "bold" }}>
          견적서 상세 조회
        </h2>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && exists && (
          <>
            {/* ✅ estimateData props 전달 */}
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
          </>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default EstimateDetailPage;
