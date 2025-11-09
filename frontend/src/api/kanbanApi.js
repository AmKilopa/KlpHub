import axios from "axios";

const base = "http://localhost:5000/api";
const cfg = { withCredentials: true };

export const getUser     = () => axios.get(`${base}/user`, cfg);
export const logout      = () => axios.get(`${base}/logout`, cfg);
export const getTodos    = () => axios.get(`${base}/todos`, cfg);
export const createTodo  = (title, description = "") => axios.post(`${base}/todo/create`, { title, description }, cfg);
export const deleteTodo  = (id) => axios.delete(`${base}/todo/delete/${id}`, cfg);
export const moveTodo    = (id, columnName) => axios.patch(`${base}/todo/to/${id}`, { columnName }, cfg);
export const editTodo    = (id, title, description) => axios.patch(`${base}/todo/descredit/${id}`, { title, description }, cfg);
