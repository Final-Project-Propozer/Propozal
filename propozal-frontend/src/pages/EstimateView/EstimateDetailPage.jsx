// import React, { useEffect, useState } from 'react';
// import { Container, Spinner, Alert, Button, Row, Col } from 'react-bootstrap';
// import { useParams, useNavigate } from 'react-router-dom';
// import axiosInstance from '../../api/axiosInstance';
//
// import SalesNavbar from '../../components/Navbar/SalesNavbar';
// import Footer from '../../components/Footer/Footer';
//
// import EstimateForm from '../../components/EstimateDetail/EstimateForm';
// import EstimateItemTable from '../../components/EstimateCreate/EstimateItemTable';
// import EstimateActions from '../../components/EstimateCreate/EstimateActions';
//
// const EstimateDetailPage = () => {
//   const { id: estimateId } = useParams();
//   const navigate = useNavigate();
//
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [exists, setExists] = useState(false);
//   const [actionMessage, setActionMessage] = useState('');
//
//   useEffect(() => {
//     const fetchEstimate = async () => {
//       try {
//         const res = await axiosInstance.get(`/api/estimate/${estimateId}`);
//         console.log('견적서 조회 성공:', res.data);
//         setExists(true);
//       } catch (err) {
//         console.error('견적서 조회 실패:', err);
//         setError('견적서를 불러오는 데 실패했습니다.');
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     if (estimateId) {
//       fetchEstimate();
//     }
//   }, [estimateId]);
//
//   const handleEdit = () => {
//     navigate(`/estimate/${estimateId}/edit`);
//   };
//
//   const handleDelete = async () => {
//     if (!window.confirm('정말로 이 견적서를 삭제하시겠습니까?')) return;
//
//     try {
//       await axiosInstance.delete(`/api/estimate/${estimateId}`);
//       setActionMessage('견적서가 삭제되었습니다.');
//       navigate('/estimate'); // 목록 페이지로 이동
//     } catch (err) {
//       setError('삭제 중 오류가 발생했습니다.');
//     }
//   };
//
//   const handleDownload = async () => {
//     try {
//       const res = await axiosInstance.get(`/api/estimate/${estimateId}/download`, {
//         responseType: 'blob'
//       });
//
//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement('a');
//       link.href = url;
//       link.setAttribute('download', `estimate_${estimateId}.pdf`);
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       setError('다운로드 중 오류가 발생했습니다.');
//     }
//   };
//
//   const handleSendEmail = async () => {
//     try {
//       await axiosInstance.post(`/api/estimate/${estimateId}/send-email`);
//       setActionMessage('이메일이 성공적으로 전송되었습니다.');
//     } catch (err) {
//       setError('이메일 전송 중 오류가 발생했습니다.');
//     }
//   };
//
//   return (
//     <>
//       <SalesNavbar />
//
//       <Container className="py-4" style={{ marginTop: '70px' }}>
//         <h2 className="mb-4" style={{ fontWeight: 'bold' }}>견적서 상세 조회</h2>
//
//         {/* ✅ 버튼 영역 */}
//         <Row className="mb-4">
//           <Col className="d-flex gap-2">
//             <Button variant="primary" onClick={handleEdit}>수정</Button>
//             <Button variant="danger" onClick={handleDelete}>삭제</Button>
//             <Button variant="secondary" onClick={handleDownload}>다운로드</Button>
//             <Button variant="info" onClick={handleSendEmail}>이메일 전송</Button>
//           </Col>
//         </Row>
//
//         {actionMessage && <Alert variant="success">{actionMessage}</Alert>}
//         {loading && <Spinner animation="border" />}
//         {error && <Alert variant="danger">{error}</Alert>}
//         {!loading && exists && (
//           <>
//             <EstimateForm estimateId={estimateId} readOnly />
//             <hr className="my-4" />
//             <EstimateItemTable estimateId={estimateId} readOnly />
//             <hr className="my-4" />
//             <EstimateActions estimateId={estimateId} readOnly />
//           </>
//         )}
//       </Container>
//
//       <Footer />
//     </>
//   );
// };
//
// export default EstimateDetailPage;

import React, { useEffect, useState, useRef } from 'react';
import {
  Container,
  Spinner,
  Alert,
  Button,
  Row,
  Col
} from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';

import EstimateForm from '../../components/EstimateDetail/EstimateForm';
import EstimateItemTable from '../../components/EstimateCreate/EstimateItemTable';
import EstimateActions from '../../components/EstimateCreate/EstimateActions';

const EstimateDetailPage = () => {
  const { id: estimateId } = useParams();
  const navigate = useNavigate();
  const estimateRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [exists, setExists] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    const fetchEstimate = async () => {
      try {
        const res = await axiosInstance.get(`/estimate/${estimateId}`);
        console.log('견적서 조회 성공:', res.data);
        setExists(true);
      } catch (err) {
        console.error('견적서 조회 실패:', err);
        setError('견적서를 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (estimateId) {
      fetchEstimate();
    }
  }, [estimateId]);

  const handleEdit = () => {
    navigate(`/estimate/${estimateId}/edit`);
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 견적서를 삭제하시겠습니까?')) return;

    try {
      await axiosInstance.delete(`/api/estimate/${estimateId}`);
      setActionMessage('견적서가 삭제되었습니다.');
      navigate('/estimate');
    } catch (err) {
      setError('삭제 중 오류가 발생했습니다.');
    }
  };

  const handleDownload = async () => {
    if (!estimateRef.current) return;

    try {
      const canvas = await html2canvas(estimateRef.current, {
        scale: 2 // 고해상도 캡처
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10; // 여백 설정 (mm)
      const usableWidth = pageWidth - margin * 2;
      const usableHeight = pageHeight - margin * 2;

      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = usableWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      const x = margin;
      const y = margin;

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`estimate_${estimateId}.pdf`);
    } catch (err) {
      setError('PDF 다운로드 중 오류가 발생했습니다.');
    }
  };

  const handleSendEmail = async () => {
    try {
      await axiosInstance.post(`/api/estimate/${estimateId}/send-email`);
      setActionMessage('이메일이 성공적으로 전송되었습니다.');
    } catch (err) {
      setError('이메일 전송 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <SalesNavbar />

      <Container className="py-4" style={{ marginTop: '70px' }}>
        <Row className="align-items-center mb-4">
          <Col>
            <h2 style={{ fontWeight: 'bold' }}>견적서 상세 조회</h2>
          </Col>
          <Col className="text-end d-flex justify-content-end gap-2">
            <Button variant="outline-primary" onClick={handleEdit}>수정</Button>
            <Button variant="outline-danger" onClick={handleDelete}>삭제</Button>
            <Button variant="outline-secondary" onClick={handleDownload}>다운로드</Button>
            <Button variant="outline-info" onClick={handleSendEmail}>이메일 전송</Button>
          </Col>
        </Row>

        {actionMessage && <Alert variant="success">{actionMessage}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        {loading && <Spinner animation="border" />}
        {!loading && exists && (
          <div ref={estimateRef}>
            <EstimateForm estimateId={estimateId} readOnly />
            <hr className="my-4" />
            <EstimateItemTable estimateId={estimateId} readOnly />
            <hr className="my-4" />
            <EstimateActions estimateId={estimateId} readOnly />
          </div>
        )}
      </Container>

      <Footer />
    </>
  );
};

export default EstimateDetailPage;
