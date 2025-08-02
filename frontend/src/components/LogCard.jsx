import React from "react";

function LogCard({ log }) {
  return (
    <div className="log-card">
      <h5>{log.date}</h5>
      <p><strong>Learned:</strong> {log.learned}</p>
      <p><strong>Built:</strong> {log.built}</p>
      <p><strong>Blocked:</strong> {log.blocked}</p>
    </div>
  );
}

export default LogCard;