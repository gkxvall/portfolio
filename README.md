# Portfolio

Ultra-minimal developer portfolio built with Next.js 15, TypeScript, Tailwind CSS, and Framer Motion.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

Edit `src/lib/data.ts` to update your name, links, projects, experience, and other content.

### GitHub Stats

Set `GITHUB_TOKEN` in `.env.local` for higher API rate limits (optional):

```
GITHUB_TOKEN=your_github_pat
```

Update `githubUsername` in `src/lib/data.ts` with your GitHub username.

### CV

Place your CV at `public/cv.pdf` for the download button.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Lucide Icons
- PP Neue Machina (via CDN Fonts)

## Deploy

Deploy on [Vercel](https://vercel.com) or any Next.js-compatible platform.

```bash
npm run build
npm start
```
