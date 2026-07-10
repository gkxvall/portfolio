"use client";

import { motion } from "framer-motion";
import { experience } from "@/lib/data";
import { Section, SectionHeading } from "@/components/ui/section";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n";

export function Experience() {
  const { copy } = useLanguage();

  return (
    <Section id="experience">
      <div className="grid-layout">
        <SectionHeading
          title={copy.experience.title}
          subtitle={copy.experience.subtitle}
        />

        <motion.div
          className="relative max-w-2xl"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-border" aria-hidden="true" />

          <div className="space-y-12">
            {experience.map((item) => {
              const translatedItem =
                copy.experience.items[
                  item.id as keyof typeof copy.experience.items
                ];

              return (
              <motion.div key={item.id} variants={staggerItem} className="relative pl-10">
                <div
                  className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border border-border bg-background"
                  aria-hidden="true"
                />
                <div className="mb-2 flex flex-wrap items-center gap-3">
                  <span className="text-xs uppercase tracking-[0.12em] text-muted">
                    {copy.experience.types[item.type]}
                  </span>
                  <span className="text-xs text-muted/60">{item.period}</span>
                </div>
                <h3 className="text-lg font-medium text-foreground">
                  {translatedItem?.title ?? item.title}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {translatedItem?.organization ?? item.organization}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted/80">
                  {translatedItem?.description ?? item.description}
                </p>
              </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
