import {
  siC,
  siChartdotjs,
  siCss,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siJupyter,
  siNumpy,
  siOpencv,
  siOpenjdk,
  siPandas,
  siPython,
  siPytorch,
  siRuby,
  siScikitlearn,
  siSwift,
  siTensorflow,
} from "simple-icons";
import { cn } from "@/lib/utils";

const icons = {
  c: siC,
  chartdotjs: siChartdotjs,
  css: siCss,
  git: siGit,
  github: siGithub,
  html5: siHtml5,
  javascript: siJavascript,
  jupyter: siJupyter,
  numpy: siNumpy,
  opencv: siOpencv,
  openjdk: siOpenjdk,
  pandas: siPandas,
  python: siPython,
  pytorch: siPytorch,
  ruby: siRuby,
  scikitlearn: siScikitlearn,
  swift: siSwift,
  tensorflow: siTensorflow,
};

export type TechIconName = keyof typeof icons;

interface TechIconProps {
  icon: string;
  label: string;
  className?: string;
}

export function TechIcon({ icon, label, className }: TechIconProps) {
  const selectedIcon = icons[icon as TechIconName] ?? siPython;

  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("h-5 w-5", className)}
      role="img"
      aria-label={label}
    >
      <path d={selectedIcon.path} fill="currentColor" />
    </svg>
  );
}
