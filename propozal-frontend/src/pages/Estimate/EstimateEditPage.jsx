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

  const calculateTotals = (items) => {
    if (!Array.isArray(items) || items.length === 0) {
      return {
        supplyAmount: 0,
        discountAmount: 0,
        vatAmount: 0,
        totalAmount: 0,
      };
    }

    let supply = 0;
    let discount = 0;

    items.forEach((item) => {
      const unitPrice = Number(item.unitPrice || 0);
      const quantity = Number(item.quantity || 1);
      const rate = Number(item.discountRate || 0);
      const subtotal = Number(item.subtotal || 0); // subtotal을 직접 활용

      // subtotal이 있다면 공급가액과 할인액을 역산하거나 subtotal을 기반으로 계산
      const originalPrice = unitPrice * quantity;
      supply += originalPrice;
      discount += originalPrice - subtotal;
    });

    const netAmount = supply - discount;
    const vat = Math.round(netAmount * 0.1);
    const total = netAmount + vat;

    return {
      supplyAmount: supply,
      discountAmount: discount,
      vatAmount: vat,
      totalAmount: total,
    };
  };

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

  const handleDataChange = (updatedData) => {
    setEstimateData((prevData) => ({ ...prevData, ...updatedData }));
  };

  const handleItemsChange = (newItems) => {
    const newTotals = calculateTotals(newItems);

    setEstimateData((prevData) => ({
      ...prevData,
      items: newItems,
      ...newTotals,
    }));
  };

  const refreshEstimateData = () => {
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
              estimateId={estimateId}
              onDataChange={handleDataChange}
              formData={estimateData}
            />
            <hr className="my-4" />
            <EstimateItemTable
              estimateId={estimateId}
              onItemsChange={handleItemsChange}
              initialItems={estimateData.items}
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

export default EstimateEditPage;
