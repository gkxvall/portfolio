import { JsonLd } from "@/components/seo/json-ld";
import { Navigation } from "@/components/layout/navigation";
import { SkipLink } from "@/components/layout/skip-link";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { siteConfig, profileCopy } from "@/lib/data";
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://medvall.dev"),
  title: {
    default: "Vall",
    template: "%s | Vall",
  },
  description: profileCopy.paragraph1,
  keywords: [
    "Computer Engineering",
    "Artificial Intelligence",
    "Computer Vision",
    "Machine Learning",
    "Data Science",
    "Python",
    "PyTorch",
    "OpenCV",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", type: "image/x-icon", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "500x500" },
      { url: "/mainAvatar.png?v=2", type: "image/png", sizes: "500x500" },
    ],
    shortcut: "/mainAvatar.png?v=2",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://medvall.dev",
    title: "Vall",
    description: profileCopy.paragraph1,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: "Vall",
    description: profileCopy.paragraph1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0A0A" },
  ],
  colorScheme: "dark light",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <JsonLd />
          <SkipLink />
          <Navigation />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
