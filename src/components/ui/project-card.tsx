"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { type Project } from "@/lib/data";
import { useLanguage } from "@/lib/i18n";
import { getProjectDetailHref } from "@/lib/project-links";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export function ProjectCard({ project, index = 0 }: ProjectCardProps) {
  const router = useRouter();
  const { copy } = useLanguage();
  const translatedDescription =
    copy.projects.items[project.id as keyof typeof copy.projects.items] ??
    project.description;
  const projectHref = getProjectDetailHref(project.github) ?? project.github;
  const openProject = () => {
    if (projectHref) router.push(projectHref);
  };

  return (
    <motion.article
      className={cn(
        "group relative flex flex-col justify-between border border-border p-4 sm:p-6 md:p-10 lg:p-12",
        projectHref && "cursor-pointer"
      )}
      role={projectHref ? "link" : undefined}
      tabIndex={projectHref ? 0 : undefined}
      onClick={openProject}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProject();
        }
      }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
    >
      <div>
        <div className="mb-4 flex items-start justify-between gap-3 sm:mb-6 md:mb-8">
          <h3 className="text-lg font-medium tracking-tight text-foreground sm:text-xl md:text-3xl">
            {project.title}
          </h3>
          <ArrowUpRight
            className="h-5 w-5 shrink-0 text-muted opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100"
            aria-hidden="true"
          />
        </div>
        <p className="max-w-lg text-xs leading-relaxed text-muted sm:text-sm md:text-base">{translatedDescription}</p>
        <div className="mt-4 flex flex-wrap gap-1.5 sm:mt-6 sm:gap-2">
          {project.tech.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border px-2 py-0.5 text-[10px] text-muted sm:px-2.5 sm:py-1 sm:text-[11px] md:px-3 md:text-xs"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2 sm:mt-8 sm:gap-3 md:mt-10 md:gap-4">
        {projectHref && (
          <Link
            href={projectHref}
            onClick={(event) => event.stopPropagation()}
            className={cn(
              "group/btn inline-flex items-center gap-1.5 border border-border px-3 py-2 sm:gap-2 sm:px-4 sm:py-2.5 md:px-5",
              "text-[10px] uppercase tracking-[0.12em] text-foreground transition-all duration-300 sm:text-xs",
              "hover:border-foreground/40 hover:bg-foreground hover:text-background"
            )}
          >
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            Details
          </Link>
        )}
        {project.demo && (
          <Link
            href={project.demo}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => event.stopPropagation()}
            className={cn(
              "group/btn inline-flex items-center gap-1.5 border border-border px-3 py-2 sm:gap-2 sm:px-4 sm:py-2.5 md:px-5",
              "text-[10px] uppercase tracking-[0.12em] text-foreground transition-all duration-300 sm:text-xs",
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
