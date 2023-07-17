import React from "react";
import ReactDOM from "react-dom/client";
import "remixicon/fonts/remixicon.css";
import "react-circular-progressbar/dist/styles.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Auth0Provider
    domain="dev-8q6tpd74odwrwxwc.us.auth0.com"
    clientId="JGUqWukHp6owr3gEWEmgcaEv7Ditq8ij"
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
    useRefreshTokens
    cacheLocation="localstorage"
  >
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  </Auth0Provider>
);
