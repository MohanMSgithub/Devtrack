// logsService.js
import API from "./api";

const logsService = {
  fetchLogs: () => API.get("/api/logs"),
  createLog: (log) => API.post("/api/logs", log),
  updateLog: (id, log) => API.put(`/api/logs/${id}`, log),
  deleteLog: (id) => API.delete(`/api/logs/${id}`),
};

export default logsService;
