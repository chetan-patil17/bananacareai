import api from "./api";

// ==============================
// LOGIN
// ==============================

export const loginUser = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
};

// ==============================
// REGISTER
// ==============================

export const registerUser = async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
};

// ==============================
// TOKEN
// ==============================

export const saveToken = (token) => {
    localStorage.setItem("token", token);
};

export const getToken = () => {
    return localStorage.getItem("token");
};

export const removeToken = () => {
    localStorage.removeItem("token");
};