import { useState, useEffect } from "react";

const MOBILE_MAX_WIDTH = 768; // Common breakpoint for tablets

export function useResponsive() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDeviceType = () => {
      setIsMobile(window.innerWidth < MOBILE_MAX_WIDTH);
    };

    checkDeviceType(); // Initial check
    window.addEventListener("resize", checkDeviceType);

    return () => {
      window.removeEventListener("resize", checkDeviceType);
    };
  }, []);

  return { isMobile };
}
