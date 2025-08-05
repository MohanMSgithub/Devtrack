
import API from "./api";

export const fetchNotes = () => API.get("/api/notes");
export const createNote = (note) => API.post("/api/notes", note);
export const updateNote = (id, note) => API.put(`/api/notes/${id}`, note);
export const deleteNote = (id) => API.delete(`/api/notes/${id}`);
