import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchNotes();
  }, [token]);

  const fetchNotes = () => {
    axios
      .get("http://localhost:8080/api/notes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setNotes(res.data))
      .catch((err) => {
        console.error("Error fetching notes:", err);
        if (err.response?.status === 401) navigate("/login");
      });
  };

  const handleAddNote = () => {
    if (!title || !content) return;

    axios
      .post(
        "http://localhost:8080/api/notes",
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        setTitle("");
        setContent("");
        fetchNotes(); // refresh notes list
      })
      .catch((err) => console.error("Error adding note:", err));
  };

  return (
    <div className="notes-page">
      <h2>My Notes</h2>

      <div className="add-note">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={handleAddNote}>Add Note</button>
      </div>

      {notes.length === 0 ? (
        <p>No notes available.</p>
      ) : (
        <ul>
          {notes.map((note, index) => (
            <li key={index}>
              <strong>{note.title}:</strong> {note.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notes;
