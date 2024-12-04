const express = require('express');
const mysql = require('mysql');
const app = express();

// Create MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'hospital_db'
});

// Connect to the database
db.connect(err => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database.');
});

// Get all patients
app.get('/patients', (req, res) => {
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients';
  
  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// Get all providers
app.get('/providers', (req, res) => {
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers';

  db.query(query, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(result);
  });
});

// Get patients by first name
app.get('/patients/:first_name', (req, res) => {
  const { first_name } = req.params;
  const query = 'SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?';
  
  db.query(query, [first_name], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'No patients found with that first name' });
    }
    res.json(result);
  });
});

// Get providers by specialty
app.get('/providers/specialty/:specialty', (req, res) => {
  const { specialty } = req.params;
  const query = 'SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?';
  
  db.query(query, [specialty], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (result.length === 0) {
      return res.status(404).json({ message: 'No providers found with that specialty' });
    }
    res.json(result);
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
