"use client";

import { motion } from "framer-motion";
import type { GitHubCommit } from "@/lib/github";
import { useLanguage } from "@/lib/i18n";

const WEEK_COUNT = 16;
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export function RepoCommitGraph({ commits }: { commits: GitHubCommit[] }) {
  const { copy } = useLanguage();
  const validDates = commits
    .map((commit) => new Date(commit.commit.author.date))
    .filter((date) => !Number.isNaN(date.getTime()));
  const latestTime = Math.max(...validDates.map((date) => date.getTime()), Date.now());
  const end = new Date(latestTime);
  end.setHours(23, 59, 59, 999);
  const startTime = end.getTime() - WEEK_COUNT * WEEK_MS;
  const weeks = Array.from({ length: WEEK_COUNT }, () => 0);

  validDates.forEach((date) => {
    const index = Math.floor((date.getTime() - startTime) / WEEK_MS);
    if (index >= 0 && index < WEEK_COUNT) weeks[index] += 1;
  });

  const max = Math.max(...weeks, 1);

  return (
    <div className="border border-border p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.12em] text-muted">
          {copy.projectDetails.commitActivity}
        </p>
        <p className="text-[10px] uppercase tracking-[0.12em] text-muted">
          {copy.projectDetails.lastWeeks}
        </p>
      </div>
      <div className="flex h-24 items-end gap-1.5" role="img" aria-label={copy.projectDetails.commitActivity}>
        {weeks.map((count, index) => (
          <motion.div
            key={index}
            className="min-w-0 flex-1 origin-bottom rounded-t-md bg-foreground"
            style={{ height: count === 0 ? 2 : `${Math.max(10, (count / max) * 100)}%` }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: count === 0 ? 0.2 : 1 }}
            transition={{
              duration: 0.65,
              delay: index * 0.035,
              ease: [0.22, 1, 0.36, 1],
            }}
            title={`${count} ${copy.projectDetails.commits}`}
          />
        ))}
      </div>
    </div>
  );
}
