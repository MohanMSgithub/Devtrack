import React from "react";

function LoginButton() {
  const handleLogin = () => {
        const isLocal = window.location.hostname === "localhost";
    const baseUrl = isLocal
      ? "http://localhost:8080"
      : "https://devtracker-hg7n.onrender.com";

    window.location.href = `${baseUrl}/oauth2/authorization/github`;
  };

  return (
    
    <button type="button" className="btn btn-dark" onClick={handleLogin}>Login with GitHub</button>

  );
}

export default LoginButton;