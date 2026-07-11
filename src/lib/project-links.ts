export function parseGitHubRepoUrl(url?: string | null) {
  if (!url) return null;

  try {
    const parsedUrl = new URL(url);
    if (!parsedUrl.hostname.includes("github.com")) return null;

    const [owner, repo] = parsedUrl.pathname
      .replace(/^\/|\/$/g, "")
      .split("/");

    if (!owner || !repo) return null;

    return {
      owner,
      repo: repo.replace(/\.git$/, ""),
    };
  } catch {
    return null;
  }
}

export function getProjectDetailHref(url?: string | null) {
  const repo = parseGitHubRepoUrl(url);
  if (!repo) return null;

  return `/projects/${encodeURIComponent(repo.owner)}/${encodeURIComponent(
    repo.repo
  )}`;
}

export function getProjectDetailHrefFromParts(owner: string, repo: string) {
  return `/projects/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`;
}

const liveProjectOverrides: Record<string, string> = {
  "gkxvall/mlsanity": "https://mlsanity-web.onrender.com",
  "gkxvall/portfolio": "https://valldev.vercel.app",
};

export function getProjectLiveUrl(
  owner: string,
  repo: string,
  fallback?: string | null
) {
  return liveProjectOverrides[`${owner}/${repo}`.toLowerCase()] ?? fallback ?? null;
}
