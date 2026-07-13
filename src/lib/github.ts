export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
  updated_at: string;
}

export interface GitHubRepoDetail extends GitHubRepo {
  full_name: string;
  default_branch: string;
  forks_count: number;
  open_issues_count: number;
  pushed_at: string;
  created_at: string;
  homepage: string | null;
  topics?: string[];
}

export interface GitHubTreeItem {
  path: string;
  type: "blob" | "tree" | "commit";
  size?: number;
  url: string;
}

export interface GitHubContributor {
  login: string;
  avatar_url: string;
  html_url: string;
  contributions: number;
}

export interface GitHubCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
  author: {
    login: string;
    avatar_url: string;
    html_url: string;
  } | null;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  public_repos: number;
  followers: number;
  html_url: string;
}

export interface GitHubContributionDay {
  date: string;
  contributionCount: number;
}

export interface GitHubStats {
  user: GitHubUser;
  pinnedRepos: GitHubRepo[];
  recentRepos: GitHubRepo[];
  languages: { name: string; count: number }[];
  contributions: GitHubContributionDay[];
}

export interface GitHubRepoDetails {
  repo: GitHubRepoDetail;
  readme: string | null;
  renderedReadmeHtml: string | null;
  tree: GitHubTreeItem[];
  contributors: GitHubContributor[];
  commits: GitHubCommit[];
  languages: { name: string; bytes: number }[];
}

interface GitHubContributionsResponse {
  data?: {
    user?: {
      contributionsCollection?: {
        contributionCalendar?: {
          weeks: {
            contributionDays: GitHubContributionDay[];
          }[];
        };
      };
    };
  };
}

interface GitHubReadmeResponse {
  content: string;
  encoding: string;
}

interface GitHubTreeResponse {
  tree: GitHubTreeItem[];
}

async function fetchGitHub<T>(url: string): Promise<T | null> {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;
    return response.json() as Promise<T>;
  } catch {
    return null;
  }
}

function decodeBase64(content: string) {
  return Buffer.from(content.replace(/\n/g, ""), "base64").toString("utf8");
}

function isAbsoluteUrl(value: string) {
  return /^(https?:|mailto:|tel:|data:|#)/i.test(value);
}

function resolveReadmeAssetUrl({
  value,
  owner,
  repo,
  branch,
  kind,
}: {
  value: string;
  owner: string;
  repo: string;
  branch: string;
  kind: "src" | "href";
}) {
  if (isAbsoluteUrl(value)) return value;

  const cleanedValue = value.replace(/^\.?\//, "");
  const encodedValue = encodeURI(cleanedValue);

  if (kind === "src") {
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${encodedValue}`;
  }

  return `https://github.com/${owner}/${repo}/blob/${branch}/${encodedValue}`;
}

function rewriteReadmeHtmlUrls({
  html,
  owner,
  repo,
  branch,
}: {
  html: string;
  owner: string;
  repo: string;
  branch: string;
}) {
  return html.replace(
    /\s(src|href)="([^"]+)"/g,
    (match, attribute: "src" | "href", value: string) => {
      return ` ${attribute}="${resolveReadmeAssetUrl({
        value,
        owner,
        repo,
        branch,
        kind: attribute,
      })}"`;
    }
  );
}

function highlightCode(code: string) {
  const keywords = new Set([
    "import",
    "from",
    "as",
    "def",
    "class",
    "return",
    "if",
    "else",
    "elif",
    "for",
    "while",
    "try",
    "except",
    "with",
    "in",
    "is",
    "not",
    "and",
    "or",
    "None",
    "True",
    "False",
    "const",
    "let",
    "var",
    "function",
    "async",
    "await",
    "export",
    "default",
    "type",
    "interface",
    "new",
    "throw",
    "catch",
    "public",
    "private",
    "protected",
    "static",
    "void",
    "int",
    "float",
    "double",
    "string",
    "boolean",
    "null",
    "undefined",
    "echo",
    "cd",
    "ls",
    "mkdir",
    "rm",
    "cp",
    "mv",
    "cat",
    "grep",
    "find",
    "curl",
    "wget",
    "git",
    "npm",
    "pnpm",
    "yarn",
    "pip",
    "python",
    "python3",
    "node",
    "docker",
    "sudo",
  ]);
  const tokenPattern =
    /(&quot;[^&]*(?:&(?!quot;)[^&]*)*&quot;|"[^"\n]*"|'[^'\n]*'|`[^`\n]*`|#.*?(?=\n|$)|\/\/.*?(?=\n|$)|\/\*[\s\S]*?\*\/|(?:^|[\s;&|])(--?[A-Za-z0-9][\w-]*)|\$[A-Za-z_][\w]*|\b(?:import|from|as|def|class|return|if|else|elif|for|while|then|fi|do|done|case|esac|try|except|with|in|is|not|and|or|None|True|False|const|let|var|function|async|await|export|default|type|interface|return|new|throw|catch|public|private|protected|static|void|int|float|double|string|boolean|null|undefined|echo|cd|ls|mkdir|rm|cp|mv|cat|grep|find|curl|wget|git|npm|pnpm|yarn|pip|python|python3|node|docker|sudo)\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][\w]*(?=\())/gm;

  return code.replace(tokenPattern, (token) => {
    const leadingSpace = token.match(/^[\s;&|]+/)?.[0] ?? "";
    const cleanToken = token.slice(leadingSpace.length);

    if (
      cleanToken.startsWith("#") ||
      cleanToken.startsWith("//") ||
      cleanToken.startsWith("/*")
    ) {
      return `<span class="code-comment">${token}</span>`;
    }

    if (
      cleanToken.startsWith("\"") ||
      cleanToken.startsWith("'") ||
      cleanToken.startsWith("`") ||
      cleanToken.startsWith("&quot;")
    ) {
      return `<span class="code-string">${token}</span>`;
    }

    if (cleanToken.startsWith("$") || cleanToken.startsWith("-")) {
      return `${leadingSpace}<span class="code-variable">${cleanToken}</span>`;
    }

    if (/^\d/.test(cleanToken)) {
      return `<span class="code-number">${token}</span>`;
    }

    if (!keywords.has(cleanToken) && /^[A-Za-z_]/.test(cleanToken)) {
      return `<span class="code-function">${token}</span>`;
    }

    return `${leadingSpace}<span class="code-keyword">${cleanToken}</span>`;
  });
}

function highlightReadmeCodeBlocks(html: string) {
  return html.replace(/<pre([^>]*)>([\s\S]*?)<\/pre>/g, (_match, preAttrs, body) => {
    const codeMatch = body.match(/^<code([^>]*)>([\s\S]*?)<\/code>$/);
    const codeAttributes = codeMatch?.[1] ?? "";
    const code = codeMatch?.[2] ?? body;

    if (/\b(?:language-mermaid|lang-mermaid)\b/i.test(codeAttributes)) {
      return `<pre${preAttrs} data-mermaid-source><code${codeAttributes}>${code}</code></pre>`;
    }

    return `<pre${preAttrs}><code${codeAttributes}>${highlightCode(
      code
    )}</code></pre>`;
  });
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function extractMermaidBlocks(markdown: string) {
  const blocks: string[] = [];
  const text = markdown.replace(
    /```mermaid\s*\n([\s\S]*?)```/gi,
    (_match, source: string) => {
      const index = blocks.push(source.trim()) - 1;
      return `\n\nMERMAIDBLOCKTOKEN${index}ENDTOKEN\n\n`;
    }
  );

  return { text, blocks };
}

function restoreMermaidBlocks(html: string, blocks: string[]) {
  return blocks.reduce((result, source, index) => {
    const token = `MERMAIDBLOCKTOKEN${index}ENDTOKEN`;
    const diagram = `<pre data-mermaid-source><code>${escapeHtml(source)}</code></pre>`;
    return result
      .replace(`<p>${token}</p>`, diagram)
      .replace(token, diagram);
  }, html);
}

async function renderGitHubMarkdown({
  markdown,
  owner,
  repo,
  branch,
}: {
  markdown: string;
  owner: string;
  repo: string;
  branch: string;
}) {
  try {
    const mermaid = extractMermaidBlocks(markdown);
    const headers: HeadersInit = {
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    };

    if (process.env.GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
    }

    const response = await fetch("https://api.github.com/markdown", {
      method: "POST",
      headers,
      body: JSON.stringify({
        text: mermaid.text,
        mode: "gfm",
        context: `${owner}/${repo}`,
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const html = await response.text();
    return restoreMermaidBlocks(
      highlightReadmeCodeBlocks(
        rewriteReadmeHtmlUrls({ html, owner, repo, branch })
      ),
      mermaid.blocks
    );
  } catch {
    return null;
  }
}

async function fetchGitHubContributions(
  username: string
): Promise<GitHubContributionDay[] | null> {
  if (!process.env.GITHUB_TOKEN) return null;

  try {
    const response = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
      },
      body: JSON.stringify({
        query: `
          query UserContributions($login: String!) {
            user(login: $login) {
              contributionsCollection {
                contributionCalendar {
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { login: username },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const payload = (await response.json()) as GitHubContributionsResponse;
    const weeks =
      payload.data?.user?.contributionsCollection?.contributionCalendar?.weeks;

    if (!weeks) return null;

    return weeks
      .flatMap((week) => week.contributionDays)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-31);
  } catch {
    return null;
  }
}

export async function getGitHubStats(username: string): Promise<GitHubStats | null> {
  const [user, repos, contributions] = await Promise.all([
    fetchGitHub<GitHubUser>(`https://api.github.com/users/${username}`),
    fetchGitHub<GitHubRepo[]>(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
    ),
    fetchGitHubContributions(username),
  ]);

  if (!user || !repos) return null;

  const nonForkRepos = repos.filter((repo) => !repo.fork);
  const pinnedRepos = [...nonForkRepos]
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 6);
  const recentRepos = nonForkRepos.slice(0, 6);

  const languageCounts = new Map<string, number>();
  for (const repo of nonForkRepos) {
    if (repo.language) {
      languageCounts.set(repo.language, (languageCounts.get(repo.language) ?? 0) + 1);
    }
  }

  const languages = Array.from(languageCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  return {
    user,
    pinnedRepos,
    recentRepos,
    languages,
    contributions: contributions ?? [],
  };
}

export async function getGitHubRepoDetails(
  owner: string,
  repoName: string
): Promise<GitHubRepoDetails | null> {
  const repoUrl = `https://api.github.com/repos/${encodeURIComponent(
    owner
  )}/${encodeURIComponent(repoName)}`;
  const repo = await fetchGitHub<GitHubRepoDetail>(repoUrl);

  if (!repo) return null;

  const [readmeResponse, treeResponse, contributors, commits, languageMap] =
    await Promise.all([
      fetchGitHub<GitHubReadmeResponse>(`${repoUrl}/readme`),
      fetchGitHub<GitHubTreeResponse>(
        `${repoUrl}/git/trees/${encodeURIComponent(
          repo.default_branch
        )}?recursive=1`
      ),
      fetchGitHub<GitHubContributor[]>(`${repoUrl}/contributors?per_page=10`),
      fetchGitHub<GitHubCommit[]>(`${repoUrl}/commits?per_page=100`),
      fetchGitHub<Record<string, number>>(`${repoUrl}/languages`),
    ]);

  const languages = Object.entries(languageMap ?? {})
    .map(([name, bytes]) => ({ name, bytes }))
    .sort((a, b) => b.bytes - a.bytes);
  const readme =
    readmeResponse?.encoding === "base64"
      ? decodeBase64(readmeResponse.content)
      : null;
  const renderedReadmeHtml = readme
    ? await renderGitHubMarkdown({
        markdown: readme,
        owner,
        repo: repo.name,
        branch: repo.default_branch,
      })
    : null;

  return {
    repo,
    readme,
    renderedReadmeHtml,
    tree: treeResponse?.tree ?? [],
    contributors: contributors ?? [],
    commits: commits ?? [],
    languages,
  };
}

export function getFallbackGitHubStats(username: string): GitHubStats {
  return {
    user: {
      login: username,
      name: null,
      avatar_url: `https://avatars.githubusercontent.com/${username}`,
      public_repos: 0,
      followers: 0,
      html_url: `https://github.com/${username}`,
    },
    pinnedRepos: [],
    recentRepos: [],
    languages: [],
    contributions: [],
  };
}
