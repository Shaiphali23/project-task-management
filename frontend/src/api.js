import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// PROJECTS
export const getProjects = () => API.get("/projects");
export const createProject = (data) => API.post("/projects", data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);

// TASKS
export const getTasksByProject = (projectId) => API.get(`/tasks/project/${projectId}`);
export const createTask = (data) => API.post("/tasks", data);
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// AI
export const summarizeProject = (tasks) => API.post("/ai/summarize", { tasks });
export const askQuestion = (data) => API.post("/ai/qa", data);
