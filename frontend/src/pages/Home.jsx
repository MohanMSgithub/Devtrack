import React, { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../style.css";
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';


/**
 * Home.jsx — DevTrack + GitHub Dashboard
 * - Auth-aware greeting
 * - Quick links (Logs, Notes, Kanban, Dashboard)
 * - Mini stats (mocked, easy to wire to /api later)
 * - Recent activity feed (mocked)
 * - Global search (mocked + GitHub events)
 * - Quick add modals (Log, Note, Kanban Card)
 * - Streak tracker + motivational tip
 * - GitHub profile card + recent events + quick links
 *
 * Wiring later:
 *   - swap mockFetch* with real axios/fetch calls to your backend
 */

function Home() {
  const navigate = useNavigate();
  const { user: ctxUser, token: ctxToken } = useContext(AuthContext);

  // --- Auth / identity
  const token = ctxToken || localStorage.getItem("token");
  const appUsername = (ctxUser?.username || localStorage.getItem("username") || "").trim();
  const githubUsername = appUsername || "octocat"; // fallback so the card always renders

  // --- DevTrack state (mocked)
  const [stats, setStats] = useState({ logsThisWeek: 0, notesCount: 0, kanban: { todo: 0, inProgress: 0, done: 0 } });
  const [recent, setRecent] = useState({
    logs: [],
    notes: [],
    kanban: [],
  });
  const [loadingDev, setLoadingDev] = useState(true);

  // --- GitHub state (live)
  const [ghProfile, setGhProfile] = useState(null);
  const [ghEvents, setGhEvents] = useState([]);
  const [loadingGitHub, setLoadingGitHub] = useState(true);
  const [ghError, setGhError] = useState("");

  // --- Search state
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState({ logs: [], notes: [], kanban: [], github: [] });

  // --- Quick-add modals
  const [openLogModal, setOpenLogModal] = useState(false);
  const [openNoteModal, setOpenNoteModal] = useState(false);
  const [openCardModal, setOpenCardModal] = useState(false);

  // quick-add inputs
  const [logForm, setLogForm] = useState({ date: new Date().toISOString().split("T")[0], learned: "", built: "", blocked: "" });
  const [noteForm, setNoteForm] = useState({ title: "", content: "" });
  const [cardForm, setCardForm] = useState({ column: "todo", title: "", description: "" });

  // --- Streak + tips
  const [streak, setStreak] = useState(0);

  const isLocal = window.location.hostname === "localhost";
  const baseUrl = isLocal
  ? "http://localhost:8080"
  : "https://devtracker-hg7n.onrender.com";

  
  const motivationalTips = useMemo(
    () => [
      "Small commits, big momentum.",
      "Ship something today — even if tiny.",
      "Learning logged is learning retained.",
      "Kanban is honest. Move the card.",
      "Ruthless focus beats random effort.",
      "Consistency compounds. Keep going.",
    ],
    []
  );
  const tip = useMemo(() => {
    const idx = Math.floor((Date.now() / 86400000) % motivationalTips.length);
    return motivationalTips[idx];
  }, [motivationalTips]);

  
  // -------------------------------
useEffect(() => {
  let mounted = true;

  (async () => {
    try {
      setLoadingDev(true);

       
      const [s, r] = await Promise.all([
        axios.get(`${baseUrl}/api/dashboard/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${baseUrl}/api/dashboard/recent`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!mounted) return;
      setStats(s.data);
      setRecent(r.data);

      // streak calculation
      const daysWithLogs = new Set(
        r.data.logs.map((l) => new Date(l.date).toDateString())
      );
      let streakCount = 0;
      let current = new Date();
      while (daysWithLogs.has(current.toDateString())) {
        streakCount++;
        current.setDate(current.getDate() - 1);
      }
      setStreak(streakCount);
    } catch (err) {
      console.error("Failed to load home data", err);
    } finally {
      if (mounted) setLoadingDev(false);
    }
  })();

  return () => {
    mounted = false;
  };
}, [baseUrl, token]);

const handleSearch = async (query) => {
  try {
    const resp = await axios.get(
      `${baseUrl}/api/search?q=${encodeURIComponent(query)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSearchResults(resp.data);
  } catch (err) {
    console.error("Search failed", err);
  }
};



  // -------------------------------
  // Load DevTrack mocks
  // -------------------------------
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoadingDev(true);
      const [s, r] = await Promise.all([
         axios.get(`${baseUrl}/api/dashboard/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        }),        
        axios.get(`${baseUrl}/api/dashboard/recent`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!mounted) return;
      setStats(s.data);
      setRecent(r);
      setLoadingDev(false);

      // naive streak calc: consecutive days with a log in the recent sample
      const daysWithLogs = new Set(r.logs.map((l) => new Date(l.date).toDateString()));
      let count = 0;
      for (let d = 0; d < 30; d++) {
        const day = new Date(Date.now() - d * 86400000).toDateString();
        if (daysWithLogs.has(day)) count++;
        else break;
      }
      setStreak(count);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // -------------------------------
  // Load GitHub profile + events
  // -------------------------------
  useEffect(() => {
    let mounted = true;
    setLoadingGitHub(true);
    setGhError("");

    const fetchGitHub = async () => {
      try {
        const [pRes, eRes] = await Promise.all([
          fetch(`https://api.github.com/users/${githubUsername}`),
          fetch(`https://api.github.com/users/${githubUsername}/events/public`),
        ]);
        if (!pRes.ok) throw new Error("Failed to load profile");
        if (!eRes.ok) throw new Error("Failed to load events");
        const profile = await pRes.json();
        const events = await eRes.json();
        if (!mounted) return;
        setGhProfile(profile);
        setGhEvents(Array.isArray(events) ? events.slice(0, 8) : []);
      } catch (err) {
        if (!mounted) return;
        setGhError("Could not fetch GitHub data. API rate-limited or username invalid.");
      } finally {
        if (mounted) setLoadingGitHub(false);
      }
    };

    fetchGitHub();
    return () => {
      mounted = false;
    };
  }, [githubUsername]);

  // -------------------------------
  // Quick add handlers (mocked)
  // -------------------------------
  const addLog = () => {
    const { learned, built, blocked } = logForm;
    if (!learned && !built && !blocked) return alert("Write something for the log.");
    const newLog = { id: Date.now(), date: new Date().toISOString(), ...logForm };
    setRecent((r) => ({ ...r, logs: [newLog, ...r.logs].slice(0, 10) }));
    setStats((s) => ({ ...s, logsThisWeek: s.logsThisWeek + 1 }));
    setOpenLogModal(false);
    setLogForm({ date: new Date().toISOString().split("T")[0], learned: "", built: "", blocked: "" });
  };

  const addNote = () => {
    if (!noteForm.title.trim() || !noteForm.content.trim()) return alert("Note title and content required.");
    const newNote = { id: Date.now(), title: noteForm.title.trim(), content: noteForm.content.trim() };
    setRecent((r) => ({ ...r, notes: [newNote, ...r.notes].slice(0, 10) }));
    setStats((s) => ({ ...s, notesCount: s.notesCount + 1 }));
    setOpenNoteModal(false);
    setNoteForm({ title: "", content: "" });
  };

  const addCard = () => {
    if (!cardForm.title.trim()) return alert("Card title required.");
    const newCard = {
      id: Date.now(),
      title: cardForm.title.trim(),
      description: cardForm.description.trim(),
      columnName: cardForm.column,
    };
    setRecent((r) => ({ ...r, kanban: [newCard, ...r.kanban].slice(0, 10) }));
    setStats((s) => {
      const next = { ...s.kanban };
      next[cardForm.column] = (next[cardForm.column] || 0) + 1;
      return { ...s, kanban: next };
    });
    setOpenCardModal(false);
    setCardForm({ column: "todo", title: "", description: "" });
  };

  // -------------------------------
  // Global search (mock + GitHub events)
  // -------------------------------
  const runSearch = async () => {
  if (!query.trim()) return;
  setSearchOpen(true);

  const res = await fetch(
    `${baseUrl}/api/dashboard/search?query=${encodeURIComponent(query)}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  const data = await res.json();

  const gh = ghEvents
    .map((e) => {
      const repo = e.repo?.name || "";
      const type = e.type || "";
      let text = `${type} in ${repo}`;
      if (e.payload?.commits?.length) {
        const msgs = e.payload.commits.map((c) => c.message || "").join(" • ");
        text += ` — ${msgs}`;
      }
      return { id: e.id, text, url: `https://github.com/${repo}`, type, repo };
    })
    .filter((x) => `${x.text} ${x.repo}`.toLowerCase().includes(query.toLowerCase()));

  setSearchResults({ ...data, github: gh });
};


  // -------------------------------
  // Guards
  // -------------------------------
  useEffect(() => {
    if (!token) {
      // still render Home for anonymous, but prompt via greeting CTA
      // navigate("/login"); // <- leave disabled to allow GitHub view even when logged out
    }
  }, [token, navigate]);

  // -------------------------------
  // UI helpers
  // -------------------------------
  const formatDate = (iso) =>
    new Date(iso).toLocaleString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const sectionCard = (children) => (
    <div
      className="home-card"
      style={{
        background: "#12151d",
        border: "1px solid #333",
        borderRadius: 10,
        padding: "1rem",
        boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
      }}
    >
      {children}
    </div>
  );

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="home-page" style={{ paddingTop: "4.5rem", paddingBottom: "2rem" }}>
      {/* Header */}
      <header style={{ marginBottom: "1.5rem" }}>
        <h1>
          Welcome to <span className="purple">DevTrack</span>
          {appUsername ? `, ${appUsername}` : ""}
        </h1>
        <p style={{ color: "#cbd5e1", marginTop: 8 }}>{tip}</p>
      </header>

      {/* Two-column responsive layout */}
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: "1rem",
        }}
      >
        {/* Desktop: 2 cols */}
        <style>
          {`
            @media (min-width: 1024px) {
              .home-grid-2 {
                display: grid;
                grid-template-columns: 1.35fr 1fr;
                gap: 1.2rem;
                align-items: start;
              }
            }
            .link-btn {
              padding: .6rem 1rem; border-radius: 8px; border: 1px solid #1f2937;
              background: #0f172a; color: #fff; cursor: pointer;
              transition: transform .1s ease, box-shadow .2s ease, background-color .2s ease;
            }
            .link-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 12px rgba(0,0,0,.25); background:#111827; }
            .mini-stat { background:#0f172a; border:1px solid #1f2937; border-radius:10px; padding:.9rem; }
            .stat-num { font-size:1.6rem; font-weight:700; color: var(--imp-text-color); }
            .muted { color:#9aa4b2; }
            .gh-card { background:#12151d; border:1px solid #333; border-radius:10px; padding:1rem; box-shadow:0 2px 10px rgba(0,0,0,.25); }
            .modal-backdrop { position:fixed; inset:0; background:rgba(0,0,0,.55); display:flex; align-items:center; justify-content:center; z-index:1000; }
            .modal { width: min(520px, 92vw); background:#0f172a; border:1px solid #1f2937; border-radius:12px; padding:1rem; }
            .modal h3 { margin-top:0; color: var(--imp-text-color); }
            .modal input, .modal textarea, .modal select { width:100%; background:#1f242d; color:#fff; border:1px solid #333; border-radius:8px; padding:.65rem; margin:.4rem 0 .7rem; }
            .modal .actions { display:flex; gap:.6rem; justify-content:flex-end; margin-top:.5rem; }
            .pill { display:inline-block; padding:.25rem .6rem; border-radius:999px; border:1px solid #2a3342; background:#121826; font-size:.8rem; color:#cbd5e1; }
            .badge { font-size:.75rem; padding:.2rem .45rem; border-radius:6px; background:#182036; border:1px solid #28324a; color:#bcd1ff; }
            .feed-item { padding:.6rem .4rem; border-bottom:1px solid #1f2937; }
            .feed-item:last-child { border-bottom: none; }
          `}
        </style>

        <div className="home-grid-2">
          {/* LEFT: DevTrack Hub */}
          <div style={{ display: "grid", gap: "1rem" }}>
            {/* Auth-aware + Streak */}
            {sectionCard(
              <div style={{ display: "grid", gap: ".75rem" }}>
                {!token && (
                  <div className="pill" style={{ justifySelf: "start" }}>
                    You’re not logged in — GitHub panel still works.
                  </div>
                )}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: ".8rem" }}>
                  <div className="mini-stat">
                    <div className="muted">Logs (this week)</div>
                    <div className="stat-num">{loadingDev ? "…" : stats.logsThisWeek}</div>
                  </div>
                  <div className="mini-stat">
                    <div className="muted">Notes</div>
                    <div className="stat-num">{loadingDev ? "…" : stats.notesCount}</div>
                  </div>
                  <div className="mini-stat">
                    <div className="muted">Kanban (Done)</div>
                    <div className="stat-num">{loadingDev ? "…" : stats.kanban.done}</div>
                  </div>
                  <div className="mini-stat">
                    <div className="muted">Streak</div>
                    <div className="stat-num">{streak}🔥</div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Links */}
            {sectionCard(
              <div>
                <h3 className="purple" style={{ marginTop: 0, marginBottom: ".6rem" }}>Quick Links</h3>
                <div className="home-cards">
                  <button className="link-btn" onClick={() => navigate("/logs")}>📘 Logs</button>
                  <button className="link-btn" onClick={() => navigate("/notes")}>🗒️ Notes</button>
                  <button className="link-btn" onClick={() => navigate("/kanban")}>🗂️ Kanban</button>
                  <button className="link-btn" onClick={() => navigate("/dashboard")}>📊 Dashboard</button>
                </div>
              </div>
            )}

            {/* Global Search */}
            {sectionCard(
              <div>
                <h3 className="purple" style={{ marginTop: 0 }}>Global Search</h3>
                <div style={{ display: "flex", gap: ".6rem" }}>
                  <input
                    placeholder="Search logs, notes, kanban, GitHub…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                      flex: 1,
                      padding: ".75rem 1rem",
                      background: "#1f242d",
                      color: "#fff",
                      borderRadius: 8,
                      border: "1px solid #333",
                    }}
                  />
                  <button className="link-btn" onClick={runSearch}>Search</button>
                </div>
              </div>
            )}

            {/* Recent Activity Feed */}
            {sectionCard(
              <div>
                <h3 className="purple" style={{ marginTop: 0, marginBottom: ".4rem" }}>Recent Updates</h3>
                {loadingDev ? (
                  <div className="muted">Loading…</div>
                ) : (
                  <div>
                    {/* Logs */}
                    <div className="feed-item">
                      <div className="badge">Logs</div>
                      {recent.logs.slice(0, 3).map((l) => (
                        <div key={l.id} style={{ marginTop: ".35rem" }}>
                          <strong>{formatDate(l.date)}:</strong>{" "}
                          <span className="muted">
                            {(l.learned || l.built || l.blocked || "").toString().slice(0, 80)}
                            {(l.learned || l.built || l.blocked || "").length > 80 ? "…" : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Notes */}
                    <div className="feed-item">
                      <div className="badge">Notes</div>
                      {recent.notes.slice(0, 3).map((n) => (
                        <div key={n.id} style={{ marginTop: ".35rem" }}>
                          <strong>{n.title}</strong>{" "}
                          <span className="muted">
                            {String(n.content || "").replace(/<[^>]*>/g, "").slice(0, 80)}
                            {String(n.content || "").length > 80 ? "…" : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                    {/* Kanban */}
                    <div className="feed-item">
                      <div className="badge">Kanban</div>
                      {recent.kanban.slice(0, 3).map((c) => (
                        <div key={c.id} style={{ marginTop: ".35rem" }}>
                          <strong>{c.title}</strong>{" "}
                          <span className="muted">→ {c.columnName}</span>
                          {c.description ? <span className="muted"> — {c.description.slice(0, 60)}{c.description.length > 60 ? "…" : ""}</span> : null}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div style={{ marginTop: ".6rem", display: "flex", gap: ".5rem", flexWrap: "wrap" }}>
                  <button className="link-btn" onClick={() => setOpenLogModal(true)}>➕ Quick Log</button>
                  <button className="link-btn" onClick={() => setOpenNoteModal(true)}>➕ Quick Note</button>
                  <button className="link-btn" onClick={() => setOpenCardModal(true)}>➕ Quick Card</button>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: GitHub Panel */}
          <div className="gh-card">
            <h3 className="purple" style={{ marginTop: 0 }}>GitHub</h3>

            {loadingGitHub ? (
              <div className="muted">Loading GitHub…</div>
            ) : ghError ? (
              <div className="muted">{ghError}</div>
            ) : (
              <>
                {/* Profile */}
                {ghProfile && (
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: ".8rem" }}>
                    <img
                      src={ghProfile.avatar_url}
                      alt="avatar"
                      width={64}
                      height={64}
                      style={{ borderRadius: "50%", border: "1px solid #1f2937" }}
                    />
                    <div>
                      <div style={{ fontWeight: 700 }}>
                        <a
                          href={ghProfile.html_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#fff", textDecoration: "none" }}
                        >
                          {ghProfile.login}
                        </a>
                      </div>
                      <div className="muted">{ghProfile.name || ""}</div>
                      <div style={{ display: "flex", gap: "12px", marginTop: ".25rem" }}>
                        <span className="pill">Repos: {ghProfile.public_repos}</span>
                        <span className="pill">Followers: {ghProfile.followers}</span>
                        <span className="pill">Following: {ghProfile.following}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick GH links */}
                <div style={{ display: "flex", gap: ".5rem", flexWrap: "wrap", marginBottom: ".8rem" }}>
                  <a className="link-btn" href={`https://github.com/${githubUsername}?tab=repositories`} target="_blank" rel="noreferrer">📦 Repos</a>
                  <a className="link-btn" href={`https://github.com/pulls?q=is%3Apr+author%3A${githubUsername}`} target="_blank" rel="noreferrer">🔀 My PRs</a>
                  <a className="link-btn" href={`https://github.com/issues?q=author%3A${githubUsername}`} target="_blank" rel="noreferrer">🐞 My Issues</a>
                  <a className="link-btn" href={`https://github.com/${githubUsername}?tab=stars`} target="_blank" rel="noreferrer">⭐ Stars</a>
                </div>

                {/* Events */}
                <div>
                  <div className="badge">Recent Activity</div>
                  <div style={{ marginTop: ".5rem" }}>
                    {ghEvents.length === 0 ? (
                      <div className="muted">No recent public events.</div>
                    ) : (
                      ghEvents.map((e) => {
                        const repo = e.repo?.name || "unknown";
                        const type = e.type || "Event";
                        const time = new Date(e.created_at).toLocaleString("en-IN", { hour12: false });
                        let summary = type;
                        if (e.payload?.commits?.length) {
                          summary += ` — ${e.payload.commits.map((c) => c.message).filter(Boolean).slice(0, 2).join(" • ")}`;
                        } else if (e.payload?.action) {
                          summary += ` — ${e.payload.action}`;
                        }
                        return (
                          <div key={e.id} style={{ padding: ".5rem 0", borderBottom: "1px solid #1f2937" }}>
                            <div style={{ fontWeight: 600 }}>
                              <a href={`https://github.com/${repo}`} target="_blank" rel="noreferrer" style={{ color: "#fff", textDecoration: "none" }}>
                                {repo}
                              </a>
                            </div>
                            <div className="muted">{summary}</div>
                            <div className="muted" style={{ fontSize: ".8rem" }}>{time}</div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Search Results Modal */}
      {searchOpen && (
        <div className="modal-backdrop" onClick={() => setSearchOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Search Results</h3>
            {!query ? (
              <div className="muted">Type something to search.</div>
            ) : (
              <div style={{ display: "grid", gap: ".75rem" }}>
                <div>
                  <div className="badge">Logs</div>
                  {searchResults.logs.length === 0 ? (
                    <div className="muted">No matches</div>
                  ) : (
                    searchResults.logs.map((l) => (
                      <div key={l.id} style={{ padding: ".3rem 0", borderBottom: "1px solid #1f2937" }}>
                        <strong>{formatDate(l.date)}</strong>{" "}
                        <span className="muted">
                          {(l.learned || l.built || l.blocked || "").slice(0, 120)}
                          {(l.learned || l.built || l.blocked || "").length > 120 ? "…" : ""}
                        </span>
                      </div>
                    ))
                  )}
                </div>
                <div>
                  <div className="badge">Notes</div>
                  {searchResults.notes.length === 0 ? (
                    <div className="muted">No matches</div>
                  ) : (
                    searchResults.notes.map((n) => (
                      <div key={n.id} style={{ padding: ".3rem 0", borderBottom: "1px solid #1f2937" }}>
                        <strong>{n.title}</strong>{" "}
                        <span className="muted">{String(n.content || "").replace(/<[^>]*>/g, "").slice(0, 120)}{String(n.content || "").length > 120 ? "…" : ""}</span>
                      </div>
                    ))
                  )}
                </div>
                <div>
                  <div className="badge">Kanban</div>
                  {searchResults.kanban.length === 0 ? (
                    <div className="muted">No matches</div>
                  ) : (
                    searchResults.kanban.map((c) => (
                      <div key={c.id} style={{ padding: ".3rem 0", borderBottom: "1px solid #1f2937" }}>
                        <strong>{c.title}</strong>{" "}
                        <span className="muted">→ {c.columnName}</span>{" "}
                        {c.description ? <span className="muted">— {c.description.slice(0, 100)}{c.description.length > 100 ? "…" : ""}</span> : null}
                      </div>
                    ))
                  )}
                </div>
                <div>
                  <div className="badge">GitHub</div>
                  {searchResults.github.length === 0 ? (
                    <div className="muted">No matches</div>
                  ) : (
                    searchResults.github.map((g) => (
                      <div key={g.id} style={{ padding: ".3rem 0", borderBottom: "1px solid #1f2937" }}>
                        <a href={g.url} target="_blank" rel="noreferrer" style={{ color: "#fff", textDecoration: "none", fontWeight: 600 }}>
                          {g.repo}
                        </a>
                        <div className="muted" style={{ fontSize: ".9rem" }}>{g.text}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            <div className="actions">
              <button className="link-btn" onClick={() => setSearchOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add: Log */}
      {openLogModal && (
        <div className="modal-backdrop" onClick={() => setOpenLogModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Quick Log</h3>
            <label>Date</label>
            <input type="date" value={logForm.date} onChange={(e) => setLogForm((s) => ({ ...s, date: e.target.value }))} />
            <label>Learned</label>
            <textarea rows={3} value={logForm.learned} onChange={(e) => setLogForm((s) => ({ ...s, learned: e.target.value }))} />
            <label>Built</label>
            <textarea rows={3} value={logForm.built} onChange={(e) => setLogForm((s) => ({ ...s, built: e.target.value }))} />
            <label>Blocked</label>
            <textarea rows={3} value={logForm.blocked} onChange={(e) => setLogForm((s) => ({ ...s, blocked: e.target.value }))} />
            <div className="actions">
              <button className="link-btn" onClick={() => setOpenLogModal(false)}>Cancel</button>
              <button className="link-btn" onClick={addLog}>Add Log</button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add: Note */}
      {openNoteModal && (
        <div className="modal-backdrop" onClick={() => setOpenNoteModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Quick Note</h3>
            <label>Title</label>
            <input value={noteForm.title} onChange={(e) => setNoteForm((s) => ({ ...s, title: e.target.value }))} />
            <label>Content</label>
            <textarea rows={6} value={noteForm.content} onChange={(e) => setNoteForm((s) => ({ ...s, content: e.target.value }))} />
            <div className="actions">
              <button className="link-btn" onClick={() => setOpenNoteModal(false)}>Cancel</button>
              <button className="link-btn" onClick={addNote}>Add Note</button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Add: Kanban Card */}
      {openCardModal && (
        <div className="modal-backdrop" onClick={() => setOpenCardModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Quick Kanban Card</h3>
            <label>Column</label>
            <select value={cardForm.column} onChange={(e) => setCardForm((s) => ({ ...s, column: e.target.value }))}>
              <option value="todo">To Do</option>
              <option value="inProgress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <label>Title</label>
            <input value={cardForm.title} onChange={(e) => setCardForm((s) => ({ ...s, title: e.target.value }))} />
            <label>Description</label>
            <textarea rows={5} value={cardForm.description} onChange={(e) => setCardForm((s) => ({ ...s, description: e.target.value }))} />
            <div className="actions">
              <button className="link-btn" onClick={() => setOpenCardModal(false)}>Cancel</button>
              <button className="link-btn" onClick={addCard}>Add Card</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
