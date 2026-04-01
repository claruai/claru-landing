"use client";

import { useState, useEffect } from "react";

interface DeviceCapability {
  isMobile: boolean;
  isLowPower: boolean;
  prefersReducedMotion: boolean;
}

const defaultCapability: DeviceCapability = {
  isMobile: false,
  isLowPower: false,
  prefersReducedMotion: false,
};

export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] =
    useState<DeviceCapability>(defaultCapability);

  useEffect(() => {
    // Detect mobile via screen width
    const checkMobile = () => window.innerWidth < 768;

    // Detect low power device via hardware concurrency
    const checkLowPower = () => {
      if (typeof navigator !== "undefined" && navigator.hardwareConcurrency) {
        return navigator.hardwareConcurrency <= 4;
      }
      return false;
    };

    // Detect reduced motion preference
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const checkReducedMotion = () => reducedMotionQuery.matches;

    // Set initial values
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCapability({
      isMobile: checkMobile(),
      isLowPower: checkLowPower(),
      prefersReducedMotion: checkReducedMotion(),
    });

    // Handle resize for mobile detection
    const handleResize = () => {
      setCapability((prev) => ({
        ...prev,
        isMobile: checkMobile(),
      }));
    };

    // Handle reduced motion changes
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setCapability((prev) => ({
        ...prev,
        prefersReducedMotion: e.matches,
      }));
    };

    window.addEventListener("resize", handleResize);
    reducedMotionQuery.addEventListener("change", handleReducedMotionChange);

    return () => {
      window.removeEventListener("resize", handleResize);
      reducedMotionQuery.removeEventListener(
        "change",
        handleReducedMotionChange,
      );
    };
  }, []);

  return capability;
}
