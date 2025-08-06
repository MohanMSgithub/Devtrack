import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Logs() {
  const [logs, setLogs] = useState([]);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login"); // No token? Redirect to login
      return;
    }

    axios
      .get("http://localhost:8080/api/logs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setLogs(res.data))
      .catch((err) => {
        console.error("Error fetching logs:", err);
        if (err.response?.status === 401) {
          navigate("/login"); // Token expired or invalid
        }
      });
  }, [token, navigate]);

  return (
    <div className="logs-page">
      <h2>Daily Logs</h2>
      {logs.length === 0 ? (
        <p>No logs found.</p>
      ) : (
        <ul>
          {logs.map((log) => (
            <li key={log.id}>
              <strong>{log.date}:</strong> Learned - {log.learned}, Built - {log.built}, Blocked - {log.blocked}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Logs;
