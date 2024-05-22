const { MongoClient } = require('mongodb');
const fetch = require('node-fetch');
const cron = require('node-cron');

require("dotenv").config()


const apiUrl = 'https://services.nvd.nist.gov/rest/json/cves/2.0';
const resultsPerPage = 2000;
const dbName = 'cveDatabase';
const collectionName = 'vulnerabilities';
const mongoUrl = process.env.MONGO_URI;

async function fetchCveData(startIndex) {
  const url = `${apiUrl}?resultsPerPage=${resultsPerPage}&startIndex=${startIndex}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
}

async function storeCveData(cveArray) {
  const client = new MongoClient(mongoUrl, { useUnifiedTopology: true });
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  for (const cve of cveArray) {
    await collection.updateOne({ 'cve.id': cve.id }, { $set: cve }, { upsert: true });
  }

  await client.close();
}

async function main() {
  let startIndex = 0;
  let totalResults = 251399;

  while (startIndex < totalResults) {
    const data = await fetchCveData(startIndex);
    totalResults = data.totalResults; 
    const cveArray = data.vulnerabilities.map(item => item.cve);

    await storeCveData(cveArray);

    startIndex += resultsPerPage;
  }
}

cron.schedule('0 0 * * *', () => {
    main().catch(console.error); 
});