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

export interface GitHubStats {
  user: GitHubUser;
  pinnedRepos: GitHubRepo[];
  recentRepos: GitHubRepo[];
  languages: { name: string; count: number }[];
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

export async function getGitHubStats(username: string): Promise<GitHubStats | null> {
  const [user, repos] = await Promise.all([
    fetchGitHub<GitHubUser>(`https://api.github.com/users/${username}`),
    fetchGitHub<GitHubRepo[]>(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`
    ),
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
  };
}
