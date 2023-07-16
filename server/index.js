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

// for getting email and name from front end

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
