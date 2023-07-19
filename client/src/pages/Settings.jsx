import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/settings.css";
import { useAuth0 } from "@auth0/auth0-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Settings = () => {
  const { user, isAuthenticated } = useAuth0();
  const [profileData, setProfileData] = useState({
    name: "",
    adharcard: "",
    pancard: "",
    licenseno: "",
    email: "",
    number: "",
    dob: "",
    gender: "",
    location:""
  });

  useEffect(() => {
    if (user) {
      // Access the user object only if it's available
      setProfileData((prevData) => ({
        ...prevData,
        name: user.name,
        email: user.email,
      }));
      getProfileData(user.email);
    }
  }, [user]);

  const axiosInstance = axios.create({
    baseURL: "http://localhost:5000",
  });

  const getProfileData = (email) => {
    axiosInstance.get(`/api/getProfileData/${email}`).then((response) => {
      setProfileData(response.data);
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    // Convert phone number to a number (if needed)
    const phoneNumber = parseInt(profileData.number, 10);

    // Update the profileData object with the numeric phone number
    const updatedProfileData = { ...profileData, number: phoneNumber };

    // Send updated profile data to the backend
    axiosInstance
      .post("/api/updateProfileData", updatedProfileData)
      .then((response) => {
        console.log(response.data); // Success message from the backend
        toast.success("Information Updated!");
      });
  };

  return (
    <div className="settings">
      <ToastContainer />
      <div className="settings__wrapper">
        <form>
          <div className="details__form">
            <h2 className="profile__title">Profile</h2>
            <p className="profile__desc">
              Update your photo and personal details here
            </p>

            <div className="form__group">
              <div>
                <label>Name</label>
                <input
                  required
                  type="text"
                  placeholder="Enter name"
                  value={profileData.name}
                  onChange={(e) =>
                    setProfileData({ ...profileData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Adharcard Number</label>
                <input
                  required
                  type="text"
                  placeholder="Enter Adharcard"
                  value={profileData.adharcard}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      adharcard: e.target.value,
                    })
                  }
                  maxLength={12}
                  minLength={12}
                />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Pancard Number</label>
                <input
                  required
                  type="text"
                  placeholder="Enter Pancard"
                  value={profileData.pancard}
                  onChange={(e) =>
                    setProfileData({ ...profileData, pancard: e.target.value })
                  }
                  maxLength={10}
                  minLength={10}
                />
              </div>
              <div>
                <label>License Number</label>
                <input
                  required
                  type="text"
                  placeholder="Enter license"
                  value={profileData.licenseno}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      licenseno: e.target.value,
                    })
                  }
                  maxLength={15}
                  minLength={15}
                />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Email</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={profileData.email}
                  onChange={(e) =>
                    setProfileData({ ...profileData, email: e.target.value })
                  }
                  disabled
                />
              </div>

              <div>
                <label>Phone Number</label>
                <input
                  required
                  type="text"
                  placeholder="Phone Number"
                  value={profileData.number}
                  onChange={(e) =>
                    setProfileData({ ...profileData, number: e.target.value })
                  }
                  maxLength={10}
                  minLength={10}
                />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Date of Birth</label>
                <input
                  required
                  type="date"
                  placeholder="dd/mm/yyyy"
                  value={profileData.dob}
                  onChange={(e) =>
                    setProfileData({ ...profileData, dob: e.target.value })
                  }
                />
              </div>

              <div>
                <label>Gender</label>
                <select
                  value={profileData.gender}
                  onChange={(e) =>
                    setProfileData({ ...profileData, gender: e.target.value })
                  }
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="form__group">
            <div>
                <label>Location</label>
                <input
                  required
                  type="text"
                  placeholder="Location"
                  value={profileData.location}
                  onChange={(e) =>
                    setProfileData({ ...profileData, location: e.target.value })
                  }
                />
              </div>
              <div className="profile__img-btns">
                <button
                  className="setting__btn active__btn"
                  onClick={handleUpdate}
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;