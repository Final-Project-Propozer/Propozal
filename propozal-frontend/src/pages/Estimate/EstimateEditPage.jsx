import React, { useEffect, useState } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import { useParams, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import SalesNavbar from "../../components/Navbar/SalesNavbar";
import Footer from "../../components/Footer/Footer";

import EstimateForm from "../../components/EstimateCreate/EstimateForm";
import EstimateItemTable from "../../components/EstimateCreate/EstimateItemTable";
import EstimateActions from "../../components/EstimateCreate/EstimateActions";

const EstimateEditPage = () => {
  const { id: estimateId } = useParams();
  const location = useLocation(); // location 객체를 가져옵니다.

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [estimateData, setEstimateData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchEstimateData = async () => {
    try {
      setError("");
      const res = await axiosInstance.get(`/estimate/${estimateId}`);
      console.log("최신 견적서 조회 성공:", res.data);
      setEstimateData(res.data);
    } catch (err) {
      console.error("견적서 조회 실패:", err);
      setError("존재하지 않는 견적서입니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.versionData) {
      console.log("버전 데이터를 사용하여 페이지를 렌더링합니다.");
      setEstimateData(location.state.versionData);
      setLoading(false);
    } else {
      console.log("최신 데이터를 API로 조회합니다.");
      if (estimateId) {
        fetchEstimateData();
      }
    }
  }, [estimateId, location.state]);

  const refreshEstimateData = () => {
    // 모든 컴포넌트가 새로고침되도록 key 업데이트
    setRefreshKey((prev) => prev + 1);
    fetchEstimateData();
  };

  return (
    <>
      <SalesNavbar />
      <Container className="py-4" style={{ marginTop: "70px" }}>
        <h2 className="mb-4" style={{ fontWeight: "bold" }}>
          견적서 수정
        </h2>

        {loading && (
          <div className="text-center py-4">
            <Spinner animation="border" />
            <div className="mt-2">견적서 정보를 불러오는 중...</div>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        {!loading && estimateData && (
          <>
            <EstimateForm
              key={`form-${refreshKey}`}
              estimateId={estimateId}
              initialData={estimateData}
              readOnly={false}
            />
            <hr className="my-4" />
            <EstimateItemTable
              key={`items-${refreshKey}`}
              estimateId={estimateId}
              initialItems={estimateData.items}
              onItemsChange={refreshEstimateData}
              readOnly={false}
            />
            <hr className="my-4" />
            <EstimateActions
              key={`actions-${refreshKey}`}
              estimateId={estimateId}
              readOnly={false}
            />
          </>
        )}
      </Container>
      <Footer />
    </>
  );
};

export default EstimateEditPage;
