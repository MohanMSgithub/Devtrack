// src/components/AuthHandler.jsx
import { useEffect, useContext } from "react";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function AuthHandler() {
  const location = useLocation();
  const { login } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const username = params.get("username");

    if (token && username) {
      login(token, { username });
      window.history.replaceState({}, document.title, "/");
    }
  }, [location.search]);

  return null;
}

export default AuthHandler;
