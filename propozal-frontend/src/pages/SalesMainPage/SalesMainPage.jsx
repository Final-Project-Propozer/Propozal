// src/pages/SalesMainPage/SalesMainPage.jsx
import React from "react";
import { Container } from "react-bootstrap";
import SalesNavbar from "../../components/Navbar/SalesNavbar";
import MainIconGroup from "../../components/SalesMainPage/MainIconGroup";
import ScheduleListGroup from "../../components/SalesMainPage/ScheduleListGroup";
import Footer from "../../components/Footer/Footer";

const SalesMainPage = () => {
  return (
    <>
      <SalesNavbar />

      <main>
        <Container className="pt-0 pb-0">
          <MainIconGroup />
          <ScheduleListGroup />
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default SalesMainPage;
