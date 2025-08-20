import React, { useEffect, useState } from 'react';
import { Container, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';

import EstimateForm from '../../components/EstimateDetail/EstimateForm';
import EstimateItemTable from '../../components/EstimateCreate/EstimateItemTable';
import EstimateActions from '../../components/EstimateCreate/EstimateActions';

const EstimateDetailPage = () => {
  const { id: estimateId } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exists, setExists] = useState(false);

  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const res = await axiosInstance.get(`/estimate/${estimateId}`);
        console.log('견적서 조회 성공:', res.data);
        setExists(true);
      } catch (err) {
        console.error('견적서 조회 실패:', err);
        setError('견적서를 불러오는 데 실패했습니다.');
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

      <Container className="py-4" style={{ marginTop: '70px' }}>
        <h2 className="mb-4" style={{ fontWeight: 'bold' }}>견적서 상세 조회</h2>

        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        {!loading && exists && (
          <>
            <EstimateForm estimateId={estimateId} readOnly />
            <hr className="my-4" />
            <EstimateItemTable estimateId={estimateId} readOnly />
            <hr className="my-4" />
            <EstimateActions estimateId={estimateId} readOnly />
          </>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default EstimateDetailPage;
