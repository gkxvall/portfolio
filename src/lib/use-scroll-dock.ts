import { useEffect, useState } from "react";

const fallbackThreshold = 120;
const headerOffset = 72;

export function useScrollDock(targetId = "hero-avatar") {
  const [isDocked, setIsDocked] = useState(false);

  useEffect(() => {
    function updateDockState() {
      const responsiveTargetId = `${targetId}-${
        window.innerWidth < 768 ? "mobile" : "desktop"
      }`;
      const target =
        document.getElementById(responsiveTargetId) ??
        document.getElementById(targetId);
      const targetTop = target
        ? target.getBoundingClientRect().top + window.scrollY
        : 0;
      const dockPoint = target
        ? targetTop + target.offsetHeight - headerOffset
        : fallbackThreshold;

      setIsDocked(window.scrollY >= dockPoint);
    }

    updateDockState();
    window.addEventListener("scroll", updateDockState, { passive: true });
    window.addEventListener("resize", updateDockState);

    return () => {
      window.removeEventListener("scroll", updateDockState);
      window.removeEventListener("resize", updateDockState);
    };
  }, [targetId]);

  return isDocked;
}
