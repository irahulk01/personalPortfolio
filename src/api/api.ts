import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LOCAL_STORAGE_KEY = "portfolio_uuid";

export const getViewCount = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/views`);
    const portfolio = response.data.find((item: any) => item.id === "portfolio");
    return portfolio?.viewCount ?? 0;
  } catch (error) {
    console.error("Failed to fetch view count:", error);
    return null;
  }
};

export const increaseViewCountIfNew = async () => {
  try {
    let userId = localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!userId) {
      userId = uuidv4(); // new visitor
      localStorage.setItem(LOCAL_STORAGE_KEY, userId);

      // Get current count
      const response = await axios.get(`${API_BASE_URL}/views`);
      const viewItem = response.data.find((item: any) => item.id === "portfolio");

      if (viewItem) {
        const updatedCount = viewItem.viewCount + 1;

        await axios.patch(`${API_BASE_URL}/views/${viewItem.id}`, {
          viewCount: updatedCount,
        });
      }
    }
  } catch (error) {
    console.error("Failed to update view count:", error);
  }
};