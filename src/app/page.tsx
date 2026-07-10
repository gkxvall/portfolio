import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";
import { Experience } from "@/components/sections/experience";
import { GitHubSection } from "@/components/sections/github";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { Ticker } from "@/components/layout/ticker";
import { getFallbackGitHubStats, getGitHubStats } from "@/lib/github";
import { siteConfig } from "@/lib/data";

export default async function Home() {
  const githubStats =
    (await getGitHubStats(siteConfig.githubUsername)) ??
    getFallbackGitHubStats(siteConfig.githubUsername);

  return (
    <>
      <Hero />
      <Ticker />
      <About />
      <Projects />
      <Experience />
      <Skills />
      <GitHubSection stats={githubStats} />
      <Contact />
    </>
  );
}
