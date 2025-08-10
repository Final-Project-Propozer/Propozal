import React from 'react';
import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';
import ScheduleEdit from '../../components/Schedule/ScheduleEdit';
import './ScheduleCreatePage.css';

const ScheduleEditPage = () => {
  return (
    <>
      <SalesNavbar />

      <div className="main-content container py-4">
        <ScheduleEdit />
      </div>

      <Footer />
    </>
  );
};

export default ScheduleEditPage;
