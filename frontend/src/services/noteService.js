import API from "./api";

const notesService = {
  fetchNotes: () => API.get("/api/notes"),
  createNote: (note) => API.post("/api/notes", note),
  updateNote: (id, note) => API.put(`/api/notes/${id}`, note),
  deleteNote: (id) => API.delete(`/api/notes/${id}`),
};

export default notesService;
