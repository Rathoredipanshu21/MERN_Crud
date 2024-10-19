const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json()); // To parse JSON bodies
app.use('/uploads', express.static('uploads')); // Serve static files from the uploads folder

// Create a connection to the MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',  // Replace with your MySQL username
  password: '',  // Replace with your MySQL password
  database: 'users',  // Your database name
});

// Connect to the database
db.connect(err => {
  if (err) {
    throw err;
  }
  console.log('MySQL Connected...');
});

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Generate unique file name
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
});

// API route to handle form submission
app.post('/submit-form', (req, res) => {
  const { name, gender, fname, date } = req.body;

  // Insert form data into the MySQL database
  const query = 'INSERT INTO form (name, gender, father_name, dob) VALUES (?, ?, ?, ?)';
  db.query(query, [name, gender, fname, date], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ message: 'Form data saved successfully!', result });
  });
});
// API to get all form data from the database
app.get('/form-data', (req, res) => {
    const query = 'SELECT * FROM form';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
  });


  // API to delete a form entry by ID
app.delete('/delete-form/:id', (req, res) => {
    const id = req.params.id;
    const query = 'DELETE FROM form WHERE id = ?';
    db.query(query, [id], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send({ message: 'Record deleted successfully!' });
    });
  });

  // API to update a form entry by ID
app.put('/update-form/:id', (req, res) => {
    const id = req.params.id;
    const { name, gender, fname, date } = req.body;
    const query = 'UPDATE form SET name = ?, gender = ?, father_name = ?, dob = ? WHERE id = ?';
    db.query(query, [name, gender, fname, date, id], (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send({ message: 'Record updated successfully!' });
    });
  });
  
  
  

// API to get all photos from the database
app.get('/photos', (req, res) => {
    const query = 'SELECT * FROM photo';
    db.query(query, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.json(results);
    });
  });
  

// API to handle form submission with image upload
app.post('/submit-photo', upload.single('photo'), (req, res) => {
  const { name } = req.body;
  const imagePath = `/uploads/${req.file.filename}`; // File path to save in DB

  // Insert form data (name and image path) into the 'photo' table
  const query = 'INSERT INTO photo (name, photo) VALUES (?, ?)';
  db.query(query, [name, imagePath], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ message: 'Photo and data saved successfully!', result });
  });
});

// Handle page not found
app.get('*', (req, res) => {
  res.status(404).send("Page not found");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
