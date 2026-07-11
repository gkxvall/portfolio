import {
  ArrowLeft,
  ExternalLink,
  GitCommitHorizontal,
  GitFork,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGitHubRepoDetails } from "@/lib/github";
import { getProjectLiveUrl } from "@/lib/project-links";
import { cn } from "@/lib/utils";
import { FileTree } from "@/components/ui/file-tree";
import { ReadmeDisclosure } from "@/components/ui/readme-disclosure";
import { ProjectDetailText } from "@/components/ui/project-detail-text";
import { RepoCommitGraph } from "@/components/ui/repo-commit-graph";

interface ProjectDetailsPageProps {
  params: Promise<{
    owner: string;
    repo: string;
  }>;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function ProjectDetailsPage({
  params,
}: ProjectDetailsPageProps) {
  const { owner, repo } = await params;
  const details = await getGitHubRepoDetails(
    decodeURIComponent(owner),
    decodeURIComponent(repo)
  );

  if (!details) notFound();

  const totalLanguageBytes = details.languages.reduce(
    (sum, language) => sum + language.bytes,
    0
  );
  const visibleTree = details.tree
    .filter((item) => !item.path.includes("node_modules/"))
    .slice(0, 140);
  const liveProjectUrl = getProjectLiveUrl(
    decodeURIComponent(owner),
    details.repo.name,
    details.repo.homepage
  );

  return (
    <main className="min-h-screen bg-background pt-28 pb-24 md:pt-32">
      <div className="grid-layout">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <ProjectDetailText textKey="backToProjects" />
        </Link>

        <section className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col lg:col-span-8">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              {details.repo.full_name}
            </p>
            <h1 className="mt-3 text-display-md font-medium text-foreground">
              {details.repo.name}
            </h1>
            {details.repo.description && (
              <p className="mt-5 max-w-3xl text-base leading-relaxed text-muted md:text-lg">
                {details.repo.description}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={details.repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-xs uppercase tracking-[0.12em] transition-colors hover:border-foreground/40 hover:bg-foreground hover:text-background"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                <ProjectDetailText textKey="openOnGithub" />
              </Link>
              {liveProjectUrl && (
                <Link
                  href={liveProjectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-xs uppercase tracking-[0.12em] transition-colors hover:border-foreground/40 hover:bg-foreground hover:text-background"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <ProjectDetailText textKey="liveProject" />
                </Link>
              )}
            </div>

            <div className="mt-10 lg:mt-auto lg:pt-10">
              <RepoCommitGraph commits={details.commits} />
            </div>
          </div>

          <aside className="grid gap-4 text-sm lg:col-span-4">
            <div className="grid grid-cols-2 gap-3">
              <Stat icon={Star} label={<ProjectDetailText textKey="stars" />} value={details.repo.stargazers_count} />
              <Stat icon={GitFork} label={<ProjectDetailText textKey="forks" />} value={details.repo.forks_count} />
              <Stat
                icon={GitCommitHorizontal}
                label={<ProjectDetailText textKey="updated" />}
                value={formatDate(details.repo.pushed_at)}
              />
              <Stat
                icon={Users}
                label={<ProjectDetailText textKey="contributors" />}
                value={details.contributors.length}
              />
            </div>

            {details.repo.topics && details.repo.topics.length > 0 && (
              <div className="border border-border p-4">
                <p className="mb-3 text-xs uppercase tracking-[0.12em] text-muted">
                  <ProjectDetailText textKey="topics" />
                </p>
                <div className="flex flex-wrap gap-2">
                  {details.repo.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </section>

        <section className="mt-16 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Panel title={<ProjectDetailText textKey="languages" />} className="lg:col-span-5">
            {details.languages.length > 0 ? (
              <div className="space-y-4">
                {details.languages.map((language) => {
                  const percent =
                    totalLanguageBytes > 0
                      ? (language.bytes / totalLanguageBytes) * 100
                      : 0;

                  return (
                    <div key={language.name}>
                      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
                        <span className="text-foreground">{language.name}</span>
                        <span className="text-muted">
                          {percent.toFixed(1)}% · {formatBytes(language.bytes)}
                        </span>
                      </div>
                      <div className="h-1.5 bg-border">
                        <div
                          className="h-full bg-foreground"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState><ProjectDetailText textKey="noLanguages" /></EmptyState>
            )}
          </Panel>

          <Panel title={<ProjectDetailText textKey="contributors" />} className="lg:col-span-7">
            {details.contributors.length > 0 ? (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {details.contributors.map((contributor) => (
                  <Link
                    key={contributor.login}
                    href={contributor.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-4 border border-border p-3 transition-colors hover:border-foreground/30"
                  >
                    <span className="text-sm text-foreground">
                      {contributor.login}
                    </span>
                    <span className="text-xs text-muted">
                      {contributor.contributions} commits
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState><ProjectDetailText textKey="noContributors" /></EmptyState>
            )}
          </Panel>
        </section>

        <section className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <Panel
            title={<ProjectDetailText textKey="fileStructure" />}
            className="min-h-0 lg:relative lg:col-span-5 lg:h-full lg:overflow-hidden"
          >
            {visibleTree.length > 0 ? (
              <FileTree items={visibleTree} />
            ) : (
              <EmptyState><ProjectDetailText textKey="noFileTree" /></EmptyState>
            )}
          </Panel>

          <Panel title={<ProjectDetailText textKey="recentCommits" />} className="lg:col-span-7">
            {details.commits.length > 0 ? (
              <div className="space-y-3">
                {details.commits.slice(0, 7).map((commit) => (
                  <Link
                    key={commit.sha}
                    href={commit.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-border p-4 transition-colors hover:border-foreground/30"
                  >
                    <p className="line-clamp-2 text-sm text-foreground">
                      {commit.commit.message}
                    </p>
                    <p className="mt-2 text-xs text-muted">
                      {commit.author?.login ?? commit.commit.author.name} ·{" "}
                      {formatDate(commit.commit.author.date)} ·{" "}
                      {commit.sha.slice(0, 7)}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState><ProjectDetailText textKey="noCommits" /></EmptyState>
            )}
          </Panel>
        </section>

        <ReadmeDisclosure>
          <div className="readme-collapse">
            <div className="readme-collapse-inner border-t border-border px-8 py-8 md:px-16 lg:px-24 xl:px-32">
              {details.renderedReadmeHtml ? (
                <div
                  className="readme-content mx-auto w-full max-w-5xl"
                  dangerouslySetInnerHTML={{ __html: details.renderedReadmeHtml }}
                />
              ) : (
                <div className="mx-auto w-full max-w-5xl">
                  <EmptyState><ProjectDetailText textKey="noReadme" /></EmptyState>
                </div>
              )}
            </div>
          </div>
        </ReadmeDisclosure>
      </div>
    </main>
  );
}

function Panel({
  title,
  className,
  children,
}: {
  title: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("border border-border p-5 md:p-6", className)}>
      <h2 className="mb-5 text-xs uppercase tracking-[0.14em] text-muted">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  label: React.ReactNode;
  value: string | number;
}) {
  return (
    <div className="border border-border p-4">
      <Icon className="mb-4 h-4 w-4 text-muted" aria-hidden={true} />
      <p className="text-sm text-foreground">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
    </div>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <p className="text-sm text-muted">{children}</p>;
}
