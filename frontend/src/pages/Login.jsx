import React from "react";
import LoginButton from "../components/LoginButton"; 

function Login() {
  return (
    <div className="login-page text-center mt-5">
      <h2>Login to DevTrack</h2>
      <p className="mb-4">Use your GitHub account to continue</p>
      <LoginButton />
    </div>
  );
}

export default Login;
