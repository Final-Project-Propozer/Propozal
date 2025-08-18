import React from 'react';
import { Container } from 'react-bootstrap';
import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';

import EstimateVersionList from '../../components/EstimateVersion/EstimateVersionList';

const EstimateVersionListPage = () => {
  return (
    <>
      <SalesNavbar />

      <Container className="py-4" style={{ marginTop: '70px' }}>
        <h2 className="mb-4" style={{ fontWeight: 'bold' }}>견적서 버전 목록 - 특정 견적서 모든 버전 목록 조회</h2>
        <EstimateVersionList />
      </Container>

      <Footer />
    </>
  );
};

export default EstimateVersionListPage;
