import axios from "axios";

const API_URL = "http://localhost:8000/api/usuarios";

export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

export const loginUser = async (userData) => {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
};

export const requestPasswordReset = async (email) => {
    const response = await axios.post(`${API_URL}/request-password-reset`, { email });
    return response.data;
};

export const resetPassword = async (token, novaSenha) => {
    const response = await axios.post(`${API_URL}/reset-password`, { token, novaSenha });
    return response.data;
}