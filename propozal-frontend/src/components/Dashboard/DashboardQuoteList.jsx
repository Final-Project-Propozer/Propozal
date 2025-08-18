import React, { useState, useEffect } from 'react';

const DashboardQuoteList = () => {
  // 게시판에 표시할 가상의 데이터입니다.
  const allPosts = [
    { id: 1, title: '서울축산 견적서1.', author: '관리자', date: '2023-10-27' },
    { id: 2, title: '경기건설 견적서2', author: '관리자', date: '2023-10-26' },
    { id: 3, title: '경남산업 견적서3', author: '운영자', date: '2023-10-25' },
    { id: 4, title: '전북실업 견적서4', author: '운영자', date: '2023-10-24' },
    { id: 5, title: '전북실업 견적서4', author: '운영자', date: '2023-10-23' },
    { id: 6, title: '전북실업 견적서4', author: '운영자', date: '2023-10-22' },
    { id: 7, title: '전북실업 견적서4', author: '운영자', date: '2023-10-21' },
    { id: 8, title: '전북실업 견적서4', author: '운영자', date: '2023-10-20' },
    { id: 9, title: '전북실업 견적서4', author: '운영자', date: '2023-10-19' },
    { id: 10, title: '전북실업 견적서4', author: '운영자', date: '2023-10-18' },
    { id: 11, title: '전북실업 견적서4', author: '운영자', date: '2023-10-17' },
    { id: 12, title: '전북실업 견적서4', author: '운영자', date: '2023-10-16' },
    { id: 13, title: '전북실업 견적서4', author: '운영자', date: '2023-10-15' },
    { id: 14, title: '전북실업 견적서4', author: '운영자', date: '2023-10-14' },
    { id: 15, title: '전북실업 견적서4', author: '운영자', date: '2023-10-13' },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const totalPages = Math.ceil(allPosts / postsPerPage);
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = allPosts.slice(indexOfFirstPost, indexOfLastPost);
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
            <th scope="col">제목</th>
            <th scope="col">작성자</th>
            <th scope="col">작성일</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.map((post) => (
            <tr key={post.id}>
              <th scope="row">{post.id}</th>
              <td>{post.title}</td>
              <td>{post.author}</td>
              <td>{post.date}</td>
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