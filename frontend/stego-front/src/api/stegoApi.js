import axios from "axios";

// ✅ Base URLs
const STEGO_API = "https://stego-secure-ai-1.onrender.com/stego";
const AUTH_API = "https://stego-secure-ai-1.onrender.com/auth";

// =========================
// 🔐 ENCODE
// =========================
export const encodeImage = (formData) =>
  axios.post(`${STEGO_API}/encode`, formData, {
    responseType: "blob",
  });

// =========================
// 🔓 DECODE
// =========================
export const decodeImage = (formData) =>
  axios.post(`${STEGO_API}/decode`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// =========================
// 🔑 LOGIN
// =========================
export const loginUser = (data) => axios.post(`${AUTH_API}/login`, data);

// =========================
// 📝 REGISTER
// =========================
export const registerUser = (data) => axios.post(`${AUTH_API}/register`, data);
