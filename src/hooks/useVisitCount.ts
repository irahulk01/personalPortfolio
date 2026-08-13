import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { getViewCount, increaseViewCountIfNew } from "../api/api";

const useVisitCount = () => {
  const queryClient = useQueryClient();
  const increasedRef = useRef(false);

  const query = useQuery({
    queryKey: ["visitCount"],
    queryFn: getViewCount,
    staleTime: 60 * 1000,
  });

  const mutation = useMutation({
    mutationFn: increaseViewCountIfNew,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["visitCount"] });
    },
  });

  useEffect(() => {
    if (!increasedRef.current) {
      increasedRef.current = true;
      mutation.mutate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return query.data ?? null;
};

export default useVisitCount;