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
        text: markdown,
        mode: "gfm",
        context: `${owner}/${repo}`,
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) return null;

    const html = await response.text();
    return rewriteReadmeHtmlUrls({ html, owner, repo, branch });
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
      fetchGitHub<GitHubCommit[]>(`${repoUrl}/commits?per_page=8`),
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
