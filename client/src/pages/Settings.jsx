import React from "react";
import "../styles/settings.css";

const Settings = () => {
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
            <p className="profile__desc">Update your photo and personal details here</p>

            <div className="form__group">
              <div>
                <label>Name</label>
                <input type="text" placeholder="Enter name" />
              </div>

              <div>
                <label>Adharcard Number</label>
                <input type="text" placeholder="Enter Adharcard" />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Pancard Number</label>
                <input type="text" placeholder="Enter Pancard" />
              </div>
              <div>
                <label>License Number</label>
                <input type="text" placeholder="Enter license" />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Email</label>
                <input type="email" placeholder="example@gmail.com" />
              </div>

              <div>
                <label>Phone Number</label>
                <input type="number" placeholder="+880 17*******" />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Date of Birth</label>
                <input type="date" placeholder="dd/mm/yyyy" />
              </div>

              <div>
                <label>Gender</label>
                <input type="text" placeholder="Male" />
              </div>
            </div>

            <div className="form__group">
              <div>
                <label>Your Photo</label>
                <p className="profile-img__desc">This will be displayed in your profile</p>
                <input type="file" placeholder="choose file" />
              </div>

              <div className="profile__img-btns">
                <button className="dlt__btn">Delete</button>
                <button className="update__btn">Update</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
