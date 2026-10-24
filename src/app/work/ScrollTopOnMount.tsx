"use client";

import { useEffect } from "react";

export function ScrollTopOnMount() {
  useEffect(() => {
    if (typeof window !== "undefined" && !window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }
  }, []);

  return null;
}
