// Eagerly import all JSON card files in src/data/cards/
const cardModules = import.meta.glob<any>("../data/cards/*.json", { eager: true });

export interface PromptCardData {
  id: number;
  title: string;
  prompt: string;
  remark: string;
  description?: string;
  tags: string[];
  website?: string;
  count: number;
  weight?: number;
  related?: Array<{ id: number; title: string; remark: string }>;
  metaTitle?: string;
  metaDescription?: string;
  faq?: Array<{ q: string; a: string }>;
  datePublished?: string;
  dateModified?: string;
  raw?: any;
}

// Map of cardId -> Map of lang -> raw card JSON
const cardCache = new Map<number, Map<string, any>>();
const allIdsSet = new Set<number>();

for (const [path, mod] of Object.entries(cardModules)) {
  const match = path.match(/(\d+)_([a-zA-Z0-9-]+)\.json$/);
  if (!match) continue;
  const id = parseInt(match[1], 10);
  const lang = match[2];
  const data = mod.default || mod;

  allIdsSet.add(id);
  if (!cardCache.has(id)) {
    cardCache.set(id, new Map());
  }
  cardCache.get(id)!.set(lang, data);
}

export const ALL_CARD_IDS = Array.from(allIdsSet).sort((a, b) => a - b);

/**
 * Extract localized card details
 */
export function getLocalizedCard(id: number, lang: string): PromptCardData | null {
  const langMap = cardCache.get(id);
  if (!langMap) return null;

  // Try requested lang, then fallback to zh-Hans, then en, then first available
  const rawData =
    langMap.get(lang) ||
    langMap.get("zh-Hans") ||
    langMap.get("en") ||
    Array.from(langMap.values())[0];

  if (!rawData) return null;

  // Find the language specific object (e.g. rawData["en"] or rawData["zh-Hans"])
  const langContent =
    rawData[lang] ||
    rawData["zh-Hans"] ||
    rawData["en"] ||
    Object.values(rawData).find(
      (v: any) => v && typeof v === "object" && typeof v.title === "string"
    );

  const title = langContent?.title || rawData.title || `Prompt #${id}`;
  const prompt = langContent?.prompt || rawData.prompt || "";
  const remark = langContent?.remark || rawData.remark || title;
  const description = langContent?.description || rawData.description || "";

  return {
    id,
    title,
    prompt,
    remark,
    description,
    tags: rawData.tags || [],
    website: rawData.website || "",
    count: rawData.count || rawData.weight || 100,
    weight: rawData.weight || rawData.count || 100,
    related: rawData.related || [],
    metaTitle: rawData.metaTitle || title,
    metaDescription: rawData.metaDescription || description || prompt.slice(0, 120),
    faq: rawData.faq || [],
    datePublished: rawData.datePublished,
    dateModified: rawData.dateModified,
    raw: rawData,
  };
}

/**
 * Get all available cards for a given language
 */
export function getAllCards(lang: string): PromptCardData[] {
  const cards: PromptCardData[] = [];
  for (const id of ALL_CARD_IDS) {
    const card = getLocalizedCard(id, lang);
    if (card) {
      cards.push(card);
    }
  }
  return cards;
}

/**
 * Search and filter prompts
 */
export function filterCards(
  cards: PromptCardData[],
  query: string,
  selectedTags: string[]
): PromptCardData[] {
  let result = cards;

  if (selectedTags.length > 0 && !selectedTags.includes("all")) {
    result = result.filter((card) =>
      selectedTags.some((tag) => card.tags.includes(tag))
    );
  }

  if (query && query.trim()) {
    const q = query.trim().toLowerCase();
    result = result.filter(
      (card) =>
        card.title.toLowerCase().includes(q) ||
        card.remark.toLowerCase().includes(q) ||
        card.prompt.toLowerCase().includes(q) ||
        card.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return result;
}
