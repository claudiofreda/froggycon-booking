import { useState, useEffect } from "react";
import { Session } from "@/types";

const cacheKey = "sessions" as const;
const sessionCache = new Map<typeof cacheKey, Session[]>();

export const useSessions = () => {
  const [data, setData] = useState<Session[]>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    if (sessionCache.has(cacheKey)) {
      setData(sessionCache.get(cacheKey));
      setLoading(false);
      return;
    }

    const fetchSessions = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/sessions");
        if (!response.ok) {
          throw new Error("Failed to fetch sessions");
        }
        const sessions = await response.json();
        sessionCache.set(cacheKey, sessions);
        setData(sessions);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  const invalidateCache = () => sessionCache.delete(cacheKey);

  return { data, loading, error, invalidateCache };
};
