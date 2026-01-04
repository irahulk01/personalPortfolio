// src/api/contactApi.ts
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_LOCAL;

export const fetchAllContacts = async () => {
  const res = await axios.get(`${API_BASE_URL}/getContacts`);
  return res.data;
};

export const submitContactForm = async (data: {
  name: string;
  email: string;
  phoneNumber: string;
  description: string;
}) => {
  const res = await axios.post(`${API_BASE_URL}/submitContact`, data);
  return res;
};