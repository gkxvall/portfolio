"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export const languages = ["EN", "FR", "TR"] as const;
export type Language = (typeof languages)[number];

const translations = {
  EN: {
    skip: "Skip to content",
    nav: {
      about: "About",
      projects: "Projects",
      experience: "Experience",
      skills: "Skills",
      contact: "Contact",
    },
    hero: {
      eyebrow: "Hi, I'm",
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
    },
    about: {
      title: "About",
      paragraphs: [
        "I am a 3rd-year Computer Engineering student with a strong interest in data science, artificial intelligence, and computer vision. I actively develop my skills through Python, machine learning, and image processing projects, transforming theoretical knowledge into practical applications.",
        "During my internship, I aim to take an active role in real-world projects and continue improving both my technical and professional skills.",
      ],
      facts: [
        { label: "Location", value: "Atakum, Samsun" },
        { label: "Languages", value: ["English", "French", "Turkish", "Arabic"] },
        { label: "Current Status", value: "Looking for internships" },
        {
          label: "Education",
          value: "Computer Engineering - Ondokuz Mayis University (3rd Year, 2023-2027)",
        },
        {
          label: "Interests",
          value: ["Data Science", "Artificial Intelligence", "Computer Vision"],
        },
      ],
    },
    projects: {
      title: "Projects",
      subtitle: "Software that solves real problems - from AI systems to embedded robotics.",
      liveDemo: "Live Demo",
      items: {
        mlsanity:
          "Open-source tool for detecting and reporting dataset quality issues before machine learning training.",
        byteflow:
          "Compressed dataset streaming system for efficient storage and integration with PyTorch training pipelines.",
        rlstriker:
          "Reinforcement learning soccer environment where AI agents learn through self-play, reward shaping, and training analytics.",
      },
    },
    experience: {
      title: "Experience",
      subtitle: "Internships, research, competitions, and freelance work.",
      types: {
        internship: "Internship",
        research: "Research",
        competition: "Competition",
        freelance: "Freelance",
      },
      items: {
        "teknoft-celikkubbe": {
          title: "AI Computer Vision Developer",
          organization: "TEKNOFEST 2026 - Celikkubbe Air Defense Systems Competition",
          description:
            "Took responsibility for the artificial intelligence and computer vision module in a 3-person software team. Designed an AI vision pipeline by developing real-time object detection, tracking, and classification algorithms on live camera streams. Integrated computer vision outputs with the GUI and machine control software, contributing to the system's autonomous decision-making process.",
        },
      },
    },
    skills: {
      title: "Skills",
    },
    github: {
      subtitle: (username: string) => `@${username} - building in public.`,
      repositories: "Repositories",
      followers: "Followers",
      mostUsedLanguages: "Most Used Languages",
      chartTitle: "Vall's Contribution Graph",
      chartDays: "Days",
      chartContributions: "Contributions",
      loading: "Repositories loading from GitHub...",
      viewOnGithub: "View on GitHub",
      viewRepo: (repo: string) => `View ${repo} on GitHub`,
    },
    projectDetails: {
      backToProjects: "Back to projects",
      openOnGithub: "Open on GitHub",
      liveProject: "Live project",
      stars: "Stars",
      forks: "Forks",
      updated: "Updated",
      contributors: "Contributors",
      topics: "Topics",
      languages: "Languages",
      fileStructure: "File Structure",
      recentCommits: "Recent Commits",
      noLanguages: "No language data available.",
      noContributors: "No contributor data available.",
      noFileTree: "No file tree available.",
      noCommits: "No recent commits available.",
      noReadme: "No README found.",
      readme: "README",
      backToReadme: "Back to top of README",
      commitActivity: "Commit activity",
      lastWeeks: "Last 16 weeks",
      commits: "commits",
    },
    contact: {
      titleLines: ["Let's build", "something."],
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      downloadCv: "Download CV",
    },
  },
  FR: {
    skip: "Aller au contenu",
    nav: {
      about: "A propos",
      projects: "Projets",
      experience: "Experience",
      skills: "Competences",
      contact: "Contact",
    },
    hero: {
      eyebrow: "Salut, je suis",
      lines: [
        "Je construis des systemes IA,",
        "des pipelines de vision par ordinateur,",
        "et des logiciels",
        "qui resolvent de vrais problemes.",
      ],
      summary:
        "Etudiant en 3e annee de genie informatique, interesse par la data science, l'intelligence artificielle et la vision par ordinateur.",
      availability:
        "Je recherche des stages pour participer a des projets concrets et continuer a developper mes competences techniques et professionnelles.",
    },
    about: {
      title: "A propos",
      paragraphs: [
        "Je suis etudiant en 3e annee de genie informatique, avec un fort interet pour la data science, l'intelligence artificielle et la vision par ordinateur. Je developpe activement mes competences avec Python, le machine learning et le traitement d'images, en transformant les connaissances theoriques en applications pratiques.",
        "Pendant mon stage, je souhaite prendre une part active a des projets reels et continuer a progresser sur les plans technique et professionnel.",
      ],
      facts: [
        { label: "Localisation", value: "Atakum, Samsun" },
        { label: "Langues", value: ["Anglais", "Francais", "Turc", "Arabe"] },
        { label: "Statut", value: "Recherche de stages" },
        {
          label: "Formation",
          value: "Genie informatique - Universite Ondokuz Mayis (3e annee, 2023-2027)",
        },
        {
          label: "Interets",
          value: ["Data Science", "Intelligence Artificielle", "Vision par Ordinateur"],
        },
      ],
    },
    projects: {
      title: "Projets",
      subtitle:
        "Des logiciels qui resolvent de vrais problemes - des systemes IA a la robotique embarquee.",
      liveDemo: "Demo",
      items: {
        mlsanity:
          "Outil open-source qui detecte et signale les problemes de qualite des jeux de donnees avant l'entrainement de modeles.",
        byteflow:
          "Systeme de streaming de jeux de donnees compresses pour optimiser le stockage et l'integration avec les pipelines PyTorch.",
        rlstriker:
          "Environnement de football en apprentissage par renforcement ou des agents IA apprennent par auto-jeu, reward shaping et analyse d'entrainement.",
      },
    },
    experience: {
      title: "Experience",
      subtitle: "Stages, recherche, competitions et travail freelance.",
      types: {
        internship: "Stage",
        research: "Recherche",
        competition: "Competition",
        freelance: "Freelance",
      },
      items: {
        "teknoft-celikkubbe": {
          title: "Developpeur IA et Vision par Ordinateur",
          organization: "TEKNOFEST 2026 - Competition de systemes de defense aerienne Celikkubbe",
          description:
            "Responsable du module d'intelligence artificielle et de vision par ordinateur dans une equipe logicielle de 3 personnes. Conception d'un pipeline de vision IA avec detection, suivi et classification d'objets en temps reel sur flux camera. Integration des sorties de vision avec l'interface graphique et le logiciel de controle machine, contribuant au processus de decision autonome du systeme.",
        },
      },
    },
    skills: {
      title: "Competences",
    },
    github: {
      subtitle: (username: string) => `@${username} - construire en public.`,
      repositories: "Depots",
      followers: "Abonnes",
      mostUsedLanguages: "Langages les plus utilises",
      chartTitle: "Graphe de contributions de Vall",
      chartDays: "Jours",
      chartContributions: "Contributions",
      loading: "Chargement des depots GitHub...",
      viewOnGithub: "Voir sur GitHub",
      viewRepo: (repo: string) => `Voir ${repo} sur GitHub`,
    },
    projectDetails: {
      backToProjects: "Retour aux projets",
      openOnGithub: "Ouvrir sur GitHub",
      liveProject: "Projet en ligne",
      stars: "Etoiles",
      forks: "Forks",
      updated: "Mis a jour",
      contributors: "Contributeurs",
      topics: "Sujets",
      languages: "Langages",
      fileStructure: "Structure des fichiers",
      recentCommits: "Commits recents",
      noLanguages: "Aucune donnee de langage disponible.",
      noContributors: "Aucune donnee de contributeur disponible.",
      noFileTree: "Aucune arborescence de fichiers disponible.",
      noCommits: "Aucun commit recent disponible.",
      noReadme: "Aucun README trouve.",
      readme: "README",
      backToReadme: "Retour en haut du README",
      commitActivity: "Activite des commits",
      lastWeeks: "16 dernieres semaines",
      commits: "commits",
    },
    contact: {
      titleLines: ["Construisons", "quelque chose."],
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      downloadCv: "Telecharger le CV",
    },
  },
  TR: {
    skip: "Icerige gec",
    nav: {
      about: "Hakkimda",
      projects: "Projeler",
      experience: "Deneyim",
      skills: "Yetenekler",
      contact: "Iletisim",
    },
    hero: {
      eyebrow: "Merhaba, ben",
      lines: [
        "Yapay zeka sistemleri,",
        "bilgisayarla goru hatlari",
        "ve gercek problemleri cozen",
        "yazilimlar gelistiriyorum.",
      ],
      summary:
        "Veri bilimi, yapay zeka ve bilgisayarla goru alanlarina ilgi duyan 3. sinif Bilgisayar Muhendisligi ogrencisiyim.",
      availability:
        "Gercek projelerde aktif rol almak ve teknik/profesyonel becerilerimi gelistirmek icin staj firsatlari ariyorum.",
    },
    about: {
      title: "Hakkimda",
      paragraphs: [
        "Veri bilimi, yapay zeka ve bilgisayarla goru alanlarina guclu ilgi duyan 3. sinif Bilgisayar Muhendisligi ogrencisiyim. Python, makine ogrenmesi ve goruntu isleme projeleriyle teorik bilgiyi pratik uygulamalara donusturerek becerilerimi aktif olarak gelistiriyorum.",
        "Staj surecimde gercek projelerde aktif rol almak ve hem teknik hem de profesyonel becerilerimi gelistirmeye devam etmek istiyorum.",
      ],
      facts: [
        { label: "Konum", value: "Atakum, Samsun" },
        { label: "Diller", value: ["Ingilizce", "Fransizca", "Turkce", "Arapca"] },
        { label: "Durum", value: "Staj ariyor" },
        {
          label: "Egitim",
          value: "Bilgisayar Muhendisligi - Ondokuz Mayis Universitesi (3. Sinif, 2023-2027)",
        },
        {
          label: "Ilgi Alanlari",
          value: ["Veri Bilimi", "Yapay Zeka", "Bilgisayarla Goru"],
        },
      ],
    },
    projects: {
      title: "Projeler",
      subtitle:
        "Gercek problemleri cozen yazilimlar - yapay zeka sistemlerinden gomulu robotige.",
      liveDemo: "Canli Demo",
      items: {
        mlsanity:
          "Makine ogrenmesi egitiminden once veri seti kalite sorunlarini tespit edip raporlayan acik kaynak arac.",
        byteflow:
          "Verimli depolama ve PyTorch egitim hatlariyla entegrasyon icin sikistirilmis veri seti akis sistemi.",
        rlstriker:
          "Yapay zeka ajanlarinin kendi kendine oynama, odul sekillendirme ve egitim analizleriyle ogrendigi pekistirmeli ogrenme futbol ortami.",
      },
    },
    experience: {
      title: "Deneyim",
      subtitle: "Stajlar, arastirma, yarismalar ve freelance calismalar.",
      types: {
        internship: "Staj",
        research: "Arastirma",
        competition: "Yarisma",
        freelance: "Freelance",
      },
      items: {
        "teknoft-celikkubbe": {
          title: "Yapay Zeka ve Bilgisayarla Goru Gelistiricisi",
          organization: "TEKNOFEST 2026 - Celikkubbe Hava Savunma Sistemleri Yarismasi",
          description:
            "3 kisilik yazilim ekibinde yapay zeka ve bilgisayarla goru modulunun sorumlulugunu ustlendim. Canli kamera akislarinda gercek zamanli nesne tespiti, takip ve siniflandirma algoritmalariyla bir IA goru hatti tasarladim. Goru ciktilarini arayuz ve makine kontrol yazilimi ile entegre ederek sistemin otonom karar verme surecine katkida bulundum.",
        },
      },
    },
    skills: {
      title: "Yetenekler",
    },
    github: {
      subtitle: (username: string) => `@${username} - acik sekilde uretiyor.`,
      repositories: "Depolar",
      followers: "Takipciler",
      mostUsedLanguages: "En Cok Kullanilan Diller",
      chartTitle: "Vall Katki Grafigi",
      chartDays: "Gunler",
      chartContributions: "Katkilar",
      loading: "GitHub depolari yukleniyor...",
      viewOnGithub: "GitHub'da Gor",
      viewRepo: (repo: string) => `${repo} reposunu GitHub'da gor`,
    },
    projectDetails: {
      backToProjects: "Projelere don",
      openOnGithub: "GitHub'da ac",
      liveProject: "Canli proje",
      stars: "Yildizlar",
      forks: "Catallamalar",
      updated: "Guncellendi",
      contributors: "Katkida bulunanlar",
      topics: "Konular",
      languages: "Diller",
      fileStructure: "Dosya yapisi",
      recentCommits: "Son commitler",
      noLanguages: "Dil verisi bulunamadi.",
      noContributors: "Katkida bulunan verisi bulunamadi.",
      noFileTree: "Dosya agaci bulunamadi.",
      noCommits: "Son commit bulunamadi.",
      noReadme: "README bulunamadi.",
      readme: "README",
      backToReadme: "README'nin basina don",
      commitActivity: "Commit etkinligi",
      lastWeeks: "Son 16 hafta",
      commits: "commit",
    },
    contact: {
      titleLines: ["Birlikte", "bir sey insa edelim."],
      email: "Email",
      linkedin: "LinkedIn",
      github: "GitHub",
      downloadCv: "CV Indir",
    },
  },
};

type Translation = typeof translations.EN;

interface LanguageContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  copy: Translation;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getSavedLanguage(): Language {
  if (typeof window === "undefined") return "EN";
  const saved = window.localStorage.getItem("language");
  return saved === "FR" || saved === "TR" ? saved : "EN";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("EN");

  useEffect(() => {
    setLanguageState(getSavedLanguage());
  }, []);

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
    window.localStorage.setItem("language", language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage: setLanguageState,
      copy: translations[language],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
