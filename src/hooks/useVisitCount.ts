import { useQuery } from "@tanstack/react-query";
import { getViewCount } from "../api/portfolio";

/**
 * Reads and returns the current visit count from the server.
 * Incrementing is handled solely by SessionAnalyticsProvider on mount.
 */
const useVisitCount = () => {
  const query = useQuery({
    queryKey: ["visitCount"],
    queryFn: getViewCount,
    staleTime: 60 * 1000,
  });

  return query.data ?? null;
};

export default useVisitCount;