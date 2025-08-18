import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';

import EstimateForm from '../../components/EstimateCreate/EstimateForm';
import EstimateItemTable from '../../components/EstimateCreate/EstimateItemTable';
import EstimateActions from '../../components/EstimateCreate/EstimateActions';

const EstimateEditPage = () => {
  const { id: estimateId } = useParams(); // ✅ URL에서 estimateId 추출
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exists, setExists] = useState(false); // ✅ 견적서 존재 여부 확인용

  useEffect(() => {
    const checkEstimateExists = async () => {
      try {
        const res = await axiosInstance.get(`/api/estimate/${estimateId}`);
        console.log('견적서 조회 성공:', res.data);
        setExists(true);
      } catch (err) {
        console.error('견적서 조회 실패:', err);
        setError('존재하지 않는 견적서입니다.');
      } finally {
        setLoading(false);
      }
    };

    if (estimateId) {
      checkEstimateExists();
    }
  }, [estimateId]);

  return (
    <>
      <SalesNavbar />

      <Container className="py-4" style={{ marginTop: '70px' }}>
        <h2 className="mb-4" style={{ fontWeight: 'bold' }}>견적서 수정</h2>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && exists && (
          <>
            <EstimateForm estimateId={estimateId} readOnly={false} />
            <hr className="my-4" />
            <EstimateItemTable estimateId={estimateId} readOnly={false} />
            <hr className="my-4" />
            <EstimateActions estimateId={estimateId} readOnly={false} />
          </>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default EstimateEditPage;
