import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
 
import { TextStyle } from "@tiptap/extension-text-style";
import { Highlight } from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import { MdFormatColorFill, MdFormatColorText, MdFormatSize } from "react-icons/md";
 

import "../style.css";

function Notes() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState([]);
  const [bgColor, setBgColor] = useState(localStorage.getItem("bgColor") || "#ffffff");
  const [textColor, setTextColor] = useState(localStorage.getItem("textColor") || "#000000");
  const [fontSize, setFontSize] = useState(localStorage.getItem("fontSize") || "16");

  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Highlight,
      Color,
      
    ],
    content: "",
  });

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
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
       
      setNotes(res.data);
    })
    .catch((err) => console.error("Error fetching notes:", err));
};


  const handleAddNote = () => {
    if (!title.trim() || !editor?.getHTML().trim()) return;

    axios
      .post(
        "http://localhost:8080/api/notes",
        { title, content: editor.getHTML() },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setTitle("");
        editor.commands.setContent("");
        fetchNotes();
      })
      .catch((err) => console.error("Error adding note:", err));
  };

  const handleDeleteNote = (id) => {
    if (!window.confirm("Delete this note?")) return;

    axios
      .delete(`http://localhost:8080/api/notes/${id}`,`https://devtracker-hg7n.onrender.com/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => setNotes(notes.filter((n) => n.id !== id)))
      .catch((err) => console.error("Error deleting:", err));
  };

  // Save local preferences
  useEffect(() => {
    localStorage.setItem("bgColor", bgColor);
    localStorage.setItem("textColor", textColor);
    localStorage.setItem("fontSize", fontSize);
  }, [bgColor, textColor, fontSize]);

  return (
    <div className="notes-container">
      <h2>My Notes</h2>

      <div className="note-form">
        

        <div className="options">
          <div className="option-group">
            <label>
              <MdFormatColorFill style={{ marginRight: "5px" }} />
               
            </label>
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
          </div>

          <div className="option-group">
            <label>
              <MdFormatColorText style={{ marginRight: "5px" }} />
              
            </label>
            <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} />
          </div>

          <div className="option-group">
            <label>
              <MdFormatSize style={{ marginRight: "5px" }} />
              
            </label>
            <input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
              min="10"
              max="36"
            />
          </div>
        </div>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <EditorContent
          editor={editor}
          style={{
            backgroundColor: bgColor,
            color: textColor,
            fontSize: `${fontSize}px`,
            border: "1px solid #ccc",
            padding: "10px",
            minHeight: "100px",
          }}
        />

        

        <button onClick={handleAddNote}>Add Note</button>
      </div>

      <div className="note-list">
        {notes.map((note) => (
            <div
              key={note.id}
              className="note-card"
              style={{
                backgroundColor: bgColor,
                color: textColor,
                fontSize: `${fontSize}px`,
              }}
            >
               
              <button className="delete-btn" onClick={() => handleDeleteNote(note.id)}>
                ×
              </button>
              <h3>{note.title}</h3>
              <div dangerouslySetInnerHTML={{ __html: note.content }} />
            </div>
          ))}

      </div>
    </div>
  );
}

export default Notes;
