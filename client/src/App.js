import "./App.css";
import Layout from "./components/Layout/Layout";
import { useAuth0 } from "@auth0/auth0-react";
import LoginToContinue from "./pages/LoginToContinue";

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();

  return isAuthenticated ? <Layout /> : <LoginToContinue />;
}

export default App;
