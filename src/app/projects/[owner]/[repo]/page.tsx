import {
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  FileText,
  Folder,
  GitCommitHorizontal,
  GitFork,
  Star,
  Users,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getGitHubRepoDetails } from "@/lib/github";
import { cn } from "@/lib/utils";

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

function getTreeDepth(path: string) {
  return Math.min(path.split("/").length - 1, 5);
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

  return (
    <main className="min-h-screen bg-background pt-28 pb-24 md:pt-32">
      <div className="grid-layout">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to projects
        </Link>

        <section className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
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
                Open on GitHub
              </Link>
              {details.repo.homepage && (
                <Link
                  href={details.repo.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border border-border px-4 py-2.5 text-xs uppercase tracking-[0.12em] transition-colors hover:border-foreground/40 hover:bg-foreground hover:text-background"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  Live project
                </Link>
              )}
            </div>
          </div>

          <aside className="grid gap-4 text-sm lg:col-span-4">
            <div className="grid grid-cols-2 gap-3">
              <Stat icon={Star} label="Stars" value={details.repo.stargazers_count} />
              <Stat icon={GitFork} label="Forks" value={details.repo.forks_count} />
              <Stat
                icon={GitCommitHorizontal}
                label="Updated"
                value={formatDate(details.repo.pushed_at)}
              />
              <Stat
                icon={Users}
                label="Contributors"
                value={details.contributors.length}
              />
            </div>

            {details.repo.topics && details.repo.topics.length > 0 && (
              <div className="border border-border p-4">
                <p className="mb-3 text-xs uppercase tracking-[0.12em] text-muted">
                  Topics
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
          <Panel title="Languages" className="lg:col-span-5">
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
              <EmptyState>No language data available.</EmptyState>
            )}
          </Panel>

          <Panel title="Contributors" className="lg:col-span-7">
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
              <EmptyState>No contributor data available.</EmptyState>
            )}
          </Panel>
        </section>

        <section className="mt-6 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          <Panel
            title="File Structure"
            className="min-h-0 lg:relative lg:col-span-5 lg:h-full lg:overflow-hidden"
          >
            {visibleTree.length > 0 ? (
              <div className="file-tree-scrollbar max-h-[620px] min-h-0 overflow-y-auto overflow-x-hidden pr-1 lg:absolute lg:inset-x-6 lg:bottom-6 lg:top-[59px] lg:max-h-none">
                {visibleTree.map((item) => {
                  const isFolder = item.type === "tree";
                  const depth = getTreeDepth(item.path);
                  const name = item.path.split("/").at(-1) ?? item.path;

                  return (
                    <div
                      key={item.path}
                      className="flex items-center gap-2 py-1.5 text-xs text-muted"
                      style={{ paddingLeft: `${depth * 14}px` }}
                      title={item.path}
                    >
                      {isFolder ? (
                        <Folder
                          className="h-3.5 w-3.5 shrink-0 text-foreground"
                          aria-hidden="true"
                        />
                      ) : (
                        <FileText
                          className="h-3.5 w-3.5 shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <span className="truncate">{name}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <EmptyState>No file tree available.</EmptyState>
            )}
          </Panel>

          <Panel title="Recent Commits" className="lg:col-span-7">
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
              <EmptyState>No recent commits available.</EmptyState>
            )}
          </Panel>
        </section>

        <details className="group mt-12 w-full border border-border">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-xs uppercase tracking-[0.14em] text-muted transition-colors hover:text-foreground md:px-6 [&::-webkit-details-marker]:hidden">
            <span>README</span>
            <ChevronDown
              className="h-4 w-4 transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="readme-collapse">
            <div className="readme-collapse-inner border-t border-border px-6 py-8 md:px-14 lg:px-20 xl:px-28">
              {details.renderedReadmeHtml ? (
                <div
                  className="readme-content mx-auto w-full max-w-5xl"
                  dangerouslySetInnerHTML={{ __html: details.renderedReadmeHtml }}
                />
              ) : (
                <div className="mx-auto w-full max-w-5xl">
                  <EmptyState>No README found.</EmptyState>
                </div>
              )}
            </div>
          </div>
        </details>
      </div>
    </main>
  );
}

function Panel({
  title,
  className,
  children,
}: {
  title: string;
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
  label: string;
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
