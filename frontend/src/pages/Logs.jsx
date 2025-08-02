import React, { useEffect, useState } from "react";
import axios from "axios";

function Logs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/logs")
      .then(res => setLogs(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="logs-page">
      <h2>Daily Logs</h2>
      {logs.length === 0 ? <p>No logs found.</p> : (
        <ul>
          {logs.map(log => (
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