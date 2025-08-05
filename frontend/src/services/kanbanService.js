// kanbanService.js
import API from "./api";

const kanbanService = {
  fetchTasks: () => API.get("/api/kanban"),
  createTask: (task) => API.post("/api/kanban", task),
  updateTask: (id, task) => API.put(`/api/kanban/${id}`, task),
  deleteTask: (id) => API.delete(`/api/kanban/${id}`),
};

export default kanbanService;
