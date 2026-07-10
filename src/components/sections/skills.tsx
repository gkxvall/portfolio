"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import skillsAvatar from "../../../skillsAvatar.png";
import { techStack } from "@/lib/data";
import { Section, SectionHeading } from "@/components/ui/section";
import { TechIcon } from "@/components/ui/tech-icon";
import { useLanguage } from "@/lib/i18n";

const scatterPositions = [
  ["5%", "12%"],
  ["20%", "4%"],
  ["42%", "6%"],
  ["62%", "5%"],
  ["82%", "12%"],
  ["7%", "31%"],
  ["20%", "28%"],
  ["74%", "28%"],
  ["89%", "33%"],
  ["3%", "52%"],
  ["17%", "58%"],
  ["76%", "58%"],
  ["90%", "52%"],
  ["8%", "78%"],
  ["25%", "87%"],
  ["45%", "84%"],
  ["64%", "88%"],
  ["82%", "78%"],
  ["50%", "2%"],
] as const;

export function Skills() {
  const { copy } = useLanguage();

  return (
    <Section id="skills">
      <div className="grid-layout">
        <SectionHeading title={copy.skills.title} />

        <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-3 md:block md:min-h-[720px]">
          <motion.div
            className="pointer-events-none order-first mb-3 flex w-full justify-center md:absolute md:inset-0 md:z-0 md:mb-0 md:items-center"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="mx-auto w-full max-w-[210px] sm:max-w-[250px] md:max-w-[380px] lg:max-w-[430px]"
              animate={{ y: [0, -12, 0], rotate: [0, 1.2, -0.8, 0] }}
              transition={{
                duration: 7,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }}
            >
              <Image
                src={skillsAvatar}
                alt="Skills avatar"
                className="h-auto w-full object-contain"
              />
            </motion.div>
          </motion.div>

          {techStack.map((tech, index) => (
            <motion.div
              key={tech.name}
              className="group z-10 flex items-center gap-2 border border-border bg-background px-3 py-2 text-xs text-muted transition-colors duration-300 hover:border-foreground/30 hover:text-foreground md:absolute md:animate-float md:gap-3 md:px-4 md:py-3 md:text-sm"
              style={{
                left: scatterPositions[index]?.[0],
                top: scatterPositions[index]?.[1],
                animationDelay: `${index * -0.45}s`,
              }}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.4,
                delay: index * 0.03,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
            >
              <TechIcon
                icon={tech.icon}
                label={tech.name}
                className="h-4 w-4 text-foreground md:h-5 md:w-5"
              />
              <span>{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  );
}
