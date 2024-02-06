import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

export const createChatGroup = (data) => API.post('/group', data);
export const userChatGroups = (id) => API.get(`/group/${id}`);