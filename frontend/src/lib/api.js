import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  headers: { "Content-Type": "application/json" },
});

export const getCount = () => api.get("/registrations/count").then((r) => r.data);

export const createRegistration = (payload) =>
  api.post("/registrations", payload).then((r) => r.data);

export const adminLogin = (password) =>
  api.post("/admin/login", { password }).then((r) => r.data);

export const adminListRegistrations = (token) =>
  api
    .get("/admin/registrations", { headers: { "X-Admin-Token": token } })
    .then((r) => r.data);

export const adminDeleteRegistration = (token, id) =>
  api
    .delete(`/admin/registrations/${id}`, {
      headers: { "X-Admin-Token": token },
    })
    .then((r) => r.data);
