"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { languages, type Language, useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function closeMenu(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", closeMenu);
    return () => document.removeEventListener("mousedown", closeMenu);
  }, []);

  function selectLanguage(nextLanguage: Language) {
    setLanguage(nextLanguage);
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative" aria-label="Language">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "flex h-8 items-center gap-1 border border-border px-2 text-[10px] font-medium",
          "text-muted transition-colors duration-300 hover:border-foreground/30 hover:text-foreground"
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {language}
        <ChevronDown
          className={cn("h-3 w-3 transition-transform duration-300", open && "rotate-180")}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div
          className="absolute right-0 top-10 z-[80] min-w-full border border-border bg-background shadow-lg"
          role="listbox"
          aria-label="Language"
        >
          {languages.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => selectLanguage(item)}
              className={cn(
                "flex h-8 w-full items-center justify-center px-3 text-[10px] font-medium transition-colors duration-300",
                item === language
                  ? "bg-foreground text-background"
                  : "text-muted hover:bg-border hover:text-foreground"
              )}
              role="option"
              aria-selected={item === language}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
