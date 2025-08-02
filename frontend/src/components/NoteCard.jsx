 import React from "react";

function NoteCard({ note }) {
  return (
    <div className="note-card">
      <h5>{note.title}</h5>
      <p>{note.content}</p>
    </div>
  );
}

export default NoteCard;