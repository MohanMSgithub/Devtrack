import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { MdFormatColorText, MdFormatSize, MdFormatUnderlined, MdDelete } from "react-icons/md";
import "../style.css";

function Notes() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);

  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState("16");
  const [underline, setUnderline] = useState(false);

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  // Choose base URL depending on environment
  const baseUrl =
    window.location.hostname === "localhost"
      ? "http://localhost:8080"
      : "https://devtracker-hg7n.onrender.com";

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchNotes();
  }, [token]);

  const fetchNotes = () => {
    axios
      .get(`${baseUrl}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setNotes(res.data))
      .catch((err) => console.error("Error fetching notes:", err));
  };

  const handleAddNote = () => {
    if (!title.trim() || !content.trim()) return;

    axios
      .post(
        `${baseUrl}/api/notes`,
        { title, content },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setTitle("");
        setContent("");
        fetchNotes();
      })
      .catch((err) => console.error("Error adding note:", err));
  };

  const handleDeleteNote = (id) => {
    if (!window.confirm("Delete this note?")) return;

    axios
      .delete(`${baseUrl}/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setNotes(notes.filter((n) => n.id !== id)))
      .catch((err) => console.error("Error deleting:", err));
  };

  return (
    <div className="notes-container">
      <br/>
      <br/>
      <h2>My Notes</h2>

      {/* Note Creation */}
      {/* Note Creation */}
<div className="note-card">
        <div className="note-toolbar">
          {/* Color picker with 7 fixed colors */}
          <select
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
          >
            <option value="" disabled>Color</option>
            <option value="#000000" style={{ color: "#000000" }}>Black</option>
            <option value="#FF0000" style={{ color: "#FF0000" }}>Red</option>
            <option value="#007BFF" style={{ color: "#007BFF" }}>Blue</option>
            <option value="#28A745" style={{ color: "#28A745" }}>Green</option>
            <option value="#FFC107" style={{ color: "#FFC107" }}>Yellow</option>
            <option value="#6F42C1" style={{ color: "#6F42C1" }}>Purple</option>
            <option value="#FF7F50" style={{ color: "#FF7F50" }}>Coral</option>
          </select>

          {/* Font size input */}
          <label>
            <MdFormatSize />
            <input
              type="number"
              min="10"
              max="36"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              className="font-size-input"
            />
          </label>

          {/* Underline toggle */}
          <button
            onClick={() => setUnderline(!underline)}
            className={underline ? "active" : ""}
          >
            <MdFormatUnderlined />
          </button>
        </div>

        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="note-title"
        />

        {/* Content */}
        <textarea
          placeholder="Write your note..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            color: textColor,
            fontSize: `${fontSize}px`,
            textDecoration: underline ? "underline" : "none",
          }}
        />

        <button onClick={handleAddNote}>Add Note</button>
      </div>


      {/* Notes List */}
      <div className="note-list">
        {notes.map((note) => (
          <div key={note.id} className="note-card">
           <div className="note-toolbar">
                  <button onClick={() => editor.chain().focus().toggleBold().run()}><b>B</b></button>
                  <button onClick={() => editor.chain().focus().toggleItalic().run()}><i>I</i></button>
                  <button onClick={() => editor.chain().focus().toggleUnderline().run()}>U</button>
                  <button onClick={() => editor.chain().focus().toggleStrike().run()}>ab</button>
                  <button onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>

                  {/* Color picker */}
                  <select
                    onChange={(e) =>
                      editor.chain().focus().setColor(e.target.value).run()
                    }
                    defaultValue=""
                  >
                    <option value="" disabled>Color</option>
                    <option value="#000000" style={{ color: "#000000" }}>Black</option>
                    <option value="#FF0000" style={{ color: "#FF0000" }}>Red</option>
                    <option value="#007BFF" style={{ color: "#007BFF" }}>Blue</option>
                    <option value="#28A745" style={{ color: "#28A745" }}>Green</option>
                    <option value="#FFC107" style={{ color: "#FFC107" }}>Yellow</option>
                    <option value="#6F42C1" style={{ color: "#6F42C1" }}>Purple</option>
                    <option value="#FF7F50" style={{ color: "#FF7F50" }}>Coral</option>
                  </select>

                {/* Delete note button */}
                <button className="delete-btn" onClick={() => handleDeleteNote(note.id)}>✕</button>
              </div>

            <h3>{note.title}</h3>
            <div dangerouslySetInnerHTML={{ __html: note.content }} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notes;
