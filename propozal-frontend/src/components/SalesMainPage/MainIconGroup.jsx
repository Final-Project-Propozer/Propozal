// src/components/SalesMainPage/MainIconGroup.jsx
import React from "react";
import { Row, Col } from "react-bootstrap";
import { FaFileSignature, FaFileAlt, FaCalendarAlt } from "react-icons/fa";
import MainIcon from "./MainIcon";

const iconData = [
  {
    icon: <FaFileSignature size={40} />,
    title: "견적서 작성",
    link: "/estimate",
  },
  {
    icon: <FaFileAlt size={40} />,
    title: "견적서 목록",
    link: "/estimate/list-all",
  },
  {
    icon: <FaFileAlt size={40} />,
    title: "완료된 견적서 목록",
    link: "/estimate/completedlist",
  },
  {
    icon: <FaCalendarAlt size={40} />,
    title: "스케줄 조회",
    link: "/schedule/list",
  },
];

const MainIconGroup = () => {
  return (
    <Row className="g-4 justify-content-center">
      {iconData.map((item, idx) => (
        <Col key={idx} xs={10} sm={6} md={4}>
          <MainIcon icon={item.icon} title={item.title} link={item.link} />
        </Col>
      ))}
    </Row>
  );
};

export default MainIconGroup;
