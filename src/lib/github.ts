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
