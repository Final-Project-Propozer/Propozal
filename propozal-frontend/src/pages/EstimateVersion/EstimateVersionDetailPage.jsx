import React from 'react';
import { Container } from 'react-bootstrap';
import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';

import EstimateVersionDetail from '../../components/EstimateVersion/EstimateVersionDetail';

const EstimateVersionDetailPage = () => {
  return (
    <>
      <SalesNavbar />

      {/* 본문을 main으로 감싸고 flex: 1 적용 */}
      <main style={{ flex: 1, marginTop: '70px' }}>
        <Container className="py-4">
          <EstimateVersionDetail />
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default EstimateVersionDetailPage;
