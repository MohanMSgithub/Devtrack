import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../style.css";

function Home() {
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const username = user?.username || localStorage.getItem("username");

  const [stats, setStats] = useState({ logs: 0, notes: 0, cards: 0, streak: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [githubEvents, setGithubEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:8080"
      : "https://devtracker-hg7n.onrender.com";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    if (!username) {
      console.error("Username missing, cannot fetch home data");
      return;
    }
    fetchHomeData(username);
    fetchGithubEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, username]);

 const fetchHomeData = async (username) => {
  setLoading(true);
  try {
    const res = await axios.get(`${baseUrl}/api/home/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setStats({
      logs: res.data.logsCount,
      notes: res.data.notesCount,
      cards: res.data.cardsCount,
      streak: res.data.streak,
    });

    setRecentActivity(res.data.recentActivity.slice(0, 5));
  } catch (err) {
    console.error("Error fetching home data:", err);
  } finally {
    setLoading(false);
  }
};


  const fetchGithubEvents = async () => {
    try {
      const res = await axios.get("https://api.github.com/users/octocat/events/public");
      setGithubEvents(res.data.slice(0, 5));
    } catch (err) {
      console.error("Error fetching GitHub events:", err);
    }
  };

  if (loading) return <div className="home-page"><h2>Home</h2><p>Loading...</p></div>;

  return (
    <div className="home-page">
      <h2>Welcome back, {username}! 👋</h2>

      {/* Quick links */}
      <div className="quick-links">
        <button onClick={() => navigate("/logs")}>Logs ({stats.logs})</button>
        <button onClick={() => navigate("/notes")}>Notes ({stats.notes})</button>
        <button onClick={() => navigate("/kanban")}>Kanban ({stats.cards})</button>
         
      </div>

      {/* Stats */}
      <div className="mini-stats">
        <div className="stat">Logs: <strong>{stats.logs}</strong></div>
        <div className="stat">Notes: <strong>{stats.notes}</strong></div>
        <div className="stat">Cards: <strong>{stats.cards}</strong></div>
        <div className="stat">Streak: <strong>{stats.streak} days</strong></div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>Recent Activity</h3>
        {recentActivity.length === 0 && <p>No recent activity yet.</p>}
        <ul>
          {recentActivity.map((a, i) => (
            <li key={i}>
              <strong>{a.type}:</strong> {a.content} <em>({a.date})</em>
            </li>
          ))}
        </ul>
      </div>

      {/* GitHub */}
      <div className="github-section">
        <h3>GitHub (octocat)</h3>
        <ul>
          {githubEvents.map((e, i) => (
            <li key={i}>
              {e.type} - {e.repo?.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
