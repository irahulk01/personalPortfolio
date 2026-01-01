import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_BASE_URL = import.meta.env.VITE_API_BASE_MONGO_URL;
const LOCAL_STORAGE_KEY = "portfolio_uuid";

/**
 * Get total view count
 */
export const getViewCount = async (): Promise<number> => {
  try {
    const res = await axios.get(`${API_BASE_URL}/visitcount`);
    return res.data.count ?? 0;
  } catch (err) {
    console.error("Failed to fetch view count", err);
    return 0;
  }
};

/**
 * Increase view count only for new users
 */
export const increaseViewCountIfNew = async (): Promise<void> => {
  try {
    let userId = localStorage.getItem(LOCAL_STORAGE_KEY);

    // already counted → do nothing
    if (userId) return;

    // new visitor
    userId = uuidv4();
    localStorage.setItem(LOCAL_STORAGE_KEY, userId);

    // increment count
    await axios.post(`${API_BASE_URL}/visitcount`);
  } catch (err) {
    console.error("Failed to update view count", err);
  }
};