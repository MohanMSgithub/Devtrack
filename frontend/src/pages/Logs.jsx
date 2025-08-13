import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import "../style.css";

function Logs() {
  const [logs, setLogs] = useState([]);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [learned, setLearned] = useState("");
  const [built, setBuilt] = useState("");
  const [blocked, setBlocked] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  const isLocal = window.location.hostname === "localhost";
        const baseUrl = isLocal
    ? "http://localhost:8080"
    : "https://devtracker-hg7n.onrender.com";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchLogs();
  }, [token]);

  const fetchLogs = () => {
        
    axios
      .get(`${baseUrl}/api/logs`,{
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLogs(res.data))
      .catch((err) => {
        console.error("Error fetching logs:", err);
        if (err.response?.status === 401) navigate("/login");
      });
  };

  const handleAddLog = () => {
    if (!learned.trim() && !built.trim() && !blocked.trim()) {
      alert("Please fill at least one field.");
      return;
    }

    axios
      .post(
        `${baseUrl}/api/logs`,
        { date, learned, built, blocked },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        setLearned("");
        setBuilt("");
        setBlocked("");
        fetchLogs();
      })
      .catch((err) => {
        console.error("Error adding log:", err);
        alert("Failed to add log.");
      });
  };

  return (
    <div className="logs-container">
      <h2>📘 Daily Dev Logs</h2>

      <div className="log-form">
        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <textarea
          placeholder="What did you learn today?"
          value={learned}
          onChange={(e) => setLearned(e.target.value)}
        />
        <textarea
          placeholder="What did you build?"
          value={built}
          onChange={(e) => setBuilt(e.target.value)}
        />
        <textarea
          placeholder="Where did you get stuck?"
          value={blocked}
          onChange={(e) => setBlocked(e.target.value)}
        />

        <button onClick={handleAddLog}>➕ Add Log</button>
      </div>

      {logs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <div className="log-cards">
          {logs.map((log) => (
            <div className="log-card" key={log.id}>
              <div className="log-date">
                {new Date(log.date).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="log-section"><strong>Learned:</strong> {log.learned}</div>
              <div className="log-section"><strong>Built:</strong> {log.built}</div>
              <div className="log-section"><strong>Blocked:</strong> {log.blocked}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Logs;
