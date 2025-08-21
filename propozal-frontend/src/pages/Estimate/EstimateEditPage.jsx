import React, { useEffect, useState } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";

import SalesNavbar from "../../components/Navbar/SalesNavbar";
import Footer from "../../components/Footer/Footer";

import EstimateForm from "../../components/EstimateCreate/EstimateForm";
import EstimateItemTable from "../../components/EstimateCreate/EstimateItemTable";
import EstimateActions from "../../components/EstimateCreate/EstimateActions";

const EstimateEditPage = () => {
  const { id: estimateId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [estimateData, setEstimateData] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // 새로고침 트리거

  const fetchEstimateData = async () => {
    try {
      setError(""); // 에러 초기화
      const res = await axiosInstance.get(`/api/estimate/${estimateId}`);
      console.log("견적서 조회 성공:", res.data);
      setEstimateData(res.data);
    } catch (err) {
      console.error("견적서 조회 실패:", err);
      setError("존재하지 않는 견적서입니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (estimateId) {
      fetchEstimateData();
    }
  }, [estimateId]);

  const refreshEstimateData = () => {
    // 모든 컴포넌트가 새로고침되도록 key 업데이트
    setRefreshKey((prev) => prev + 1);
    fetchEstimateData();
  };

  return (
    <>
      <SalesNavbar />

      <Container className="py-4" style={{ marginTop: "70px" }}>
{/*         <h2 className="mb-4" style={{ fontWeight: "bold" }}> */}
{/*           견적서 수정 */}
{/*         </h2> */}

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
