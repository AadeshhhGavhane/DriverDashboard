const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require("mysql2");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "pvtbusbooking"
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("/api/getprofiledata/:email", (req, res) => {
  const email = req.params.email;
  const selectQuery = `SELECT * FROM driver WHERE email = '${email}'`;

  db.query(selectQuery, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching profile data from the database");
      return;
    }

    if (result.length === 0) {
      res.status(404).send("Driver profile not found");
    } else {
      res.send(result[0]);
    }
  });
});

app.post("/api/updateprofiledata", (req, res) => {
  const {
    email,
    name,
    adharcard,
    pancard,
    licenseno,
    number,
    dob,
    gender,
  } = req.body;
  const updateQuery = `
    UPDATE driver
    SET 
      name = ?,
      adharcard = ?,
      pancard = ?,
      licenseno = ?,
      number = ?,
      dob = ?,
      gender = ?
    WHERE email = ?
  `;

  const values = [
    name,
    adharcard,
    pancard,
    licenseno,
    number,
    dob,
    gender,
    email,
  ];

  db.query(updateQuery, values, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error updating profile data in the database");
      return;
    }

    res.send("Profile data updated successfully");
  });

  app.post("/api/getmailname", (req, res) => {
    const { email, name } = req.body;
    let checkEmailQuery = `SELECT COUNT(*) AS count FROM driver WHERE email = '${email}'`;
    let insertQuery = `INSERT INTO driver (email, name) SELECT '${email}', '${name}' WHERE NOT EXISTS (SELECT 1 FROM driver WHERE email = '${email}')`;

    db.query(checkEmailQuery, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("Error checking email existence in the database");
        return;
      }

      const count = result[0].count;

      if (count > 0) {
        // Email already exists
        res.send("Email already exists in the table");
      } else {
        // Email doesn't exist, perform the insert operation
        db.query(insertQuery, (err, result) => {
          if (err) {
            console.log(err);
            res.status(500).send("Error inserting data into the database");
            return;
          }
          console.log(result);
          res.send("Data inserted successfully");
        });
      }
    });
  });

  app.get("/", (req, res) => {
    res.send("Hello")
});
});
