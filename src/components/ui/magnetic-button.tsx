"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
  href?: string;
  as?: "button" | "a";
  target?: string;
  rel?: string;
  download?: boolean;
}

export function MagneticButton({
  children,
  className,
  strength = 0.25,
  onClick,
  href,
  as = "button",
  target,
  rel,
  download,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const motionProps = {
    style: { x: springX, y: springY },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: { duration: 0.2 },
  };

  if (as === "a" && href) {
    return (
      <motion.div ref={ref} {...motionProps} className="inline-block">
        <a
          href={href}
          target={target}
          rel={rel}
          download={download}
          className={cn("inline-block", className)}
        >
          {children}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.div ref={ref} {...motionProps} className="inline-block">
      <button type="button" onClick={onClick} className={cn("inline-block", className)}>
        {children}
      </button>
    </motion.div>
  );
}
