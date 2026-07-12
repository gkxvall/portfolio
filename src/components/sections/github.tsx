"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Star } from "lucide-react";
import Link from "next/link";
import type { GitHubContributionDay, GitHubStats } from "@/lib/github";
import { Section, SectionHeading } from "@/components/ui/section";
import { staggerContainer, staggerItem } from "@/lib/animations";
import { useLanguage } from "@/lib/i18n";
import { getProjectDetailHref } from "@/lib/project-links";

interface GitHubSectionProps {
  stats: GitHubStats;
}

const contributionSeries = [
  0, 0, 0, 0, 0, 4, 1, 0, 0, 12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0,
] as const;

const fallbackContributions: GitHubContributionDay[] = contributionSeries.map(
  (contributionCount, index) => ({
    date:
      index === 30
        ? "2026-07-01"
        : `2026-06-${String(index + 1).padStart(2, "0")}`,
    contributionCount,
  })
);

function ContributionChart({
  username,
  title,
  daysLabel,
  contributionsLabel,
  contributions,
}: {
  username: string;
  title: string;
  daysLabel: string;
  contributionsLabel: string;
  contributions: GitHubContributionDay[];
}) {
  const width = 1200;
  const height = 360;
  const padding = { top: 74, right: 52, bottom: 66, left: 82 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const chartData = contributions.length > 0 ? contributions : fallbackContributions;
  const highestContribution = Math.max(
    ...chartData.map((day) => day.contributionCount),
    1
  );
  const maxValue = Math.max(4, Math.ceil(highestContribution / 2) * 2);
  const bandWidth = chartWidth / chartData.length;
  const barWidth = Math.max(8, bandWidth * 0.58);
  const points = chartData.map((day, index) => {
    const x = padding.left + bandWidth * index + bandWidth / 2;
    const y =
      padding.top +
      chartHeight -
      (day.contributionCount / maxValue) * chartHeight;
    return {
      x,
      y,
      value: day.contributionCount,
      label: new Date(`${day.date}T00:00:00`).getDate(),
    };
  });
  const tickStep = Math.max(1, Math.ceil(maxValue / 6));
  const yTicks = Array.from(
    new Set([
      ...Array.from(
        { length: Math.floor(maxValue / tickStep) + 1 },
        (_, index) => index * tickStep
      ),
      maxValue,
    ])
  );

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-auto w-full text-foreground"
      role="img"
      aria-label={`${username} ${title}`}
    >
      <rect
        x="1"
        y="1"
        width={width - 2}
        height={height - 2}
        rx="8"
        fill="transparent"
        stroke="var(--border)"
      />
      <text
        x={width / 2}
        y="38"
        textAnchor="middle"
        className="fill-foreground text-xl font-medium"
        style={{ fontFamily: "var(--font-neue-machina)" }}
      >
        {title}
      </text>
      {yTicks.map((tick) => {
        const y = padding.top + chartHeight - (tick / maxValue) * chartHeight;
        return (
          <g key={tick}>
            <line
              x1={padding.left}
              x2={padding.left + chartWidth}
              y1={y}
              y2={y}
              stroke="var(--border)"
              strokeDasharray="2 3"
            />
            <text
              x={padding.left - 12}
              y={y + 5}
              textAnchor="end"
              className="fill-foreground text-sm font-medium"
              style={{ fontFamily: "var(--font-neue-machina)" }}
            >
              {tick}
            </text>
          </g>
        );
      })}
      {points.map((point, index) => {
        const barHeight = padding.top + chartHeight - point.y;
        const renderedHeight = point.value === 0 ? 2 : barHeight;
        const renderedY = padding.top + chartHeight - renderedHeight;

        return (
          <motion.rect
            key={`${point.label}-${point.x}`}
            x={point.x - barWidth / 2}
            y={renderedY}
            width={barWidth}
            height={renderedHeight}
            rx={Math.min(7, barWidth / 2)}
            className="fill-zinc-400 dark:fill-zinc-500"
            style={{ transformBox: "fill-box", transformOrigin: "center bottom" }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: point.value === 0 ? 0.2 : 1 }}
            transition={{
              duration: 0.7,
              delay: index * 0.025,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <title>{`${point.value} ${contributionsLabel}`}</title>
          </motion.rect>
        );
      })}
      {points.map((point) => (
        <g key={`${point.label}-${point.x}`}>
          <text
            x={point.x}
            y={padding.top + chartHeight + 24}
            textAnchor="middle"
            className="fill-foreground text-sm font-medium"
            style={{ fontFamily: "var(--font-neue-machina)" }}
          >
            {point.label}
          </text>
        </g>
      ))}
      <text
        x={width / 2}
        y={height - 18}
        textAnchor="middle"
        className="fill-foreground text-sm font-medium"
        style={{ fontFamily: "var(--font-neue-machina)" }}
      >
        {daysLabel}
      </text>
      <text
        x="28"
        y={padding.top + chartHeight / 2}
        textAnchor="middle"
        className="fill-foreground text-sm font-medium"
        style={{
          fontFamily: "var(--font-neue-machina)",
          transform: `rotate(-90deg)`,
          transformOrigin: `28px ${padding.top + chartHeight / 2}px`,
        }}
      >
        {contributionsLabel}
      </text>
    </svg>
  );
}

export function GitHubSection({ stats }: GitHubSectionProps) {
  const { copy } = useLanguage();
  const { user, pinnedRepos, recentRepos, languages } = stats;
  const displayRepos = pinnedRepos.length > 0 ? pinnedRepos : recentRepos;

  return (
    <Section id="github">
      <div className="grid-layout">
        <SectionHeading
          title="GitHub"
          subtitle={copy.github.subtitle(user.login)}
        />

        {/* Stats row */}
        <motion.div
          className="mb-10 flex flex-wrap gap-6 border-b border-border pb-10 md:mb-12 md:gap-8 md:pb-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          <motion.div variants={staggerItem}>
            <p className="text-2xl font-medium text-foreground md:text-3xl">{user.public_repos}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted">
              {copy.github.repositories}
            </p>
          </motion.div>
          <motion.div variants={staggerItem}>
            <p className="text-2xl font-medium text-foreground md:text-3xl">{user.followers}</p>
            <p className="mt-1 text-xs uppercase tracking-[0.12em] text-muted">
              {copy.github.followers}
            </p>
          </motion.div>
          {languages.length > 0 && (
            <motion.div variants={staggerItem} className="flex-1">
              <p className="mb-2 text-xs uppercase tracking-[0.12em] text-muted">
                {copy.github.mostUsedLanguages}
              </p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <span
                    key={lang.name}
                    className="rounded-full border border-border px-3 py-1 text-xs text-muted"
                  >
                    {lang.name}
                  </span>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Contribution graph */}
        <motion.div
          className="mb-10 overflow-hidden rounded-lg border border-border md:mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <ContributionChart
            username={user.login}
            title={copy.github.chartTitle}
            daysLabel={copy.github.chartDays}
            contributionsLabel={copy.github.chartContributions}
            contributions={stats.contributions}
          />
        </motion.div>

        {/* Repositories */}
        {displayRepos.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {displayRepos.map((repo) => {
              const repoHref = getProjectDetailHref(repo.html_url) ?? repo.html_url;

              return (
              <motion.article
                key={repo.id}
                variants={staggerItem}
                className="group relative flex flex-col justify-between border border-border p-5 transition-colors duration-300 hover:border-foreground/20 md:p-6"
                whileHover={{ y: -2 }}
              >
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-medium text-foreground">{repo.name}</h3>
                    <ExternalLink
                      className="h-3.5 w-3.5 text-muted opacity-0 transition-opacity group-hover:opacity-100"
                      aria-hidden="true"
                    />
                  </div>
                  {repo.description && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-muted">
                      {repo.description}
                    </p>
                  )}
                </div>
                <div className="mt-4 flex items-center gap-4 text-xs text-muted">
                  {repo.language && <span>{repo.language}</span>}
                  {repo.stargazers_count > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" aria-hidden="true" />
                      {repo.stargazers_count}
                    </span>
                  )}
                </div>
                <Link
                  href={repoHref}
                  className="absolute inset-0"
                  aria-label={copy.github.viewRepo(repo.name)}
                >
                  <span className="sr-only">{repo.name}</span>
                </Link>
              </motion.article>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            className="flex flex-col items-center justify-center border border-border py-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <Github className="mb-4 h-8 w-8 text-muted" aria-hidden="true" />
            <p className="text-sm text-muted">{copy.github.loading}</p>
            <Link
              href={user.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 text-xs uppercase tracking-[0.12em] text-foreground underline-offset-4 hover:underline"
            >
              {copy.github.viewOnGithub}
            </Link>
          </motion.div>
        )}
      </div>
    </Section>
  );
}
