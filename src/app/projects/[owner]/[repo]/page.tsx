import {
  ArrowLeft,
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

interface MarkdownContext {
  owner: string;
  repo: string;
  branch: string;
}

function resolveMarkdownImageUrl(src: string, context: MarkdownContext) {
  if (/^(https?:|data:)/.test(src)) return src;
  if (src.startsWith("/")) {
    return `https://raw.githubusercontent.com/${context.owner}/${context.repo}/${context.branch}${src}`;
  }

  return `https://raw.githubusercontent.com/${context.owner}/${context.repo}/${context.branch}/${src}`;
}

function resolveMarkdownLinkUrl(href: string, context: MarkdownContext) {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
  if (href.startsWith("/")) {
    return `https://github.com/${context.owner}/${context.repo}/blob/${context.branch}${href}`;
  }

  return `https://github.com/${context.owner}/${context.repo}/blob/${context.branch}/${href}`;
}

function stripMarkdownMarks(value: string) {
  return value
    .replace(/^#+\s*/, "")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .trim();
}

function MarkdownHeading({
  level,
  children,
}: {
  level: number;
  children: React.ReactNode;
}) {
  const className = cn(
    "text-foreground",
    level <= 1
      ? "pt-4 text-3xl font-medium"
      : level === 2
        ? "pt-4 text-2xl font-medium"
        : "pt-2 text-xl font-medium"
  );

  if (level <= 1) return <h2 className={className}>{children}</h2>;
  if (level === 2) return <h3 className={className}>{children}</h3>;
  return <h4 className={className}>{children}</h4>;
}

function renderInlineMarkdown(text: string, context: MarkdownContext) {
  const nodes: React.ReactNode[] = [];
  const pattern =
    /!\[([^\]]*)\]\(([^)]+)\)|\[([^\]]+)\]\(([^)]+)\)|`([^`]+)`|\*\*([^*]+)\*\*/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text))) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));

    if (match[1] !== undefined && match[2]) {
      nodes.push(
        <img
          key={`image-${match.index}`}
          src={resolveMarkdownImageUrl(match[2], context)}
          alt={match[1]}
          className="my-6 max-h-[680px] w-auto max-w-full border border-border object-contain"
          loading="lazy"
        />
      );
    } else if (match[3] !== undefined && match[4]) {
      nodes.push(
        <Link
          key={`link-${match.index}`}
          href={resolveMarkdownLinkUrl(match[4], context)}
          target={match[4].startsWith("#") ? undefined : "_blank"}
          rel={match[4].startsWith("#") ? undefined : "noopener noreferrer"}
          className="text-foreground underline underline-offset-4"
        >
          {stripMarkdownMarks(match[3])}
        </Link>
      );
    } else if (match[5] !== undefined) {
      nodes.push(
        <code
          key={`code-${match.index}`}
          className="border border-border px-1.5 py-0.5 text-foreground"
        >
          {match[5]}
        </code>
      );
    } else if (match[6] !== undefined) {
      nodes.push(
        <strong key={`strong-${match.index}`} className="text-foreground">
          {match[6]}
        </strong>
      );
    }

    cursor = match.index + match[0].length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));

  return nodes.length > 0 ? nodes : stripMarkdownMarks(text);
}

function MarkdownReadme({
  content,
  context,
}: {
  content: string;
  context: MarkdownContext;
}) {
  const blocks: React.ReactNode[] = [];
  const lines = content.replace(/\r\n/g, "\n").split("\n");
  let paragraph: string[] = [];
  let list: string[] = [];
  let code: string[] = [];
  let inCode = false;

  function flushParagraph() {
    if (paragraph.length === 0) return;

    const text = paragraph.join(" ").trim();
    paragraph = [];
    if (!text) return;

    blocks.push(
      <p key={`paragraph-${blocks.length}`} className="leading-relaxed text-muted">
        {renderInlineMarkdown(text, context)}
      </p>
    );
  }

  function flushList() {
    if (list.length === 0) return;

    blocks.push(
      <ul
        key={`list-${blocks.length}`}
        className="list-disc space-y-2 pl-5 text-muted"
      >
        {list.map((item, index) => (
          <li key={`${item}-${index}`}>{renderInlineMarkdown(item, context)}</li>
        ))}
      </ul>
    );
    list = [];
  }

  function flushCode() {
    if (code.length === 0) return;

    blocks.push(
      <pre
        key={`code-${blocks.length}`}
        className="overflow-x-auto border border-border bg-foreground/[0.03] p-4 text-xs leading-relaxed text-foreground"
      >
        <code>{code.join("\n")}</code>
      </pre>
    );
    code = [];
  }

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushParagraph();
        flushList();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      code.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph();
      flushList();
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      const level = heading[1].length;

      blocks.push(
        <MarkdownHeading key={`heading-${blocks.length}`} level={level}>
          {stripMarkdownMarks(heading[2])}
        </MarkdownHeading>
      );
      continue;
    }

    const unordered = line.match(/^\s*[-*]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      flushParagraph();
      list.push((unordered?.[1] ?? ordered?.[1] ?? "").trim());
      continue;
    }

    if (line.trim().startsWith(">")) {
      flushParagraph();
      flushList();
      blocks.push(
        <blockquote
          key={`quote-${blocks.length}`}
          className="border-l border-border pl-4 text-muted"
        >
          {renderInlineMarkdown(line.replace(/^>\s?/, ""), context)}
        </blockquote>
      );
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  flushList();
  flushCode();

  return <div className="space-y-5 text-sm md:text-base">{blocks}</div>;
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
  const markdownContext = {
    owner: details.repo.full_name.split("/")[0],
    repo: details.repo.name,
    branch: details.repo.default_branch,
  };

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

        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <Panel title="File Structure" className="lg:col-span-5">
            {visibleTree.length > 0 ? (
              <div className="max-h-[620px] overflow-auto pr-2">
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
                {details.commits.map((commit) => (
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

        <section className="mt-12 max-w-4xl">
          <h2 className="mb-6 text-xs uppercase tracking-[0.14em] text-muted">
            README
          </h2>
          {details.readme ? (
            <MarkdownReadme content={details.readme} context={markdownContext} />
          ) : (
            <EmptyState>No README found.</EmptyState>
          )}
        </section>
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
