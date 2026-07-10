"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { type Project } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const { copy } = useLanguage();
  const translatedDescription =
    copy.projects.items[project.id as keyof typeof copy.projects.items] ??
    project.description;

  return (
    <motion.article
      className="group relative flex flex-col justify-between border border-border p-5 sm:p-6 md:p-10 lg:p-12"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <div>
        <div className="mb-6 flex items-start justify-between gap-4 md:mb-8">
          <h3 className="text-xl font-medium tracking-tight text-foreground md:text-3xl">
            {project.title}
          </h3>
          <ArrowUpRight
            className="h-5 w-5 shrink-0 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>
        <p className="max-w-lg text-sm leading-relaxed text-muted md:text-base">{translatedDescription}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted md:px-3 md:text-xs"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 md:mt-10 md:gap-4">
        {project.github && (
          <Link
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group/btn inline-flex items-center gap-2 border border-border px-4 py-2.5 md:px-5",
              "text-xs uppercase tracking-[0.12em] text-foreground transition-all duration-300",
              "hover:border-foreground/40 hover:bg-foreground hover:text-background"
            )}
          >
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            GitHub
          </Link>
        )}
        {project.demo && (
          <Link
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "group/btn inline-flex items-center gap-2 border border-border px-4 py-2.5 md:px-5",
              "text-xs uppercase tracking-[0.12em] text-foreground transition-all duration-300",
              "hover:border-foreground/40 hover:bg-foreground hover:text-background"
            )}
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            {copy.projects.liveDemo}
          </Link>
        )}
      </div>
    </motion.article>
  );
}
