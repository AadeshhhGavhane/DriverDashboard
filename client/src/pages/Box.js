import React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";

const Box = ({ children }) => {
  return (
    <Paper elevation={3} style={{ padding: "20px", marginBottom: "20px" }}>
      {children}
    </Paper>
  );
};

export default Box;
