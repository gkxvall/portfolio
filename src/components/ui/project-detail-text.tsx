"use client";

import { useLanguage } from "@/lib/i18n";

export type ProjectDetailTextKey = keyof ReturnType<
  typeof useLanguage
>["copy"]["projectDetails"];

export function ProjectDetailText({ textKey }: { textKey: ProjectDetailTextKey }) {
  const { copy } = useLanguage();
  return copy.projectDetails[textKey];
}
