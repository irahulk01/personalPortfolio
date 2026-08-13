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
 * Increase view count only for new users with payload obfuscation
 * Returns the new count if increased, or null if already counted.
 */
export const increaseViewCountIfNew = async (): Promise<number | null> => {
  try {
    let userId = localStorage.getItem(LOCAL_STORAGE_KEY);

    // already counted → return null
    if (userId) return null;

    // new visitor
    userId = uuidv4();
    localStorage.setItem(LOCAL_STORAGE_KEY, userId);

    // Obfuscate telemetry payload so Network tab inspects see encrypted token
    let token = "";
    if (typeof window !== "undefined") {
      const rawDetails = {
        sr: `${window.screen.width}x${window.screen.height}`,
        vp: `${window.innerWidth}x${window.innerHeight}`,
        pr: window.devicePixelRatio || 1,
        lg: navigator.language || "Unknown",
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
        rf: document.referrer || "Direct / Bookmark",
      };
      token = btoa(encodeURIComponent(JSON.stringify(rawDetails)));
    }

    // Post obfuscated token payload and return updated count
    const res = await axios.post(`${API_BASE_URL}/visitcount`, { _t: token });
    return res.data.count ?? null;
  } catch (err) {
    console.error("Failed to update view count", err);
    return null;
  }
};