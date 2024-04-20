import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000" });

export const createChatGroup = (data) => API.post('/group', data);
export const userChatGroups = (id) => API.get(`/group/${id}`);
export const memberInGroups = (id) => API.get(`/group/members/${id}`);
export const addMembersToGroup = (data) => API.post('/group/add-member', data);
export const removeMemberFromGroup = (data) => API.post('/group/remove-member', data);
export const leaveGroup = (data) => API.post('/group/leave-group', data);
export const deleteGroup = (data) => API.post('/group/delete-group', data);