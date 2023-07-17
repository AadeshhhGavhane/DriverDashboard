import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/settings.css";
import { useAuth0 } from "@auth0/auth0-react";

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

  const handleUpdate = () => {
    // Convert phone number to a number (if needed)
    const phoneNumber = parseInt(profileData.number, 10);

    // Update the profileData object with the numeric phone number
    const updatedProfileData = { ...profileData, number: phoneNumber };

    // Send updated profile data to the backend
    axiosInstance
      .post("/api/updateProfileData", updatedProfileData)
      .then((response) => {
        console.log(response.data); // Success message from the backend
      });
  };

  return (
    <div className="settings">
      <div className="settings__wrapper">
        <h2 className="settings__title">Settings</h2>

        <div className="settings__top">
          <button className="setting__btn active__btn">Profile</button>
        </div>

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
                />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Pancard Number</label>
                <input
                  type="text"
                  placeholder="Enter Pancard"
                  value={profileData.pancard}
                  onChange={(e) =>
                    setProfileData({ ...profileData, pancard: e.target.value })
                  }
                  maxLength={10}
                />
              </div>
              <div>
                <label>License Number</label>
                <input
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
                  type="text"
                  placeholder="Phone Number"
                  value={profileData.number}
                  onChange={(e) =>
                    setProfileData({ ...profileData, number: e.target.value })
                  }
                  maxLength={10}
                />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Date of Birth</label>
                <input
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
                <label>Your Photo</label>
                <p className="profile-img__desc">
                  This will be displayed in your profile
                </p>
                <input type="file" placeholder="choose file" />
              </div>

              <div className="profile__img-btns">
                <button className="dlt__btn">Delete</button>
                <button className="update__btn" onClick={handleUpdate}>
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
