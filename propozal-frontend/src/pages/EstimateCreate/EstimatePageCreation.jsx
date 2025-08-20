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
  const [estimateData, setEstimateData] = useState(null); // ✅ 전체 견적서 데이터를 관리할 state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const hasCreated = useRef(false);

  // ✅ useCallback으로 데이터 갱신 함수를 생성 (불필요한 재실행 방지)
  // 이 함수가 자식 컴포넌트(EstimateItemTable)에 전달될 onItemsChange의 본체입니다.
  const fetchEstimateData = useCallback(async (id) => {
    if (!id) return;
    try {
      const res = await axiosInstance.get(`/estimate/${id}`);
      setEstimateData(res.data); // state를 최신 데이터로 업데이트
    } catch (err) {
      console.error("견적서 데이터 조회 오류:", err);
      setError("견적서 데이터를 불러오는 데 실패했습니다.");
    }
  }, []); // 의존성 배열이 비어있어 함수가 한번만 생성됨

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
        await fetchEstimateData(newEstimateId); // ✅ 생성 직후 전체 데이터 가져오기
      } catch (err) {
        console.error("견적서 생성 오류:", err);
        setError("견적서 생성 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    createAndFetchEstimate();
  }, [fetchEstimateData]); // fetchEstimateData를 의존성 배열에 추가

  // ✅ EstimateItemTable에 전달할 최종 콜백 함수
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

        {/* ✅ estimateData가 있을 때만 자식 컴포넌트들을 렌더링 */}
        {!loading && !error && estimateData && (
          <>
            {/* ✅ 자식들에게 필요한 데이터를 props로 전달 */}
            <EstimateForm estimateId={estimateId} initialData={estimateData} />
            <hr className="my-4" />
            <EstimateItemTable
              estimateId={estimateId}
              initialItems={estimateData.items || []}
              onItemsChange={handleItemsChange}
            />
            <hr className="my-4" />
            <EstimateActions estimateId={estimateId} />
          </>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default EstimatePageCreation;
