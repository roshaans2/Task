import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FirstPage.css'; 
import SecondPage from './SecondPage';
import { useNavigate } from 'react-router-dom';

function FirstPage() {
  const [cves, setCves] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`http://localhost:8000/cves/list?page=${currentPage}&limit=${resultsPerPage}`);
        setCves(response.data.cves);
        setTotalRecords(response.data.totalRecords);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [currentPage, resultsPerPage]);

  const handleResultsPerPageChange = (event) => {
    setResultsPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil(totalRecords / resultsPerPage);

  return (
    <div>
      <h1>CVE List</h1>
      <p>Total Records: {totalRecords}</p>
      <table className="cve-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Source Identifier</th>
            <th>Published Date</th>
            <th>Last Modified Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {cves.map((cve) => (
            <tr key={cve._id} onClick={()=>{
                navigate(`/cves/${cve.id}`)
            }}>
              <td>{cve.id}</td>
              <td>{cve.sourceIdentifier}</td>
              <td>{cve.published}</td>
              <td>{cve.lastModified}</td>
              <td>{cve.vulnStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
        <span>Page {currentPage} of {totalPages}</span>
        <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>Next</button>
      </div>
      <div>
        <label htmlFor="resultsPerPage">Results Per Page:</label>
        <select id="resultsPerPage" value={resultsPerPage} onChange={handleResultsPerPageChange}>
          <option value="10">10</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
      </div>
    </div>
  );
}

export default FirstPage;
