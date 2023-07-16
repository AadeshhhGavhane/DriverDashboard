import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { InputBase, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge from "@mui/material/Badge";
import Box from "@mui/material/Box";
import profileImg from "../../assets/images/profile-02.png";
import "./top-nav.css";
import { useAuth0 } from "@auth0/auth0-react";

const TopNav = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    if (user) {
      setEmail(user?.email);
      setName(user?.name);
      console.log(email);
      console.log(name);
    }
  }, [user]);

  useEffect(() => {
    if (email && name) {
      sendUserData();
    }
  }, [email, name]);

  const sendUserData = async () => {
    const res = await fetch("http://localhost:5000/api/getmailname", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
      }),
    });
    console.log(res);
  };

  return (
    <div className="top__nav">
      <div className="top__nav-wrapper">
        <Box display="contents" justifyContent="space-between" p={10}>
          {/* SEARCH BAR */}
          <Box display="flex" bgcolor="white" borderRadius="7px">
            <InputBase sx={{ ml: 1, flex: 2 }} placeholder="Search" />
            <IconButton type="button" sx={{ p: 1.5 }}>
              <SearchIcon />
            </IconButton>
          </Box>
          {isAuthenticated ? (
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Log Out
            </button>
          ) : (
            <button onClick={() => loginWithRedirect()}>LogIn</button>
          )}

          <div className="top__nav-right">
            <div className="notification">
              <Badge badgeContent={99} color="secondary">
                <NotificationsIcon className="notification-icon" />
              </Badge>
            </div>
            <div className="profile">
              <Link to="/settings">
                <img src={profileImg} alt="" />
              </Link>
            </div>
          </div>
        </Box>
      </div>
    </div>
  );
};

export default TopNav;
