import React from 'react';
import { Container } from 'react-bootstrap';
import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';

import EstimateVersionDetail from '../../components/EstimateVersion/EstimateVersionDetail';

const EstimateVersionDetailPage = () => {
  return (
    <>
      <SalesNavbar />

      <Container className="py-4" style={{ marginTop: '70px' }}>
        <EstimateVersionDetail />
      </Container>

      <Footer />
    </>
  );
};

export default EstimateVersionDetailPage;
