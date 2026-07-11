"use client";

import { ChevronRight, FileText, Folder } from "lucide-react";
import { useState } from "react";

interface FileTreeItem {
  path: string;
  type: string;
}

export function FileTree({ items }: { items: FileTreeItem[] }) {
  const [collapsedFolders, setCollapsedFolders] = useState<Set<string>>(
    () => new Set(items.filter((item) => item.type === "tree").map((item) => item.path))
  );

  const toggleFolder = (path: string) => {
    setCollapsedFolders((current) => {
      const next = new Set(current);
      if (next.has(path)) next.delete(path);
      else next.add(path);
      return next;
    });
  };

  const isHidden = (path: string) => {
    const parts = path.split("/");
    return parts
      .slice(0, -1)
      .some((_, index) => collapsedFolders.has(parts.slice(0, index + 1).join("/")));
  };

  return (
    <div className="file-tree-scrollbar max-h-[620px] min-h-0 overflow-y-auto overflow-x-hidden pr-1 lg:absolute lg:inset-x-6 lg:bottom-6 lg:top-[59px] lg:max-h-none">
      {items.map((item) => {
        if (isHidden(item.path)) return null;

        const isFolder = item.type === "tree";
        const isCollapsed = collapsedFolders.has(item.path);
        const depth = Math.min(item.path.split("/").length - 1, 5);
        const name = item.path.split("/").at(-1) ?? item.path;

        const content = (
          <>
            {isFolder ? (
              <ChevronRight
                className={`h-3 w-3 shrink-0 transition-transform ${
                  isCollapsed ? "" : "rotate-90"
                }`}
                aria-hidden="true"
              />
            ) : (
              <span className="w-3 shrink-0" aria-hidden="true" />
            )}
            {isFolder ? (
              <Folder className="h-3.5 w-3.5 shrink-0 text-foreground" aria-hidden="true" />
            ) : (
              <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            )}
            <span className="truncate">{name}</span>
          </>
        );

        return isFolder ? (
          <button
            key={item.path}
            type="button"
            className="flex w-full items-center gap-2 py-1.5 text-left text-xs text-muted transition-colors hover:text-foreground"
            style={{ paddingLeft: `${depth * 14}px` }}
            title={item.path}
            aria-expanded={!isCollapsed}
            onClick={() => toggleFolder(item.path)}
          >
            {content}
          </button>
        ) : (
          <div
            key={item.path}
            className="flex items-center gap-2 py-1.5 text-xs text-muted"
            style={{ paddingLeft: `${depth * 14}px` }}
            title={item.path}
          >
            {content}
          </div>
        );
      })}
    </div>
  );
}
