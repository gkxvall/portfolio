"use client";

import { projects } from "@/lib/data";
import { Section, SectionHeading } from "@/components/ui/section";
import { ProjectCard } from "@/components/ui/project-card";
import { useLanguage } from "@/lib/i18n";

export function Projects() {
  const { copy } = useLanguage();

  return (
    <Section id="projects">
      <div className="grid-layout">
        <SectionHeading
          title={copy.projects.title}
          subtitle={copy.projects.subtitle}
        />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </Section>
  );
}
