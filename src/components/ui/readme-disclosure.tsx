"use client";

import { ArrowUp, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";

export function ReadmeDisclosure({ children }: { children: React.ReactNode }) {
  const { copy } = useLanguage();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateButton = () => {
      const details = detailsRef.current;
      if (!details || !details.open) {
        setShowBackToTop(false);
        return;
      }

      const readmeTop = details.getBoundingClientRect().top + window.scrollY;
      setShowBackToTop(window.scrollY > readmeTop + 240);
    };

    updateButton();
    window.addEventListener("scroll", updateButton, { passive: true });
    window.addEventListener("resize", updateButton);

    return () => {
      window.removeEventListener("scroll", updateButton);
      window.removeEventListener("resize", updateButton);
    };
  }, [isOpen]);

  const scrollToReadmeTop = () => {
    detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <details
        ref={detailsRef}
        className="group mt-12 w-full scroll-mt-24 border border-border"
        onToggle={(event) => setIsOpen(event.currentTarget.open)}
      >
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground md:px-6 [&::-webkit-details-marker]:hidden">
          <span>{copy.projectDetails.readme}</span>
          <ChevronDown
            className="h-4 w-4 transition-transform group-open:rotate-180"
            aria-hidden="true"
          />
        </summary>
        {children}
      </details>

      <button
        type="button"
        onClick={scrollToReadmeTop}
        className={`fixed right-5 bottom-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background/90 text-foreground shadow-xl shadow-black/30 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-foreground/40 md:right-8 md:bottom-8 ${
          showBackToTop
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0"
        }`}
        aria-label={copy.projectDetails.backToReadme}
      >
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
      </button>
    </>
  );
}
