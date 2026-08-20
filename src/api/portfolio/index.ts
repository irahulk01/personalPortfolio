import axios from "axios";

const API_BASE_URL = "/api";
const VISIT_COUNTED_KEY = "portfolio_visit_counted";

let isIncrementingPromise: Promise<number | null> | null = null;

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
 * Increase view count only for new visitors.
 * Returns the new count if incremented, or null if already counted.
 */
export const increaseViewCountIfNew = async (): Promise<number | null> => {
  if (typeof window === "undefined") return null;

  // Already counted this browser — skip
  if (localStorage.getItem(VISIT_COUNTED_KEY)) return null;

  // Deduplicate concurrent calls
  if (isIncrementingPromise) return isIncrementingPromise;

  isIncrementingPromise = (async () => {
    try {
      // Double-check after acquiring the promise lock
      if (localStorage.getItem(VISIT_COUNTED_KEY)) return null;

      const rawDetails = {
        sr: `${window.screen.width}x${window.screen.height}`,
        vp: `${window.innerWidth}x${window.innerHeight}`,
        pr: window.devicePixelRatio || 1,
        lg: navigator.language || "Unknown",
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown",
        rf: document.referrer || "Direct / Bookmark",
      };
      const token = btoa(encodeURIComponent(JSON.stringify(rawDetails)));

      const res = await axios.post(`${API_BASE_URL}/visitcount`, { _t: token });
      if (res.data && typeof res.data.count === "number") {
        // Mark this browser as counted only after a successful response
        localStorage.setItem(VISIT_COUNTED_KEY, "true");
        return res.data.count;
      }
      return null;
    } catch (err) {
      console.error("Failed to update view count", err);
      return null;
    } finally {
      isIncrementingPromise = null;
    }
  })();

  return isIncrementingPromise;
};

/**
 * Submit Contact Form
 */
export const submitContactForm = async (data: {
  name: string;
  email: string;
  phoneNumber: string;
  description: string;
}) => {
  const res = await axios.post(`${API_BASE_URL}/contact`, data);
  return res;
};
