import React, { useState } from 'react';
import AdminNavbar from '../../../components/Navbar/AdminNavbar.jsx';
import Footer from '../../../components/Footer/Footer.jsx';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';

const AdminProductList = () => {
  // 더미 제품 데이터 생성 (사진 없는 제품 포함)
  const dummyProducts = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    photo: i % 5 === 0 ? null : `https://via.placeholder.com/50?text=Product${i + 1}`,
    name: `제품명 ${i + 1}`,
    code: `PROD-${1000 + i}`,
    category: i % 3 === 0 ? '전자기기' : i % 3 === 1 ? '도서' : '식품',
    unitPrice: `${(i + 1) * 1000}원`,
    maxDiscountRate: `${(i + 1) % 10}%`,
    vatApplied: i % 2 === 0 ? '적용' : '미적용',
  }));

  const [products] = useState(dummyProducts);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // 페이지당 제품 개수를 10개로 변경

  // 페이지네이션 계산
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(products.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="d-flex flex-column min-vh-100">
      <AdminNavbar />
      <div className="container-fluid flex-grow-1" style={{ paddingTop: '100px' }}>
        <h2 className="mb-4">제품 목록</h2>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>사진</th>
              <th>제품명</th>
              <th>제품코드</th>
              <th>카테고리</th>
              <th>단가</th>
              <th>최대 할인율</th>
              <th>VAT 적용 여부</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  {product.photo ? (
                    <img src={product.photo} alt={product.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '15px', height: '15px', border: '1px solid #ccc', backgroundColor: '#f0f0f0' }}></div>
                  )}
                </td>
                <td>{product.name}</td>
                <td>{product.code}</td>
                <td>{product.category}</td>
                <td>{product.unitPrice}</td>
                <td>{product.maxDiscountRate}</td>
                <td>{product.vatApplied}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        
        {/* 페이지네이션 */}
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.Prev onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
            {[...Array(totalPages).keys()].map(page => (
              <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => paginate(page + 1)}>
                {page + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminProductList;