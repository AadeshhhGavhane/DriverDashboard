import React, { useState, useEffect } from "react";
import Box from "./Box";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
} from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

export default function Upcoming() {
  const [bookings, setBookings] = useState([]);
  const { user } = useAuth0();

  useEffect(() => {
    // Fetch bookings from backend when the component mounts
    getBookings();
  }, []);

  const getBookings = () => {
    // Replace 'user.email' with the actual user's email from auth0
    const userEmail = user.email;

    fetch(`http://localhost:5000/getBookings/${userEmail}`)
      .then((response) => response.json())
      .then((data) => {
        setBookings(data);
      })
      .catch((error) => {
        console.error("Error fetching bookings:", error);
      });
  };

  const handleAccept = (ticketid) => {
    // Include the user's email in the request body
    const requestBody = {
      ticketid,
      email: user.email,
    };

    fetch("http://localhost:5000/acceptBooking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Booking accepted successfully, update the frontend
          getBookings();
        }
      })
      .catch((error) => {
        console.error("Error accepting booking:", error);
      });
  };

  const handleDecline = (ticketid) => {
    // Include the user's email in the request body
    const requestBody = {
      ticketid,
      email: user.email,
    };

    fetch("http://localhost:5000/declineBooking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Booking declined successfully, update the frontend
          getBookings();
        }
      })
      .catch((error) => {
        console.error("Error declining booking:", error);
      });
  };

  return (
    <>
      <Box>
        {bookings.length === 0 ? (
          <h1>No jobs.</h1>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>email</TableCell>
                  <TableCell>from</TableCell>
                  <TableCell>to</TableCell>
                  <TableCell>date</TableCell>
                  <TableCell>journeytype</TableCell>
                  <TableCell>bussize</TableCell>
                  <TableCell>bustype</TableCell>
                  <TableCell>ac</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.ticketid}>
                    <TableCell>{booking.email}</TableCell>
                    <TableCell>{booking.from}</TableCell>
                    <TableCell>{booking.to}</TableCell>
                    <TableCell>{booking.date}</TableCell>
                    <TableCell>{booking.journeytype}</TableCell>
                    <TableCell>{booking.bussize}</TableCell>
                    <TableCell>{booking.bustype}</TableCell>
                    <TableCell>{booking.ac}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => handleAccept(booking.ticketid)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="contained"
                        onClick={() => handleDecline(booking.ticketid)}
                      >
                        Decline
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </>
  );
}
