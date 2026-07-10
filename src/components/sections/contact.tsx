"use client";

import { motion } from "framer-motion";
import { Download, Github, Linkedin, Mail } from "lucide-react";
import Image from "next/image";
import { siteConfig } from "@/lib/data";
import { Section } from "@/components/ui/section";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const linkClassName = cn(
  "group flex items-center gap-3 text-muted transition-colors duration-300 hover:text-foreground",
);

export function Contact() {
  const { copy } = useLanguage();
  const contactLinks = [
    {
      label: copy.contact.email,
      href: `mailto:${siteConfig.email}`,
      icon: Mail,
      external: false,
    },
    {
      label: copy.contact.linkedin,
      href: siteConfig.linkedin,
      icon: Linkedin,
      external: true,
    },
    {
      label: copy.contact.github,
      href: siteConfig.github,
      icon: Github,
      external: true,
    },
  ] as const;

  return (
    <Section id="contact" className="pb-24 md:pb-32">
      <div className="grid-layout">
        <div className="grid grid-cols-1 items-center gap-10 md:gap-14 lg:grid-cols-12 lg:gap-8">
          <motion.div
            className="lg:col-span-7"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <motion.h2
              variants={staggerItem}
              className="text-display-lg font-medium tracking-tight text-foreground"
            >
              {copy.contact.titleLines[0]}
              <br />
              {copy.contact.titleLines[1]}
            </motion.h2>

            <motion.div
              variants={staggerItem}
              className="mt-10 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-10 md:mt-16 md:gap-12"
            >
              {contactLinks.map((link) => (
                <MagneticButton
                  key={link.label}
                  as="a"
                  href={link.href}
                  strength={0.15}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={linkClassName}
                >
                  <link.icon className="h-4 w-4" aria-hidden="true" />
                  <span className="relative text-sm uppercase tracking-[0.12em]">
                    {link.label}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-foreground transition-all duration-300 group-hover:w-full" />
                  </span>
                </MagneticButton>
              ))}
            </motion.div>

            <motion.div variants={staggerItem} className="mt-9 md:mt-12">
              <MagneticButton
                as="a"
                href={siteConfig.cvUrl}
                strength={0.2}
                download
              >
                <span className="inline-flex items-center gap-3 border border-border px-6 py-3 text-xs uppercase tracking-[0.12em] text-foreground transition-all duration-300 hover:border-foreground/40 hover:bg-foreground hover:text-background">
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  {copy.contact.downloadCv}
                </span>
              </MagneticButton>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center lg:col-span-4 lg:col-start-9 lg:justify-end"
            initial={{ opacity: 0, x: 32, scale: 0.96 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="w-full max-w-[280px] sm:max-w-[340px] md:max-w-[460px] lg:max-w-[580px]"
              animate={{ y: [0, -12, 0], rotate: [0, 1.2, -0.8, 0] }}
              transition={{
                duration: 7,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "loop",
              }}
              whileHover={{ scale: 1.03, rotate: 1.5 }}
            >
              <Image
                src="/contactAvatar.png"
                alt="Contact avatar"
                width={558}
                height={447}
                className="h-auto w-full scale-x-[-1] object-contain"
                unoptimized
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
