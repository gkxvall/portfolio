import { useEffect, useState } from "react";

const fallbackThreshold = 120;
const headerOffset = 72;

export function useScrollDock(targetId = "hero") {
  const [isDocked, setIsDocked] = useState(false);

  useEffect(() => {
    function updateDockState() {
      const target = document.getElementById(targetId);
      const dockPoint = target
        ? target.offsetTop + target.offsetHeight - headerOffset
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
