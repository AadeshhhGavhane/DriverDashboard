const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "password",
  database: "pvtbusbooking",
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

// CONFIRMED

// Route to fetch confirmed bookings for a driver
app.get("/getConfirmedBookings/:userEmail", (req, res) => {
  const { userEmail } = req.params;
  const query =
    'SELECT * FROM permanentbooking WHERE driveremail = ? AND completed = "no"';
  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error("Error fetching confirmed bookings:", err);
      res
        .status(500)
        .json({ error: "Error fetching confirmed bookings from the database" });
    } else {
      res.json(results);
    }
  });
});

app.post("/cancelBooking", (req, res) => {
  const { ticketid } = req.body;
  const deleteBookingQuery = "DELETE FROM permanentbooking WHERE ticketid = ?";
  const updateTempBookingQuery =
    'UPDATE tempbooking SET status = "declined" WHERE ticketid = ?';

  db.query(deleteBookingQuery, [ticketid], (err, deleteResult) => {
    if (err) {
      console.error("Error canceling booking:", err);
      res
        .status(500)
        .json({ error: "Error canceling booking in the database" });
    } else {
      db.query(updateTempBookingQuery, [ticketid], (err, updateTempResult) => {
        if (err) {
          console.error("Error updating status in tempbooking:", err);
          res
            .status(500)
            .json({ error: "Error updating status in tempbooking table" });
        } else {
          res.json({ success: true, message: "Booking canceled successfully" });
        }
      });
    }
  });
});

// UPCOMING

// Route to fetch records from the "tempbooking" table based on driver's location
app.get("/getBookings/:userEmail", (req, res) => {
  const { userEmail } = req.params;
  // Fetch the location of the driver from the "driver" table based on the user's email
  const driverQuery = "SELECT location FROM driver WHERE email = ?";
  db.query(driverQuery, [userEmail], (err, driverResults) => {
    if (err) {
      console.error("Error fetching driver location:", err);
      res
        .status(500)
        .json({ error: "Error fetching driver location from the database" });
    } else {
      const driverLocation = driverResults[0].location;
      // Fetch records from the "tempbooking" table where the location matches the driver's location and status is "pending"
      const query =
        'SELECT * FROM tempbooking WHERE `from` = ? AND status = "pending"';
      db.query(query, [driverLocation], (err, tempBookingResults) => {
        if (err) {
          console.error("Error fetching tempbooking records:", err);
          res
            .status(500)
            .json({
              error: "Error fetching tempbooking records from the database",
            });
        } else {
          res.json(tempBookingResults);
        }
      });
    }
  });
});

// Route to accept a tempbooking record and move it to permanentbooking table
app.post("/acceptBooking", (req, res) => {
  const { ticketid, email } = req.body;
  const fetchTempBookingQuery = "SELECT * FROM tempbooking WHERE ticketid = ?";
  const insertQuery =
    "INSERT INTO permanentbooking (ticketid, useremail, `from`, `to`, date, journeytype, bussize, bustype, ac, driveremail, vehicleno, completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const updateStatusQuery =
    "UPDATE tempbooking SET status = ? WHERE ticketid = ?";

  db.query(fetchTempBookingQuery, [ticketid], (err, tempBookingResults) => {
    if (err) {
      console.error("Error fetching tempbooking record:", err);
      res
        .status(500)
        .json({ error: "Error fetching tempbooking record from the database" });
    } else {
      const tempBookingRecord = tempBookingResults[0];
      // If tempBookingRecord is undefined or null, it means no tempbooking record was found with the given ticketid
      if (!tempBookingRecord) {
        res
          .status(404)
          .json({
            error: "Tempbooking record not found with the provided ticketid",
          });
        return;
      }

      const driverEmail = req.body.email; // Assuming the authenticated user's email is available in req.user.email

      // Insert the record into the permanentbooking table using the fetched ticketid and driver's email
      db.query(
        insertQuery,
        [
          ticketid,
          tempBookingRecord.email, // Use email from tempbooking for useremail in permanentbooking
          tempBookingRecord.from,
          tempBookingRecord.to,
          tempBookingRecord.date,
          tempBookingRecord.journeytype,
          tempBookingRecord.bussize,
          tempBookingRecord.bustype,
          tempBookingRecord.ac,
          driverEmail, // Use the driver's email from auth0 for driveremail in permanentbooking
          "", // Leave vehicleno blank
          "no", // Set completed as "no"
        ],
        (err, insertResult) => {
          if (err) {
            console.error("Error inserting into permanentbooking:", err);
            res
              .status(500)
              .json({ error: "Error inserting into permanentbooking table" });
          } else {
            // Update the status to "accepted" in the tempbooking table
            db.query(
              updateStatusQuery,
              ["accepted", ticketid],
              (err, updateResult) => {
                if (err) {
                  console.error("Error updating status in tempbooking:", err);
                  res
                    .status(500)
                    .json({
                      error: "Error updating status in tempbooking table",
                    });
                } else {
                  res.json({
                    success: true,
                    message: "Booking accepted successfully",
                  });
                }
              }
            );
          }
        }
      );
    }
  });
});

// Route to decline a tempbooking record and update its status
app.post("/declineBooking", (req, res) => {
  const { ticketid, email } = req.body;
  const updateStatusQuery =
    "UPDATE tempbooking SET status = ? WHERE ticketid = ?";

  db.query(updateStatusQuery, ["declined", ticketid], (err, updateResult) => {
    if (err) {
      console.error("Error updating status in tempbooking:", err);
      res
        .status(500)
        .json({ error: "Error updating status in tempbooking table" });
    } else {
      res.json({ success: true, message: "Booking declined successfully" });
    }
  });
});

// PAST
// Route to fetch records from the "permanentbooking" table based on driveremail
app.get("/fetchRecords/:userEmail", (req, res) => {
  const { userEmail } = req.params;
  const query = `SELECT * FROM permanentbooking WHERE driveremail = ? AND completed = 'yes'`;

  db.query(query, [userEmail], (err, results) => {
    if (err) {
      console.error("Error fetching records:", err);
      res
        .status(500)
        .json({ error: "Error fetching records from the database" });
    } else {
      res.json(results);
    }
  });
});

// vehicles

app.post("/api/insertVehicleData", (req, res) => {
  const { driveremail, vehiclename, vehicleno, seater, AC } = req.body;

  // Insert vehicle data into the 'vehicles' table
  const query = `
    INSERT INTO vehicles (driveremail, vehiclename, vehicleno, seater, AC)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [driveremail, vehiclename, vehicleno, seater, AC],
    (err, results) => {
      if (err) {
        console.error("Error inserting vehicle data:", err);
        return res.status(500).json({ error: "Failed to insert vehicle data" });
      }
      return res.json({ message: "Vehicle data inserted successfully" });
    }
  );
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
      return res
        .status(500)
        .json({ error: "Failed to check vehicle existence" });
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
          return res
            .status(500)
            .json({ error: "Failed to update vehicle data" });
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
  const { email, name, adharcard, pancard, licenseno, number, dob, gender, location } =
    req.body;
  const updateQuery = `
      UPDATE driver
      SET 
        name = ?,
        adharcard = ?,
        pancard = ?,
        licenseno = ?,
        number = ?,
        dob = ?,
        gender = ?,
        location = ?
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
    location,
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
