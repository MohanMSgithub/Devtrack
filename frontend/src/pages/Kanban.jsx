import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../style.css";

const columnOrder = ["todo", "inProgress", "done"];
const columnTitles = {
  todo: "To Do",
  inProgress: "In Progress",
  done: "Done",
};

function Kanban() {
  const { token, user } = useContext(AuthContext);
  
  const navigate = useNavigate();
  const username = user?.username || localStorage.getItem("username");


  const [columns, setColumns] = useState({
    todo: [],
    inProgress: [],
    done: [],
  });
  const [loading, setLoading] = useState(true);
  const [newCard, setNewCard] = useState({ column: "todo", title: "", description: "" });
  const [editing, setEditing] = useState({ id: null, title: "", description: "" });

  // baseUrl logic same as your Notes component
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
    console.error("Username missing, cannot fetch kanban cards");
    return;
  }
    fetchCards(username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, username]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseUrl}/api/kanban/${username}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Normalize into our columns (server returns array of KanbanCard)
      const grouped = { todo: [], inProgress: [], done: [] };
      res.data.forEach((c) => {
        // protective: server uses columnName on model
        const col = c.columnName || c.column || "todo";
        if (!grouped[col]) grouped[col] = [];
        grouped[col].push(c);
      });
      setColumns(grouped);
    } catch (err) {
      console.error("Error fetching kanban cards:", err);
      // optional: show toast / redirect on auth errors
    } finally {
      setLoading(false);
    }
  };

  // Drag & drop handlers
  const handleDragStart = (e, cardId, fromColumn) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ cardId, fromColumn }));
    // set dragging style
    e.currentTarget.classList.add("dragging");
  };
  const handleDragEnd = (e) => {
    e.currentTarget.classList.remove("dragging");
  };
  const handleDrop = async (e, toColumn) => {
    e.preventDefault();
    const payload = e.dataTransfer.getData("text/plain");
    if (!payload) return;
    const { cardId, fromColumn } = JSON.parse(payload);
    if (!cardId) return;
    if (fromColumn === toColumn) return;

    // optimistic UI: move locally first
    const card = columns[fromColumn].find((c) => String(c.id) === String(cardId));
    if (!card) return;

    setColumns((prev) => {
      const src = prev[fromColumn].filter((c) => String(c.id) !== String(cardId));
      const dst = [...prev[toColumn], { ...card, columnName: toColumn }];
      return { ...prev, [fromColumn]: src, [toColumn]: dst };
    });

    try {
      await axios.put(
        `${baseUrl}/api/kanban/${username}/${cardId}`,
        { columnName: toColumn },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // optionally re-fetch to ensure server-state
      // await fetchCards();
    } catch (err) {
      console.error("Error moving card:", err);
      // rollback on failure
      fetchCards();
    }
  };

  const handleAddCard = async () => {
    if (!newCard.title.trim()) return alert("Provide a title.");
    try {
      const payload = {
        columnName: newCard.column,
        title: newCard.title,
        description: newCard.description,
      };
      const res = await axios.post(`${baseUrl}/api/kanban/${username}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // append to UI
      setColumns((prev) => ({ ...prev, [newCard.column]: [...prev[newCard.column], res.data] }));
      setNewCard({ column: "todo", title: "", description: "" });
    } catch (err) {
      console.error("Error adding card:", err);
      alert("Failed to add card.");
    }
  };

  const handleDeleteCard = async (id, column) => {
    if (!window.confirm("Delete this card?")) return;
    try {
      await axios.delete(`${baseUrl}/api/kanban/${username}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setColumns((prev) => ({ ...prev, [column]: prev[column].filter((c) => c.id !== id) }));
    } catch (err) {
      console.error("Error deleting card:", err);
      alert("Delete failed.");
    }
  };

  // Inline edit: double click to start
  const startEditing = (card) => {
    setEditing({ id: card.id, title: card.title || "", description: card.description || "" });
  };
  const cancelEditing = () => setEditing({ id: null, title: "", description: "" });
  const saveEditing = async (card) => {
    if (!editing.title.trim()) return alert("Title cannot be empty.");
    try {
      const body = { title: editing.title, description: editing.description };
      await axios.put(`${baseUrl}/api/kanban/${username}/${card.id}`, body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // update local state
      setColumns((prev) => {
        const newCols = { ...prev };
        for (const k of Object.keys(newCols)) {
          newCols[k] = newCols[k].map((c) => (c.id === card.id ? { ...c, ...body } : c));
        }
        return newCols;
      });
      cancelEditing();
    } catch (err) {
      console.error("Error saving card:", err);
      alert("Save failed.");
    }
  };

  if (loading) return <div className="kanban-page"><h2>Kanban Board</h2><p>Loading...</p></div>;

  return (
    <div className="kanban-page">
      <h2>Kanban Board</h2>

      <div className="kanban-actions">
        <select
          value={newCard.column}
          onChange={(e) => setNewCard((s) => ({ ...s, column: e.target.value }))}
        >
          <option value="todo">To Do</option>
          <option value="inProgress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <input
          placeholder="Card title"
          value={newCard.title}
          onChange={(e) => setNewCard((s) => ({ ...s, title: e.target.value }))}
        />
        <input
          placeholder="Short description (optional)"
          value={newCard.description}
          onChange={(e) => setNewCard((s) => ({ ...s, description: e.target.value }))}
        />
        <button onClick={handleAddCard}>Add</button>
        <button onClick={fetchCards} className="secondary">Refresh</button>
      </div>

      <div className="kanban-board">
        {columnOrder.map((colKey) => (
          <div
            key={colKey}
            className="kanban-column"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, colKey)}
          >
            <h3>{columnTitles[colKey]}</h3>
            <div className="column-inner">
              {columns[colKey].map((card) => (
                <div
                  key={card.id}
                  className="kanban-card"
                  draggable
                  onDragStart={(e) => handleDragStart(e, card.id, colKey)}
                  onDragEnd={handleDragEnd}
                  onDoubleClick={() => startEditing(card)}
                >
                  {editing.id === card.id ? (
                    <div className="edit-area">
                      <input
                        value={editing.title}
                        onChange={(e) => setEditing((s) => ({ ...s, title: e.target.value }))}
                      />
                      <textarea
                        value={editing.description}
                        onChange={(e) => setEditing((s) => ({ ...s, description: e.target.value }))}
                      />
                      <div className="edit-actions">
                        <button onClick={() => saveEditing(card)}>Save</button>
                        <button onClick={cancelEditing} className="secondary">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="card-header">
                        <strong className="card-title">{card.title}</strong>
                        <div className="card-controls">
                          <button
                            title="Edit"
                            onClick={() => startEditing(card)}
                            className="icon-btn"
                          >
                            ✎
                          </button>
                          <button
                            title="Delete"
                            onClick={() => handleDeleteCard(card.id, colKey)}
                            className="icon-btn danger"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                      {card.description && <div className="card-desc">{card.description}</div>}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Kanban;
