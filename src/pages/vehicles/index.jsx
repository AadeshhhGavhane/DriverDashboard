import { Box, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useState } from "react";
import { v4 as generateUniqueId } from "uuid";
import { useTheme } from "@mui/material";
import { tokens } from "../theme";

const Vehicles = () => {
  const [rows, setRows] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [newRecord, setNewRecord] = useState({
    id: "",
    vehicleId: "",
    vehicle: "",
    km_miles: "",
  });
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "vehicleId", headerName: "Vehicle ID", headerAlign: "left", flex: 1 },
    {
      field: "vehicle",
      headerName: "Vehicle",
      flex: 1,
      cellClassName: "name-column--cell",
      headerAlign: "left"
    },
    {
      field: "km_miles",
      headerName: "Km/miles",
      headerAlign: "left",
      align: "left",
      flex: 1
    },
    {
      field: "actions",
      headerName: "Actions",
      headerAlign: "left",
      align: "left",
      flex: 0.5,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleEditRecord(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => handleDeleteRecord(params.row.id)}
          >
            Delete
          </Button>
        </>
      )
    },
  ];

  const handleAddRecord = () => {
    const newVehicle = {
      id: generateUniqueId(),
      vehicleId: newRecord.vehicleId,
      vehicle: newRecord.vehicle,
      km_miles: newRecord.km_miles,
    };

    setRows((prevRows) => [...prevRows, newVehicle]);
    setNewRecord({
      id: "",
      vehicleId: "",
      vehicle: "",
      km_miles: "",
    });
  };


  const handleEditRecord = (record) => {
    setSelectedRecord(record);
    setNewRecord(record);
  };

  const handleUpdateRecord = () => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) =>
        row.id === newRecord.id ? newRecord : row
      );
      return updatedRows;
    });
    setSelectedRecord(null);
    setNewRecord({
      id: "",
      vehicleId: "",
      vehicle: "",
      km_miles: "",
    });
  };

  const handleDeleteRecord = (recordId) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== recordId));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewRecord((prevRecord) => ({
      ...prevRecord,
      [name]: value,
    }));
  };

  return (
    <Box m="20px">
      <Box
        m="10px 0 0 0"
        height="50vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "greenyellow",
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: "white",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          components={{
            Toolbar: () => (
              <GridToolbar>
                <Button variant="contained" color="primary" onClick={handleAddRecord}>
                  Add
                </Button>
              </GridToolbar>
            ),
          }}
        />
      </Box>

      {selectedRecord && (
        <Box mt={4}>
          <TextField
            name="vehicleId"
            label="Vehicle ID"
            value={newRecord.vehicleId}
            onChange={handleInputChange}
            InputProps={{
              style: {
                color: "#FFFFFF",
              },
            }}
            InputLabelProps={{
              style: {
                color: "#FFFFFF",
              },
            }}
            sx={{
              color: "#FFFFFF",
            }}
          />
          <TextField
            name="vehicle"
            label="Vehicle"
            value={newRecord.vehicle}
            onChange={handleInputChange}
            InputProps={{
              style: {
                color: "#FFFFFF",
              },
            }}
            InputLabelProps={{
              style: {
                color: "#FFFFFF",
              },
            }}
            sx={{
              color: "#FFFFFF",
            }}
          />
          <TextField
            name="km_miles"
            label="Km/miles"
            value={newRecord.km_miles}
            onChange={handleInputChange}
            InputProps={{
              style: {
                color: "#FFFFFF",
              },
            }}
            InputLabelProps={{
              style: {
                color: "#FFFFFF",
              },
            }}
            sx={{
              color: "#FFFFFF",
            }}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpdateRecord}
            style={{ marginTop: "16px" }}
          >
            Update
          </Button>
        </Box>
      )}

      {!selectedRecord && (
        <Box mt={4}>
          <TextField
            name="vehicleId"
            label="Vehicle ID"
            value={newRecord.vehicleId}
            onChange={handleInputChange}
            InputProps={{ style: { color: "#FFFFFF" } }}
          />
          <TextField
            name="vehicle"
            label="Vehicle"
            value={newRecord.vehicle}
            onChange={handleInputChange}
            InputProps={{ style: { color: "#FFFFFF" } }}
          />
          <TextField
            name="km_miles"
            label="Km/miles"
            value={newRecord.km_miles}
            onChange={handleInputChange}
            InputProps={{ style: { color: "#FFFFFF" } }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddRecord}
            style={{ marginTop: "16px" }}
          >
            Add
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Vehicles;
