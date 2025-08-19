import React from 'react';
import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';
import ScheduleCreate from '../../components/Schedule/ScheduleCreate';
import './ScheduleCreatePage.css';

const ScheduleCreatePage = () => {
  return (
    <>
      <SalesNavbar />

      <div className="main-content container py-4">
        <ScheduleCreate />
      </div>

      <Footer />
    </>
  );
};

export default ScheduleCreatePage;
