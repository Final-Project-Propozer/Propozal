import React, { useEffect, useState, useRef, useCallback } from "react";
import { Container, Spinner, Alert } from "react-bootstrap";
import axiosInstance from "../../api/axiosInstance";

import SalesNavbar from "../../components/Navbar/SalesNavbar";
import Footer from "../../components/Footer/Footer";

import EstimateForm from "../../components/EstimateCreate/EstimateForm";
import EstimateItemTable from "../../components/EstimateCreate/EstimateItemTable";
import EstimateActions from "../../components/EstimateCreate/EstimateActions";

const EstimatePageCreation = () => {
  const [estimateId, setEstimateId] = useState(null);
  const [estimateData, setEstimateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasCreated = useRef(false);

  const fetchEstimateData = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await axiosInstance.get(`/estimate/${id}`);
      setEstimateData(res.data);
    } catch (err) {
      console.error("견적서 데이터 조회 오류:", err);
      setError("견적서 데이터를 불러오는 데 실패했습니다.");
    }
  }, []);

  // 견적서 생성 및 최초 데이터 로딩
  useEffect(() => {
    const createAndFetchEstimate = async () => {
      if (hasCreated.current) return;
      hasCreated.current = true;

      try {
        setLoading(true);
        const res = await axiosInstance.post("/estimate");
        const newEstimateId = res.data.id;
        setEstimateId(newEstimateId);

        // ✅ sessionStorage에 현재 작성 중인 견적서 ID 저장
        sessionStorage.setItem("currentEstimateId", newEstimateId);

        await fetchEstimateData(newEstimateId);
      } catch (err) {
        console.error("견적서 생성 오류:", err);
        setError("견적서 생성 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    createAndFetchEstimate();
  }, [fetchEstimateData]);

  useEffect(() => {
    return () => {};
  }, []);

  const clearCurrentEstimate = () => {
    sessionStorage.removeItem("currentEstimateId");
  };

  const handleItemsChange = useCallback(() => {
    fetchEstimateData(estimateId);
  }, [estimateId, fetchEstimateData]);

  return (
    <>
      <SalesNavbar />

      <Container className="py-4">
        <h2 className="mb-4" style={{ fontWeight: "bold" }}>
          견적서 작성
        </h2>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}

        {/* estimateData가 있을 때만 자식 컴포넌트들을 렌더링 */}
        {!loading && !error && estimateData && (
          <>
            <EstimateForm estimateId={estimateId} initialData={estimateData} />
            <hr className="my-4" />
            <EstimateItemTable
              estimateId={estimateId}
              initialItems={estimateData.items || []}
              onItemsChange={handleItemsChange}
            />
            <hr className="my-4" />
            <EstimateActions
              estimateId={estimateId}
              estimateData={estimateData}
            />
          </>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default EstimatePageCreation;
