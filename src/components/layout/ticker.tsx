"use client";

import { techStack } from "@/lib/data";
import { TechIcon } from "@/components/ui/tech-icon";

export function Ticker() {
  const items = [...techStack, ...techStack, ...techStack];

  return (
    <section
      className="overflow-hidden bg-background"
      aria-label="Technology stack"
    >
      <div className="flex animate-marquee items-center whitespace-nowrap py-6">
        {items.map((item, index) => (
          <span
            key={`${item.name}-${index}`}
            className="mx-8 inline-flex items-center justify-center text-[var(--ticker-icon)] transition-colors duration-300 hover:text-foreground md:mx-16"
            title={item.name}
          >
            <TechIcon icon={item.icon} label={item.name} className="h-7 w-7 md:h-9 md:w-9" />
          </span>
        ))}
      </div>
    </section>
  );
}
