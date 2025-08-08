import React from 'react';
import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';
import ScheduleDetail from '../../components/Schedule/ScheduleDetail';
import './ScheduleCreatePage.css';

const ScheduleDetailPage = () => {
  return (
    <>
      <SalesNavbar />

      <div className="main-content container py-4">
        <ScheduleDetail />
      </div>

      <Footer />
    </>
  );
};

export default ScheduleDetailPage;
