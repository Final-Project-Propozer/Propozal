import React from 'react';
import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';
import ScheduleList from '../../components/Schedule/ScheduleList';
import './ScheduleCreatePage.css';

const ScheduleListPage = () => {
  return (
    <>
      <SalesNavbar />

      <div className="main-content container py-4">
        <ScheduleList />
      </div>

      <Footer />
    </>
  );
};

export default ScheduleListPage;
