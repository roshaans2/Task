const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

require("dotenv").config()

const app = express();
const port = 8000;
const mongoUrl = process.env.MONGO_URI;
const dbName = 'cveDatabase';
const collectionName = 'vulnerabilities';

const cors = require('cors');

app.use(bodyParser.json());
app.use(cors())

let db, collection;

MongoClient.connect(mongoUrl, { useUnifiedTopology: true })
  .then(client => {
    db = client.db(dbName);
    collection = db.collection(collectionName);
  })
  .catch(error => console.error(error));

app.get('/cves/list', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;
  const totalRecords = await collection.countDocuments();
  const cves = await collection.find().skip(skip).limit(parseInt(limit)).toArray();
  res.json({ totalRecords, cves });
});

app.get('/cves/:id', async (req, res) => {
  const { id } = req.params;
  const cve = await collection.findOne({ 'cve.id': id });
  res.json(cve);
});

app.get('/cves/year/:year', async (req, res) => {
  const { year } = req.params;
  const cves = await collection.find({ 'cve.published': { $regex: `^${year}` } }).toArray();
  res.json(cves);
});

app.get('/cves/score/:score', async (req, res) => {
  const { score } = req.params;
  const cves = await collection.find({ 'cve.metrics.cvssMetricV2.cvssData.baseScore': parseFloat(score) }).toArray();
  res.json(cves);
});

app.get('/cves/modified/:days', async (req, res) => {
  const { days } = req.params;
  const date = new Date();
  date.setDate(date.getDate() - parseInt(days));
  const cves = await collection.find({ 'cve.lastModified': { $gte: date.toISOString() } }).toArray();
  res.json(cves);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
