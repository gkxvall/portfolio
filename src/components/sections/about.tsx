"use client";

import { motion } from "framer-motion";
import { Section, SectionHeading } from "@/components/ui/section";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n";

export function About() {
  const { copy } = useLanguage();

  return (
    <Section id="about">
      <div className="grid-layout">
        <SectionHeading title={copy.about.title} />

        <div className="grid grid-cols-1 gap-10 md:gap-14 lg:grid-cols-12 lg:gap-8">
          <motion.div
            className="lg:col-span-7"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {copy.about.paragraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className={
                  index === 0
                    ? "text-base leading-relaxed text-muted md:text-xl md:leading-relaxed"
                    : "mt-5 text-base leading-relaxed text-muted md:mt-6 md:text-xl md:leading-relaxed"
                }
              >
                {paragraph}
              </p>
            ))}
          </motion.div>

          <motion.div
            className="lg:col-span-4 lg:col-start-9"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <div className="space-y-8 border-t border-border pt-8">
              {copy.about.facts.map((fact) => (
                <motion.div key={fact.label} variants={staggerItem}>
                  <p className="mb-2 text-xs uppercase tracking-[0.15em] text-muted">
                    {fact.label}
                  </p>
                  {Array.isArray(fact.value) ? (
                    <div className="flex flex-col gap-1">
                      {fact.value.map((item) => (
                        <span key={item} className="text-sm text-foreground">
                          {item}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-foreground">{fact.value}</p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
