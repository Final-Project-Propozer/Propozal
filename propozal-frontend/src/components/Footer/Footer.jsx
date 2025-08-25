import React from 'react';
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer-fixed">
      <div className="footer-container">
{/*         <div className="footer-links"> */}
{/*           <a href="/terms-of-service">이용약관</a> */}
{/*           <a href="/privacy-policy">개인정보처리방침</a> */}
{/*         </div> */}
{/*         <div className="footer-info"> */}
{/*           <p>상호명: (주)프로포잘 | 대표: 홍길동 | 사업자등록번호: 123-45-67890 / 주소: 서울특별시 강남구 테헤란로 123</p> */}
{/*           <p>대표전화: 02-1234-5678 | 이메일: contact@proposal.com / © 2025 프로포잘. All Rights Reserved.</p> */}
{/*         </div> */}
      <div className="footer-content">
        <div className="footer-links">
          <a href="/terms-of-service">이용약관</a>
          <a href="/privacy-policy">개인정보처리방침</a>
        </div>
        <div className="footer-info">
          <p>상호명: (주)프로포잘 | 대표: 홍길동 | 사업자등록번호: 123-45-67890 | 주소: 서울특별시 강남구 테헤란로 123</p>
          <p>대표전화: 02-1234-5678 | 이메일: contact@proposal.com | © 2025 프로포잘. All Rights Reserved.</p>
        </div>
      </div>

      </div>
    </footer>
  );
};

export default Footer;