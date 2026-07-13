"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

export function ReadmeMermaid({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    async function renderDiagrams() {
      const container = containerRef.current;
      if (!container) return;
      container.innerHTML = html;

      const blocks = Array.from(
        container.querySelectorAll<HTMLElement>("pre[data-mermaid-source]")
      );
      if (blocks.length === 0) return;

      const { default: mermaid } = await import("mermaid");
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: resolvedTheme === "dark" ? "dark" : "default",
      });

      await Promise.all(
        blocks.map(async (block, index) => {
          const source = block.querySelector("code")?.textContent?.trim();
          if (!source) return;

          try {
            const id = `readme-mermaid-${index}-${Math.random().toString(36).slice(2)}`;
            const { svg } = await mermaid.render(id, source);
            if (cancelled || !block.isConnected) return;

            const diagram = document.createElement("div");
            diagram.className = "readme-mermaid";
            diagram.innerHTML = svg;
            block.replaceWith(diagram);
          } catch {
            block.removeAttribute("data-mermaid-source");
          }
        })
      );
    }

    void renderDiagrams();
    return () => {
      cancelled = true;
    };
  }, [html, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      className="readme-content mx-auto w-full max-w-5xl"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
