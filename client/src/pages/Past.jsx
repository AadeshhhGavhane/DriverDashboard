import React, { useState, useEffect } from "react";
import Box from "./Box";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

export default function Past() {
    const { user, isAuthenticated } = useAuth0();
  const [records, setRecords] = useState([]);

  useEffect(() => {
    // Fetch records from backend when the component mounts
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    // Replace 'user.email' with the actual user's email from auth0
    const userEmail = user.email;

    fetch(`http://localhost:5000/fetchRecords/${userEmail}`)
      .then((response) => response.json())
      .then((data) => {
        setRecords(data);
      })
      .catch((error) => {
        console.error("Error fetching records:", error);
      });
  };

  return (
    <>
      <Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ticketid</TableCell>
                <TableCell>useremail</TableCell>
                <TableCell>from</TableCell>
                <TableCell>to</TableCell>
                <TableCell>date</TableCell>
                <TableCell>journeytype</TableCell>
                <TableCell>vehicleno</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {records.map((record) => (
                <TableRow key={record.ticketid}>
                  <TableCell>{record.ticketid}</TableCell>
                  <TableCell>{record.useremail}</TableCell>
                  <TableCell>{record.from}</TableCell>
                  <TableCell>{record.to}</TableCell>
                  <TableCell>{record.date}</TableCell>
                  <TableCell>{record.journeytype}</TableCell>
                  <TableCell>{record.vehicleno}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
}
