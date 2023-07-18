import "../styles/sell-car.css";
import React, { useEffect, useRef, useState } from "react";
import Typewriter from "typewriter-effect/dist/core";
import Vehicles from "./vehicles";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { toast, ToastContainer } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Box from "./Box";
import "./sellcar.css";

const SellCar = () => {
  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000", // Replace with your backend API base URL
  });
  const { user, isAuthenticated } = useAuth0();
  const [vehicles, setVehicles] = useState([]);

  // State variables to capture vehicle details
  const [vehiclename, setVehiclename] = useState("");
  const [vehicleno, setVehicleno] = useState("");
  const [seater, setSeater] = useState("");
  const [AC, setAC] = useState("AC"); // Default value is "AC"
  const [editingVehicle, setEditingVehicle] = useState(null);
  const typewriterRef = useRef(null);
  const [loading, setLoading] = useState(true); // New state to handle loading status

  useEffect(() => {
    if (user) {
      // Fetch user vehicles using the API endpoint
      axiosInstance
        .get(`/api/getUserVehicles/${user.email}`)
        .then((response) => {
          setVehicles(response.data);
          setLoading(false); // Set loading to false when data is fetched
        })
        .catch((error) => {
          console.error("Error fetching user vehicles:", error);
          setLoading(false); // Set loading to false even if there's an error
        });
    }
  }, [user]);

  useEffect(() => {
    // Initialize the Typewriter effect
    const typewriter = new Typewriter(typewriterRef.current, {
      strings: ["YOUR VEHICLES..."],
      autoStart: true,
      loop: true,
      typeSpeed: 10,
    });

    return () => {
      // Clean up the Typewriter effect
      typewriter.stop();
    };
  }, []);

  const handleEdit = (vehicle) => {
    // When the edit button is clicked, set the values in the input fields for editing
    setEditingVehicle(vehicle);
    setVehiclename(vehicle.vehiclename);
    setVehicleno(vehicle.vehicleno);
    setSeater(vehicle.seater);
    setAC(vehicle.AC);
  };

  const handleCancelEdit = () => {
    // Clear the input fields and cancel the edit mode
    setEditingVehicle(null);
    setVehiclename("");
    setVehicleno("");
    setSeater("");
    setAC("AC");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a vehicle object with the user's email and unique identifier (vehicleno)
    const vehicleData = {
      vehicleno,
      driveremail: user.email,
      vehiclename,
      seater,
      AC: AC,
    };

    if (editingVehicle) {
      // If editingVehicle exists, we are in edit mode
      // Send vehicle data to the backend for updating
      axiosInstance
        .post("/api/updateVehicleData", vehicleData)
        .then((response) => {
          // Display a success message using toast notification
          toast.success("Vehicle details updated successfully!");
          handleCancelEdit(); // Clear the input fields and cancel the edit mode
          // Refetch user vehicles after updating
          axiosInstance
            .get(`/api/getUserVehicles/${user.email}`)
            .then((response) => {
              setVehicles(response.data);
            })
            .catch((error) => {
              console.error("Error fetching user vehicles:", error);
            });
        })
        .catch((error) => {
          // Display an error message using toast notification
          toast.error(
            "Failed to update vehicle details. Please try again later."
          );
        });
    } else {
      // If editingVehicle is null, we are in create mode
      // Send vehicle data to the backend for insertion
      axiosInstance
        .post("/api/insertVehicleData", vehicleData)
        .then((response) => {
          // Display a success message using toast notification
          toast.success("Vehicle details inserted successfully!");
          // Clear the input fields after successful submission
          setVehiclename("");
          setVehicleno("");
          setSeater("");
          setAC("AC");
          // Refetch user vehicles after insertion
          axiosInstance
            .get(`/api/getUserVehicles/${user.email}`)
            .then((response) => {
              setVehicles(response.data);
            })
            .catch((error) => {
              console.error("Error fetching user vehicles:", error);
            });
        })
        .catch((error) => {
          // Display an error message using toast notification
          toast.error(
            "Failed to insert vehicle details. Please try again later."
          );
        });
    }
  };

  const handleDelete = (vehicleNo) => {
    axiosInstance
      .post("/api/deleteVehicleData", { vehicleno: vehicleNo })
      .then((response) => {
        toast.success("Vehicle deleted successfully!");
        fetchUserVehicles();
      })
      .catch((error) => {
        toast.error("Failed to delete vehicle. Please try again later.");
      });
  };

  const fetchUserVehicles = () => {
    axiosInstance
      .get(`/api/getUserVehicles/${user.email}`)
      .then((response) => {
        setVehicles(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user vehicles:", error);
      });
  };

  return (
    <div className="bookings">
      <div className="booking__wrapper">
        <h2 className="booking__title" ref={typewriterRef}>
          YOUR VEHICLES...
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="details__form">
            <p className="profile__desc">Update your vehicle details here</p>

            <div className="form__group">
              <div>
                <label>Vehicle Name</label>
                <input
                  required
                  type="text"
                  placeholder="Enter name"
                  value={vehiclename}
                  onChange={(e) => setVehiclename(e.target.value)}
                />
              </div>

              <div>
                <label>Vehicle No</label>
                <input
                  required
                  type="text"
                  placeholder="Enter Vehicle No"
                  value={vehicleno}
                  onChange={(e) => setVehicleno(e.target.value)}
                  minLength={10}
                  maxLength={10}
                />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Seater</label>
                <input
                  required
                  type="text"
                  placeholder="Enter Seats"
                  value={seater}
                  onChange={(e) => setSeater(e.target.value)}
                />
              </div>
              <div>
                <label>AC/NON AC</label>
                <select value={AC} onChange={(e) => setAC(e.target.value)}>
                  <option value="AC">AC</option>
                  <option value="NON AC">NON AC</option>
                </select>
              </div>
            </div>

            <div className="form__group"></div>

            <div className="form__group">
              <div className="profile__img-btns">
                <button type="submit" className="setting__btn active__btn">
                  Update
                </button>
              </div>
            </div>
          </div>
        </form>
        <Box>
          {loading ? (
            <p>Loading...</p> // Show a loading message while fetching data
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Vehicle Name</TableCell>
                    <TableCell>Vehicle No</TableCell>
                    <TableCell>Seater</TableCell>
                    <TableCell>AC/NON AC</TableCell>
                    <TableCell>Edit</TableCell>
                    <TableCell>Delete</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {vehicles.map((vehicle) => (
                    <TableRow key={vehicle.vehicleno}>
                      <TableCell>{vehicle.vehiclename}</TableCell>
                      <TableCell>{vehicle.vehicleno}</TableCell>
                      <TableCell>{vehicle.seater}</TableCell>
                      <TableCell>{vehicle.AC}</TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleEdit(vehicle)}
                          className="mera btn"
                        >
                          Edit
                        </button>
                      </TableCell>
                      <TableCell>
                        <button
                          onClick={() => handleDelete(vehicle.vehicleno)}
                          className="mera btn"
                        >
                          Delete
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SellCar;
