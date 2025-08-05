// // src/components/Layout.jsx
//
// import React from 'react';
// import Navbar from '../Navbar/Navbar';
// import Footer from '../Footer/Footer';
//
// const Layout = ({ children }) => {
//   return (
//     <div>
//       <Navbar />
//       <main>
//         {children}
//       </main>
//       <Footer />
//     </div>
//   );
// };
//
// export default Layout;

// src/components/Layout.jsx

import React from 'react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';
import './Layout.css'; // CSS 파일 import!

const Layout = ({ children }) => {
  return (
    <div className="layout-wrapper"> {/* 클래스 추가! */}
      <Navbar />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
