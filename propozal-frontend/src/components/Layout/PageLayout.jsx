import React from 'react';
import SalesNavBar from '../Navbar/SalesNavBar';
import Footer from '../Footer/Footer';

const PageLayout = ({ children }) => {
  return (
    <div className="d-flex flex-column min-vh-100">
      <SalesNavBar />
      <main className="flex-grow-1">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
