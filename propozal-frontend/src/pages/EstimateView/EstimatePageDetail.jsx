// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { Container, Spinner, Alert } from 'react-bootstrap';
// import axiosInstance from '../../api/axiosInstance';
//
// import SalesNavbar from '../../components/Navbar/SalesNavbar';
// import Footer from '../../components/Footer/Footer';
//
// import EstimateForm from '../../components/EstimateCreate/EstimateForm';
// import EstimateItemTable from '../../components/EstimateCreate/EstimateItemTable';
// import EstimateActions from '../../components/EstimateCreate/EstimateActions';
//
// const EstimatePageDetail = () => {
//   const { id } = useParams(); // ✅ URL에서 estimateId 추출
//   const [estimateData, setEstimateData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//
//   useEffect(() => {
//     const fetchEstimate = async () => {
//       try {
//         const res = await axiosInstance.get(`/api/estimate/${id}`);
//         console.log('견적서 상세 조회 응답:', res.data);
//         setEstimateData(res.data);
//       } catch (err) {
//         console.error('견적서 조회 오류:', err);
//         setError('견적서 정보를 불러오는 데 실패했습니다.');
//       } finally {
//         setLoading(false);
//       }
//     };
//
//     fetchEstimate();
//   }, [id]);
//
//   return (
//     <>
//       <SalesNavbar />
//
//       <Container className="py-4" style={{ marginTop: '70px' }}>
//         <h2 className="mb-4">견적서 상세 조회</h2>
//
//         {loading && <Spinner animation="border" />}
//         {error && <Alert variant="danger">{error}</Alert>}
//         {!loading && !error && estimateData && (
//           <>
//             <EstimateForm estimateId={estimateData.id} readOnly={true} />
//             <hr className="my-4" />
//             <EstimateItemTable estimateId={estimateData.id} readOnly={true} />
//             <hr className="my-4" />
//             <EstimateActions estimateId={estimateData.id} />
//           </>
//         )}
//       </Container>
//
//       <Footer />
//     </>
//   );
// };
//
// export default EstimatePageDetail;
