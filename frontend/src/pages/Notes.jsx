import React, { useEffect, useState } from "react";
import axios from "axios";

function Notes() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8080/api/notes")
      .then(res => setNotes(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="notes-page">
      <h2>My Notes</h2>
      {notes.length === 0 ? <p>No notes available.</p> : (
        <ul>
          {notes.map(note => (
            <li key={note.id}>
              <strong>{note.title}:</strong> {note.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Notes;