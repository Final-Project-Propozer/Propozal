import React, { useEffect, useState, useRef } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import axiosInstance from '../../api/axiosInstance';

import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';

import EstimateForm from '../../components/EstimateCreate/EstimateForm';
import EstimateItemTable from '../../components/EstimateCreate/EstimateItemTable';
import EstimateActions from '../../components/EstimateCreate/EstimateActions';

const EstimatePageCreation = () => {
  const [estimateId, setEstimateId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasCreated = useRef(false); // ✅ 호출 여부를 기억하는 ref

  useEffect(() => {
    const createEstimate = async () => {
      if (hasCreated.current) return; // ✅ 이미 호출했으면 중단
      hasCreated.current = true;

      try {
        const res = await axiosInstance.post('/estimate');
        console.log('견적서 생성 응답:', res.data);
        console.log('생성된 estimateId:', res.data.id);
        setEstimateId(res.data.id);
      } catch (err) {
        console.error('견적서 생성 오류:', err);
        setError('견적서 생성 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    createEstimate();
  }, []);

  return (
    <>
      <SalesNavbar />

      <Container className="py-4">
        <h2 className="mb-4" style={{ fontWeight: 'bold' }}>견적서 작성</h2>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && !error && estimateId && (
          <>
            <EstimateForm estimateId={estimateId} />
            <hr className="my-4" />
            <EstimateItemTable estimateId={estimateId} />
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
