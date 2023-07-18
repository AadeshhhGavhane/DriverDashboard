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

// vehicles

app.post("/api/insertVehicleData", (req, res) => {
  const { driveremail, vehiclename, vehicleno, seater, AC } = req.body;

  // Insert vehicle data into the 'vehicles' table
  const query = `
    INSERT INTO vehicles (driveremail, vehiclename, vehicleno, seater, AC)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [driveremail, vehiclename, vehicleno, seater, AC], (err, results) => {
    if (err) {
      console.error("Error inserting vehicle data:", err);
      return res.status(500).json({ error: "Failed to insert vehicle data" });
    }
    return res.json({ message: "Vehicle data inserted successfully" });
  });
});

// API endpoint to fetch vehicles based on user's email
app.get("/api/getUserVehicles/:email", (req, res) => {
  const email = req.params.email;

  // Fetch vehicles from the 'vehicles' table based on user's email
  const query = `
    SELECT * FROM vehicles WHERE driveremail = ?
  `;

  db.query(query, [email], (err, results) => {
    if (err) {
      console.error("Error fetching user vehicles:", err);
      return res.status(500).json({ error: "Failed to fetch user vehicles" });
    }
    return res.json(results);
  });
});

app.post("/api/deleteVehicleData", (req, res) => {
  const { vehicleno } = req.body;

  const deleteQuery = `
    DELETE FROM vehicles WHERE vehicleno = ?
  `;

  db.query(deleteQuery, [vehicleno], (err, results) => {
    if (err) {
      console.error("Error deleting vehicle:", err);
      return res.status(500).json({ error: "Failed to delete vehicle" });
    }
    return res.json({ message: "Vehicle deleted successfully" });
  });
});

app.post("/api/updateVehicleData", (req, res) => {
  const { vehicleno, driveremail, vehiclename, seater, AC } = req.body;

  // Check if the vehicle with the provided vehicleno exists
  const checkVehicleQuery = `
    SELECT COUNT(*) AS count FROM vehicles WHERE vehicleno = ?
  `;

  db.query(checkVehicleQuery, [vehicleno], (err, results) => {
    if (err) {
      console.error("Error checking vehicle existence:", err);
      return res.status(500).json({ error: "Failed to check vehicle existence" });
    }

    const count = results[0].count;

    if (count === 0) {
      // Vehicle with the provided vehicleno doesn't exist
      return res.status(404).json({ error: "Vehicle not found" });
    } else {
      // Update vehicle data in the 'vehicles' table
      const updateQuery = `
        UPDATE vehicles
        SET vehiclename = ?, seater = ?, AC = ?
        WHERE vehicleno = ?
      `;

      const values = [vehiclename, seater, AC, vehicleno];

      db.query(updateQuery, values, (err, results) => {
        if (err) {
          console.error("Error updating vehicle data:", err);
          return res.status(500).json({ error: "Failed to update vehicle data" });
        }
        return res.json({ message: "Vehicle data updated successfully" });
      });
    }
  });
});

// my profile

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
