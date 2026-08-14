"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";

const LOCAL_STORAGE_KEY = "portfolio_uuid";

export default function SessionAnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const sessionIdRef = useRef<string>("");
  const visitorIdRef = useRef<string>("");
  const currentPageRef = useRef<string>(pathname);
  const pageStartTimeRef = useRef<number>(Date.now());
  const pageDurationsRef = useRef<Record<string, number>>({});
  const downloadedResumeRef = useRef<boolean>(false);
  const isVisibleRef = useRef<boolean>(true);

  // Initialize Session ID & Visitor ID & Resume listener
  useEffect(() => {
    if (typeof window === "undefined") return;

    sessionIdRef.current = uuidv4();
    let vid = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!vid) {
      vid = uuidv4();
      localStorage.setItem(LOCAL_STORAGE_KEY, vid);
    }
    visitorIdRef.current = vid;
    pageStartTimeRef.current = Date.now();

    const handleResumeDownloaded = () => {
      downloadedResumeRef.current = true;
      sendSessionBeacon(false);
    };

    window.addEventListener("portfolio_resume_downloaded", handleResumeDownloaded);

    return () => {
      window.removeEventListener("portfolio_resume_downloaded", handleResumeDownloaded);
    };
  }, []);

  // Flush current page time to accumulator
  const flushCurrentPageTime = () => {
    if (!currentPageRef.current || !isVisibleRef.current) return;
    const now = Date.now();
    const elapsedSeconds = (now - pageStartTimeRef.current) / 1000;
    if (elapsedSeconds > 0.5) {
      const p = currentPageRef.current;
      pageDurationsRef.current[p] = (pageDurationsRef.current[p] || 0) + elapsedSeconds;
    }
    pageStartTimeRef.current = now;
  };

  // Sync session data to MongoDB via Beacon API with telemetry token & resume flag
  const sendSessionBeacon = (isFinal = false) => {
    if (typeof window === "undefined" || !sessionIdRef.current) return;
    flushCurrentPageTime();

    const breakdown = { ...pageDurationsRef.current };
    let totalSec = 0;
    Object.values(breakdown).forEach((sec) => (totalSec += sec));

    if (totalSec < 1 && !downloadedResumeRef.current) return;

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

    const payload = JSON.stringify({
      sessionId: sessionIdRef.current,
      visitorId: visitorIdRef.current,
      pageBreakdown: breakdown,
      totalDurationSeconds: Math.round(totalSec),
      downloadedResume: downloadedResumeRef.current,
      _t: token,
      isFinal,
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/session", blob);
    } else {
      fetch("/api/session", {
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
        keepalive: true,
      }).catch(() => {});
    }
  };

  // Track page transitions via usePathname
  useEffect(() => {
    if (!currentPageRef.current) {
      currentPageRef.current = pathname;
      pageStartTimeRef.current = Date.now();
      return;
    }

    if (pathname !== currentPageRef.current) {
      flushCurrentPageTime();
      currentPageRef.current = pathname;
      pageStartTimeRef.current = Date.now();
      sendSessionBeacon(false);
    }
  }, [pathname]);

  // Handle visibility changes & tab unload
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        isVisibleRef.current = false;
        flushCurrentPageTime();
        sendSessionBeacon(true);
      } else {
        isVisibleRef.current = true;
        pageStartTimeRef.current = Date.now();
      }
    };

    const handleUnload = () => {
      sendSessionBeacon(true);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleUnload);

    // Periodic sync every 30 seconds
    const interval = setInterval(() => {
      if (isVisibleRef.current) {
        sendSessionBeacon(false);
      }
    }, 30000);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleUnload);
      clearInterval(interval);
    };
  }, []);

  return <>{children}</>;
}
