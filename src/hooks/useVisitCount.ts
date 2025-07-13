import { useState, useEffect } from "react";
import { getViewCount, increaseViewCountIfNew } from "../api/api";

const useVisitCount = () => {
  const [viewCount, setViewCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchAndUpdate = async () => {
      await increaseViewCountIfNew(); // 🚀 Try to increase if user is new
      const count = await getViewCount(); // ✅ Always fetch latest
      setViewCount(count);
    };
    fetchAndUpdate();
  }, []);

  return viewCount;
};

export default useVisitCount;