import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './SecondPage.css'; 

const SecondPage = () => {
  const { id } = useParams(); 
  const [cveData, setCveData] = useState(null);

  useEffect(() => {
    async function fetchCveData() {
      try {
        const response = await axios.get(`http://localhost:8000/cves/${id}`);
        console.log(response.data);
        setCveData(response.data);
      } catch (error) {
        console.error('Error fetching CVE data:', error);
      }
    }
    fetchCveData();
  }, [id]); 

  return (
    <div className="container">
      {cveData && (
        <div>
          <h1>CVE ID: {id}</h1>
          <p>Description: {cveData.descriptions[0].value}</p>
          <h2>CVSS V2 Metrics</h2>
          <div className="cvss-metrics">
            <p>Severity: {cveData.metrics.cvssMetricV2[0].baseSeverity}</p>
            <p>Score: {cveData.metrics.cvssMetricV2[0].cvssData.baseScore}</p>
            <p>Vector String: {cveData.metrics.cvssMetricV2[0].cvssData.vectorString}</p>
          </div>
          {cveData.metrics.cvssMetricV2 && (
            <div>
              <table className="cve-table">
                <thead>
                  <tr>
                    <th className="highlight">Access Vector</th>
                    <th className="highlight">Access Complexity</th>
                    <th className="highlight">Authentication</th>
                    <th className="highlight">Confidentiality Impact</th>
                    <th className="highlight">Integrity Impact</th>
                    <th className="highlight">Availability Impact</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{cveData.metrics.cvssMetricV2[0].cvssData.accessVector}</td>
                    <td>{cveData.metrics.cvssMetricV2[0].cvssData.accessComplexity}</td>
                    <td>{cveData.metrics.cvssMetricV2[0].cvssData.authentication}</td>
                    <td>{cveData.metrics.cvssMetricV2[0].cvssData.confidentialityImpact}</td>
                    <td>{cveData.metrics.cvssMetricV2[0].cvssData.integrityImpact}</td>
                    <td>{cveData.metrics.cvssMetricV2[0].cvssData.availabilityImpact}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
          <div className="scores">
            <h3>Scores:</h3>
            <p>Exploitability Score: {cveData.metrics.cvssMetricV2[0].exploitabilityScore || 'N/A'}</p>
            <p>Impact Score: {cveData.metrics.cvssMetricV2[0].impactScore || 'N/A'}</p>
          </div>
          <div className="cpe-section">
            <h3>CPE:</h3>
            <table className="cve-table">
              <thead>
                <tr>
                  <th className="highlight">Criteria</th>
                  <th className="highlight">Match Criteria ID</th>
                  <th className="highlight">Vulnerable</th>
                </tr>
              </thead>
              <tbody>
                  <tr>
                    <td>{cveData.configurations[0].nodes[0].cpeMatch[0].criteria}</td>
                    <td>{cveData.configurations[0].nodes[0].cpeMatch[0].matchCriteriaId}</td>
                    <td>{cveData.configurations[0].nodes[0].cpeMatch[0].vulnerable == true?"true":"false"}</td>
                  </tr>
                </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default SecondPage;
