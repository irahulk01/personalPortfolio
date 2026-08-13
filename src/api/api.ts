import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_BASE_URL = "/api";
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

    // Gather rich client browser details
    const browserDetails =
      typeof window !== "undefined"
        ? {
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            viewportSize: `${window.innerWidth}x${window.innerHeight}`,
            devicePixelRatio: window.devicePixelRatio || 1,
            language: navigator.language || "Unknown",
            timezone:
              Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
            referrer: document.referrer || "Direct / Bookmark",
          }
        : {};

    // increment count
    await axios.post(`${API_BASE_URL}/visitcount`, { browserDetails });
  } catch (err) {
    console.error("Failed to update view count", err);
  }
};