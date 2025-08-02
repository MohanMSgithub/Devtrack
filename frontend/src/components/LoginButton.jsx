import React from "react";

function LoginButton() {
  const handleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/github";
  };

  return (
    <button className="btn btn-dark" onClick={handleLogin}>
      Login with GitHub
    </button>
  );
}

export default LoginButton;