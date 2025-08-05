import React from "react";

function Login() {
  const handleGitHubLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/oauth2/authorization/github`; // Adjust for Render later
  };

  return (
    <div className="login-page">
      <h2>Login to DevTrack</h2>
      <button onClick={handleGitHubLogin}>Login with GitHub</button>
    </div>
  );
}

export default Login;