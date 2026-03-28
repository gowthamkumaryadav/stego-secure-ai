import axios from "axios";

const API = 'http://localhost:8081/stego';

export const encodeImage = (formData) =>
  axios.post(`${API}/encode`, formData, {
    responseType: "blob",
  });

export const decodeImage = (formData) =>
  axios.post(`${API}/decode`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });