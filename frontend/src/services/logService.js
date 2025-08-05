
import API from "./api";

export const fetchLogs = () => API.get("/api/logs");
export const createLog = (log) => API.post("/api/logs", log);
export const updateLog = (id, log) => API.put(`/api/logs/${id}`, log);
export const deleteLog = (id) => API.delete(`/api/logs/${id}`);
