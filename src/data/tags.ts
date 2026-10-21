export type TagType =
  | "all"
  | "favorite"
  | "code"
  | "write"
  | "ai"
  | "games"
  | "language"
  | "pedagogy"
  | "interpreter"
  | "academic"
  | "article"
  | "lifestyle"
  | "tool";

export interface TagInfo {
  label: string;
  description?: string;
  color?: string;
}

export const Tags: Record<string, TagInfo> = {
  all: {
    label: "All Prompts",
    description: "Browse all available AI prompts",
  },
  favorite: {
    label: "Favorites",
    description: "Your saved favorite prompts",
  },
  code: {
    label: "Code & Dev",
    description: "Code generation, commit messages, debugging, and refactoring",
  },
  write: {
    label: "Writing & Content",
    description: "Material collection, copywriting, blog posts, and editing",
  },
  ai: {
    label: "AI & Prompts",
    description: "Prompt engineering, AI reasoning, and model optimization",
  },
  interpreter: {
    label: "Interpreter",
    description: "Code execution, debugging explanations, and data analysis",
  },
  language: {
    label: "Language & Translation",
    description: "Multi-language translation, grammar polishing, and linguistics",
  },
  pedagogy: {
    label: "Education & Learning",
    description: "Tutoring, study guides, and concept explanations",
  },
  games: {
    label: "Games & Creative",
    description: "Interactive fiction, text RPGs, game design, and entertainment",
  },
  academic: {
    label: "Academic & Research",
    description: "Paper review, literature summary, citations, and research analysis",
  },
  article: {
    label: "Articles & Essays",
    description: "Structured essays, opinion pieces, and editorial drafting",
  },
};

export const TagList: TagType[] = [
  "code",
  "write",
  "ai",
  "interpreter",
  "language",
  "pedagogy",
  "games",
  "academic",
];
