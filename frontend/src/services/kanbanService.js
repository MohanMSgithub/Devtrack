
import API from "./api";

export const fetchTasks = () => API.get("/api/kanban");
export const createTask = (task) => API.post("/api/kanban", task);
export const updateTask = (id, task) => API.put(`/api/kanban/${id}`, task);
export const deleteTask = (id) => API.delete(`/api/kanban/${id}`);
