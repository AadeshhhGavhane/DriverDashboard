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
import axios from "axios";

export default function Confirmed() {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
  });
  const { user } = useAuth0();
  const [confirmedBookings, setConfirmedBookings] = useState([]);

  useEffect(() => {
    // Fetch confirmed bookings for the driver
    axiosInstance
      .get(`/getConfirmedBookings/${user.email}`)
      .then((response) => {
        setConfirmedBookings(response.data);
      })
      .catch((error) => {
        console.error("Error fetching confirmed bookings:", error);
      });
  }, [user.email]);

  const handleCancel = (ticketid) => {
    // Cancel the booking
    axiosInstance
      .post("/cancelBooking", { ticketid })
      .then((response) => {
        // Remove the canceled booking from the state
        setConfirmedBookings(
          confirmedBookings.filter((booking) => booking.ticketid !== ticketid)
        );
      })
      .catch((error) => {
        console.error("Error canceling booking:", error);
      });
  };

  return (
    <>
      <Box>
        {confirmedBookings.length === 0 ? (
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
                {confirmedBookings.map((booking) => (
                  <TableRow key={booking.ticketid}>
                    <TableCell>{booking.useremail}</TableCell>
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
                        color="secondary"
                        onClick={() => handleCancel(booking.ticketid)}
                      >
                        Cancel
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
