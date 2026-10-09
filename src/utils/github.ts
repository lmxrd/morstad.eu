import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const CACHE_FILE = join(process.cwd(), "node_modules", ".cache", "github-stars.json");

type Cache = Record<string, { stars: number; fetched: number }>;

function loadCache(): Cache {
  try {
    if (existsSync(CACHE_FILE)) {
      return JSON.parse(readFileSync(CACHE_FILE, "utf-8"));
    }
  } catch {}
  return {};
}

function saveCache(cache: Cache) {
  try {
    mkdirSync(dirname(CACHE_FILE), { recursive: true });
    writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch {}
}

const PLACEHOLDER_STARS: Record<string, number> = {
  "lmxrd/deno-nessie": 142,
  "lmxrd/oak-middleware-jwt": 28,
  "lmxrd/deno_argon2": 15,
  "lmxrd/js-helpers": 12,
  "lmxrd/deno-workspaces": 8,
  "lmxrd/docker-custom-images": 5,
  "lmxrd/go-domeneshop-client": 3,
  "lmxrd/terraform-provider-domeneshop": 2,
  "lmxrd/github-action-tag-release": 4,
  "lmxrd/git-backup": 7,
  "lmxrd/habit-tracker": 2,
  "lmxrd/morstad.eu": 3,
  "lmxrd/munchkin-buddy": 1,
  "lmxrd/c-checkers": 1,
  "lmxrd/js-chess-has-quirks": 1,
  "lmxrd/parcel-reporter-ip": 2,
  "lmxrd/package-translation-fetch": 1,
  "lmxrd/virtual-assistant": 1,
  "codash-platform/codash": 0,
  "SocialSlam/social-slam-frontend": 0,
  "CodeChroma/gmtk_2020": 0,
};

function extractRepoPath(url: string): string | null {
  const match = url.match(/github\.com\/([^/]+\/[^/]+?)(?:\/|$)/);
  return match ? match[1] : null;
}

export async function getGitHubStars(url: string): Promise<number | null> {
  const repoPath = extractRepoPath(url);
  if (!repoPath) return null;

  const cache = loadCache();
  const cached = cache[repoPath];
  const CACHE_TTL = 1000 * 60 * 60; // 1 hour

  if (cached && Date.now() - cached.fetched < CACHE_TTL) {
    return cached.stars;
  }

  const isDev = import.meta.env.DEV;

  try {
    const res = await fetch(`https://api.github.com/repos/${repoPath}`, {
      headers: { "User-Agent": "morstad.eu" },
    });
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    const data = (await res.json()) as { stargazers_count: number };
    cache[repoPath] = { stars: data.stargazers_count, fetched: Date.now() };
    saveCache(cache);
    return data.stargazers_count;
  } catch {
    // Fallback: use cache if available, otherwise placeholder (dev) or null (prod)
    if (cached) return cached.stars;
    if (isDev) return PLACEHOLDER_STARS[repoPath] ?? null;
    return null;
  }
}
