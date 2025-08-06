// // src/components/SalesMainPage/MainIcon.jsx
// import React from "react";
// import { Card, Button } from "react-bootstrap";
// // import "./MainIcon.css";
//
// const MainIcon = ({ icon, title, link }) => {
//   return (
//     <Card className="text-center shadow-sm rounded-4 border-0 h-100">
//       <Card.Body className="d-flex flex-column justify-content-between">
//         <div className="mb-3 text-primary">{icon}</div>
//         <h5 className="fw-bold mb-3">{title}</h5>
//         <Button
//           variant="outline-primary"
//           className="rounded-pill px-4 py-2 mt-auto"
//           href={link}
//         >
//           바로가기
//         </Button>
//       </Card.Body>
//     </Card>
//   );
// };
//
// export default MainIcon;

// src/components/SalesMainPage/MainIcon.jsx
import React from "react";
import { Card, Button } from "react-bootstrap";
import "./MainIcon.css";

const MainIcon = ({ icon, title, link }) => {
  return (
    <Card className="text-center shadow-sm rounded-4 border-0 h-100 card-custom-bg">
      <Card.Body className="d-flex flex-column justify-content-between">
        <div className="mb-3 main-icon-green">{icon}</div>
        <h5 className="fw-bold mb-3">{title}</h5>
        <Button
          className="btn-go-green rounded-pill px-4 py-2 mt-auto"
          href={link}
        >
          바로가기
        </Button>
      </Card.Body>
    </Card>
  );
};

export default MainIcon;
