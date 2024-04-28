import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_SERVER_URL });

export const logIn = (formData) => API.post("/auth/login", formData);

export const signUp = (formData) => API.post("/auth/register", formData);

export const sendOtp = (username) => API.post("/auth/send-otp", { username });
