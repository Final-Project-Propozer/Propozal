// import React, { useState } from 'react';
// import { Container, ButtonGroup, Button } from 'react-bootstrap';
// import EstimateListPagetemp from '../../components/EstimateView/EstimateListPagetemp';
// import CompletedEstimateList from '../../components/EstimateView/CompletedEstimateList';
// import EstimateVersionList from '../../components/EstimateVersion/EstimateVersionList';
// import SalesNavbar from '../../components/Navbar/SalesNavbar';
// import Footer from '../../components/Footer/Footer';
//
// const EstimateListPageAll = () => {
//   const [activeTab, setActiveTab] = useState('draft'); // 기본값: 임시저장된 견적서
//
//   const renderSection = () => {
//     switch (activeTab) {
//       case 'draft':
//         return <EstimateListPagetemp />;
//       case 'completed':
//         return <CompletedEstimateList />;
//       case 'versions':
//         return <EstimateVersionList />;
//       default:
//         return null;
//     }
//   };
//
//   return (
//     <>
//       {/* 상단 네비게이션 */}
//       <SalesNavbar />
//
//       {/* 본문 영역 */}
//       <Container className="py-4" style={{ marginTop: '70px', minHeight: '70vh' }}>
// {/*         <h2 className="fw-bold mb-4">📄 견적서 목록</h2> */}
//
//         <ButtonGroup className="mb-4">
//           <Button
//             variant={activeTab === 'draft' ? 'primary' : 'outline-primary'}
//             onClick={() => setActiveTab('draft')}
//           >
//             임시저장된 견적서
//           </Button>
//           <Button
//             variant={activeTab === 'completed' ? 'primary' : 'outline-primary'}
//             onClick={() => setActiveTab('completed')}
//           >
//             완성된 견적서
//           </Button>
//           <Button
//             variant={activeTab === 'versions' ? 'primary' : 'outline-primary'}
//             onClick={() => setActiveTab('versions')}
//           >
//             버전별 목록 조회
//           </Button>
//         </ButtonGroup>
//
//         {renderSection()}
//       </Container>
//
//       {/* 하단 푸터 */}
//       <Footer />
//     </>
//   );
// };
//
// export default EstimateListPageAll;

import React, { useState } from 'react';
import { Container, ButtonGroup, Button } from 'react-bootstrap';
import EstimateListPagetemp from '../../components/EstimateView/EstimateListPagetemp';
import CompletedEstimateList from '../../components/EstimateView/CompletedEstimateList';
import EstimateVersionList from '../../components/EstimateVersion/EstimateVersionList';
import SalesNavbar from '../../components/Navbar/SalesNavbar';
import Footer from '../../components/Footer/Footer';

const EstimateListPageAll = () => {
  const [activeTab, setActiveTab] = useState('completed'); // 기본값: 완성된 견적서

  const renderSection = () => {
    switch (activeTab) {
      case 'completed':
        return <CompletedEstimateList />;
      case 'draft':
        return <EstimateListPagetemp />;
      case 'versions':
        return <EstimateVersionList />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* 상단 네비게이션 */}
      <SalesNavbar />

      {/* 본문 영역 */}
      <Container className="py-4" style={{ marginTop: '70px', minHeight: '70vh' }}>
        {/* <h2 className="fw-bold mb-4">📄 견적서 목록</h2> */}

        <ButtonGroup className="mb-4">
          <Button
            variant={activeTab === 'completed' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveTab('completed')}
          >
            완성된 견적서
          </Button>
          <Button
            variant={activeTab === 'draft' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveTab('draft')}
          >
            임시저장된 견적서
          </Button>
          <Button
            variant={activeTab === 'versions' ? 'primary' : 'outline-primary'}
            onClick={() => setActiveTab('versions')}
          >
            버전별 목록 조회
          </Button>
        </ButtonGroup>

        {renderSection()}
      </Container>

      {/* 하단 푸터 */}
      <Footer />
    </>
  );
};

export default EstimateListPageAll;
