// src/pages/Dashboard.jsx

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import logService from "../services/logService";
import noteService from "../services/noteService";
import kanbanService from "../services/kanbanService";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [logs, setLogs] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const fetchedLogs = await logService.getLogs(token);
        const fetchedNotes = await noteService.getNotes(token);
        const fetchedTasks = await kanbanService.getTasks(token);

        setLogs(fetchedLogs);
        setNotes(fetchedNotes);
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchData();
  }, [token, navigate]);

  return (
    <div className="dashboard-container">
      <h2>Welcome back, {user?.username || "Developer"} 👋</h2>

      <div className="dashboard-section">
        <h3>Logs</h3>
        {logs.length > 0 ? (
          <ul>
            {logs.slice(0, 3).map((log, index) => (
              <li key={index}>{log.title}</li>
            ))}
          </ul>
        ) : (
          <p>No logs yet.</p>
        )}
      </div>

      <div className="dashboard-section">
        <h3>Notes</h3>
        {notes.length > 0 ? (
          <ul>
            {notes.slice(0, 3).map((note, index) => (
              <li key={index}>{note.title}</li>
            ))}
          </ul>
        ) : (
          <p>No notes yet.</p>
        )}
      </div>

      <div className="dashboard-section">
        <h3>Tasks</h3>
        {tasks.length > 0 ? (
          <ul>
            {tasks.slice(0, 3).map((task, index) => (
              <li key={index}>{task.title}</li>
            ))}
          </ul>
        ) : (
          <p>No tasks yet.</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
