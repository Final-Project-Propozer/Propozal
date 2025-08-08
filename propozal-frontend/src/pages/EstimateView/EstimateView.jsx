import React from 'react';
import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';

import QuotationHeader from '../../components/EstimateView/QuotationHeader';
import EstimateInfoCard from '../../components/EstimateView/EstimateInfoCard';
import QuotationDetailsCard from '../../components/EstimateView/QuotationDetailsCard';
import QuotationFooterInfo from '../../components/EstimateView/QuotationFooterInfo';
// import QuotationSummary from '../../components/EstimateView/QuotationSummary'; // 선택적으로 포함

const EstimateView = () => {
  return (
    <>
      {/* 상단 네비게이션 */}
      <SalesNavbar />

      {/* 본문 */}
      <main className="estimate-view-wrapper">
        <QuotationHeader />
        <EstimateInfoCard />
        <QuotationDetailsCard />
        {/* <QuotationSummary /> */}
        <QuotationFooterInfo />
      </main>

      {/* 하단 푸터 */}
      <Footer />
    </>
  );
};

export default EstimateView;
