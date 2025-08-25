import React from "react";
import { Card, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./MainIcon.css";

const MainIcon = ({ icon, title, link }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(link);
  };

  return (
    <Card className="text-center shadow-sm rounded-4 border-0 h-100 card-custom-bg">
      <Card.Body className="d-flex flex-column justify-content-between">
        <div className="mb-3 main-icon-green">{icon}</div>
        <h5 className="fw-bold mb-3">{title}</h5>
        <Button
          className="btn-go-green rounded-pill px-4 py-2 mt-auto"
          onClick={handleClick} // ✅ href → onClick
        >
          바로가기
        </Button>
      </Card.Body>
    </Card>
  );
};

export default MainIcon;
