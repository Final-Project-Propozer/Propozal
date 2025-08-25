import React, { useState } from 'react';

const DashboardQuoteList = ({ items = [] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(items.length / postsPerPage));
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = items.slice(indexOfFirstPost, indexOfLastPost);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">고객사</th>
            <th scope="col">담당자</th>
            <th scope="col">만료일</th>
            <th scope="col">지연일</th>
            <th scope="col">금액</th>
            <th scope="col">상태</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((item) => (
            <tr key={item.estimateId}>
              <th scope="row">{item.estimateId}</th>
              <td>{item.customerCompanyName}</td>
              <td>{item.salesPersonName}</td>
              <td>{item.expirationDate}</td>
              <td>{item.daysOverdue}</td>
              <td>{item.amount}</td>
              <td>{item.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <a className="page-link" href="#" onClick={() => paginate(currentPage - 1)}>
              이전
            </a>
          </li>
          {pageNumbers.map((number) => (
            <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
              <a onClick={() => paginate(number)} className="page-link" href="#">
                {number}
              </a>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
            <a className="page-link" href="#" onClick={() => paginate(currentPage + 1)}>
              다음
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default DashboardQuoteList;