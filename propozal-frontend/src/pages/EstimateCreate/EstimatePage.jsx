import React from 'react';
import { Container } from 'react-bootstrap';
import SalesNavbar from '../../components/Navbar/SalesNavbar';
import EstimateHeaderForm from '../../components/EstimateCreate/EstimateHeaderForm';
import EstimateDetailsForm from '../../components/EstimateCreate/EstimateDetailsForm';
import ItemTableForm from '../../components/EstimateCreate/ItemTableForm';
import EstimateSummaryForm from '../../components/EstimateCreate/EstimateSummaryForm';
import FooterActions from '../../components/EstimateCreate/FooterActions';
import Footer from '../../components/Footer/Footer';

const EstimatePage = () => {
  return (
    <>
      <SalesNavbar />

      <Container className="py-4" style={{ marginTop: '70px' }}>
        <EstimateHeaderForm />
        <EstimateDetailsForm />
        <ItemTableForm />
        <EstimateSummaryForm />
        <FooterActions />
      </Container>


      <Footer />
    </>
  );
};

export default EstimatePage;
