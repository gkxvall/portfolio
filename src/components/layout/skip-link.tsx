"use client";

import { useLanguage } from "@/lib/i18n";

export function SkipLink() {
  const { copy } = useLanguage();

  return (
    <a
      href="#about"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:border focus:border-border focus:bg-background focus:px-4 focus:py-2 focus:text-sm"
    >
      {copy.skip}
    </a>
  );
}
