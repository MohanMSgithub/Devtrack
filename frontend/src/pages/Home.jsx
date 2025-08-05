import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../style.css"; // optional: create for styling

function Home() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const username = params.get("username");

    if (token && username) {
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
    }
  }, [location]);

  const username = localStorage.getItem("username");

  return (
    <div className="home-page">
      <h1>Welcome to DevTrack{username ? `, ${username}` : ""}</h1>
      <p>Your productivity dashboard to track learning, logs, notes, and tasks.</p>

      <div className="home-cards">
        <div className="card">
          <h3>Logs</h3>
          <p>Track your daily progress.</p>
        </div>
        <div className="card">
          <h3>Notes</h3>
          <p>Capture important learnings.</p>
        </div>
        <div className="card">
          <h3>Kanban</h3>
          <p>Organize tasks visually.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
