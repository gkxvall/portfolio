export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github?: string;
  demo?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  id: string;
  title: string;
  organization: string;
  period: string;
  description: string;
  type: "internship" | "research" | "competition" | "freelance";
}

export interface TechItem {
  name: string;
  icon: string;
}

export interface SiteConfig {
  name: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  cvUrl: string;
  location: string;
  githubUsername: string;
}

export const siteConfig: SiteConfig = {
  name: "Mohamedhen Vall",
  firstName: "Mohamedhen",
  lastName: "Vall",
  title: "Computer Engineering Student",
  email: "medvall671@gmail.com",
  phone: "+90 534 561 84 32",
  linkedin: "https://www.linkedin.com/in/vallmoh",
  github: "https://github.com/gkxvall",
  cvUrl: "/cv.pdf",
  location: "Atakum, Samsun",
  githubUsername: "gkxvall",
};

export const heroCopy = {
  lines: [
    "Building AI systems,",
    "computer vision pipelines,",
    "and software",
    "that solve real problems.",
  ],
  summary:
    "3rd-year Computer Engineering student with a strong interest in data science, artificial intelligence, and computer vision.",
  availability:
    "Looking for internships to take an active role in real-world projects and continue improving both technical and professional skills.",
} as const;

export const profileCopy = {
  paragraph1:
    "I am a 3rd-year Computer Engineering student with a strong interest in data science, artificial intelligence, and computer vision. I actively develop my skills through Python, machine learning, and image processing projects, transforming theoretical knowledge into practical applications.",
  paragraph2:
    "During my internship, I aim to take an active role in real-world projects and continue improving both my technical and professional skills.",
} as const;

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
] as const;

export const selectedWork = [
  { id: "mlsanity", title: "MLSanity", href: "#projects" },
  { id: "byteflow", title: "ByteFlow", href: "#projects" },
  { id: "rlstriker", title: "RLStriker", href: "#projects" },
  {
    id: "celikkubbe",
    title: "TEKNOFEST Çelikkubbe",
    href: "#experience",
  },
] as const;

export const quickFacts = {
  location: "Atakum, Samsun",
  languages: ["English", "French", "Turkish", "Arabic"],
  status: "Looking for internships",
  education: "Computer Engineering — Ondokuz Mayıs University (3rd Year, 2023–2027)",
  interests: ["Data Science", "Artificial Intelligence", "Computer Vision"],
} as const;

export const projects: Project[] = [
  {
    id: "mlsanity",
    title: "MLSanity",
    description:
      "Open-source tool for detecting and reporting dataset quality issues before machine learning training.",
    tech: ["Python", "Typer", "Rich", "Pandas", "Pillow/OpenCV", "HTML", "CSS"],
    github: "https://github.com/gkxvall/MLSanity",
    featured: true,
  },
  {
    id: "byteflow",
    title: "ByteFlow",
    description:
      "Compressed dataset streaming system for efficient storage and integration with PyTorch training pipelines.",
    tech: ["Python", "PyTorch", "DataLoader", "zip/tar/zstd/lz4", "Pillow", "OpenCV"],
    github: "https://github.com/gkxvall/ByteFlow",
    featured: true,
  },
  {
    id: "rlstriker",
    title: "RLStriker",
    description:
      "Reinforcement learning soccer environment where AI agents learn through self-play, reward shaping, and training analytics.",
    tech: ["Python", "Pygame", "PyTorch", "NumPy", "Pandas", "Matplotlib"],
    github: "https://github.com/gkxvall/RLStriker",
    featured: true,
  },
];

export const experience: ExperienceItem[] = [
  {
    id: "teknoft-celikkubbe",
    title: "AI Computer Vision Developer",
    organization: "TEKNOFEST 2026 — Çelikkubbe Air Defense Systems Competition",
    period: "2026",
    description:
      "Took responsibility for the artificial intelligence and computer vision module in a 3-person software team. Designed an AI vision pipeline by developing real-time object detection, tracking, and classification algorithms on live camera streams. Integrated computer vision outputs with the GUI and machine control software, contributing to the system's autonomous decision-making process.",
    type: "competition",
  },
];

export const techStack: TechItem[] = [
  { name: "Python", icon: "python" },
  { name: "C", icon: "c" },
  { name: "Java", icon: "openjdk" },
  { name: "Ruby", icon: "ruby" },
  { name: "JavaScript", icon: "javascript" },
  { name: "Swift", icon: "swift" },
  { name: "NumPy", icon: "numpy" },
  { name: "Pandas", icon: "pandas" },
  { name: "Scikit-learn", icon: "scikitlearn" },
  { name: "PyTorch", icon: "pytorch" },
  { name: "TensorFlow", icon: "tensorflow" },
  { name: "OpenCV", icon: "opencv" },
  { name: "Matplotlib", icon: "chartdotjs" },
  { name: "Git", icon: "git" },
  { name: "GitHub", icon: "github" },
  { name: "Jupyter Notebook", icon: "jupyter" },
  { name: "HTML", icon: "html5" },
  { name: "CSS", icon: "css" },
  { name: "Pygame", icon: "python" },
];
