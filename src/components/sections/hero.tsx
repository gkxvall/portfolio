"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import mainAvatar from "../../../mainAvatar.png";
import { siteConfig } from "@/lib/data";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n";
import { useScrollDock } from "@/lib/use-scroll-dock";

export function Hero() {
  const { copy } = useLanguage();
  const isDocked = useScrollDock();

  return (
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 lg:min-h-screen lg:pt-40 lg:pb-32">
      <div className="grid-layout">
        <div className="grid grid-cols-1 gap-10 md:gap-14 lg:grid-cols-12 lg:gap-8">
          <motion.div
            className="lg:col-span-7"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.p
              variants={staggerItem}
              className="mb-4 text-sm uppercase tracking-[0.2em] text-muted"
            >
              {copy.hero.eyebrow}
            </motion.p>

            <motion.h1
              variants={staggerItem}
              className="text-display-xl font-medium text-foreground"
            >
              {/* {siteConfig.firstName}
              <br /> */}
              {siteConfig.lastName}
            </motion.h1>

            <motion.div
              variants={staggerItem}
              className="mt-8 space-y-1 text-xl font-light leading-snug text-muted md:mt-10 md:text-3xl lg:text-4xl"
            >
              {copy.hero.lines.map((line, index) => (
                <p
                  key={line}
                  className={
                    index === copy.hero.lines.length - 1
                      ? "text-foreground"
                      : undefined
                  }
                >
                  {line}
                </p>
              ))}
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="mt-9 max-w-lg space-y-4 md:mt-12"
            >
              <p className="text-sm leading-relaxed text-muted md:text-base">
                {copy.hero.summary}
              </p>
              <p className="text-sm leading-relaxed text-muted/80 md:text-base">
                {copy.hero.availability}
              </p>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex items-center justify-center lg:col-span-4 lg:col-start-9 lg:justify-end lg:pt-8"
            initial={{ opacity: 0, x: 24 }}
            animate={
              isDocked
                ? {
                    opacity: 0,
                    scale: 0.16,
                    x: "-56vw",
                    y: "-34vh",
                    rotate: -4,
                  }
                : { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }
            }
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="w-full max-w-[260px] sm:max-w-[320px] md:max-w-[440px] lg:max-w-[560px]"
              animate={
                isDocked
                  ? { y: 0, rotate: 0 }
                  : { y: [0, -14, 0], rotate: [0, -1.5, 0.8, 0] }
              }
              transition={{
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }}
              whileHover={{ scale: 1.04, rotate: -2 }}
            >
              <Image
                src={mainAvatar}
                alt="Mohamedhen Vall avatar"
                className="h-auto w-full scale-x-[-1] object-contain"
                priority
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
