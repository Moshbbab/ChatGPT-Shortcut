export function estimateTokens(text: string): number {
  if (!text) return 0;
  // Approximation: English ~4 chars per token, CJK ~1.5 char per token
  const cjkChars = (text.match(/[\u4e00-\u9fa5\u3040-\u30ff\uac00-\ud7af]/g) || []).length;
  const otherChars = text.length - cjkChars;
  return Math.ceil(cjkChars / 1.5 + otherChars / 4);
}

export function extractPlaceholders(text: string): string[] {
  if (!text) return [];
  const matches = text.match(/\[([^[\]]+)\]/g);
  if (!matches) return [];
  return [...new Set(matches.map((m) => m.slice(1, -1)))];
}

export function renderPromptWithPlaceholders(text: string, values: Record<string, string> = {}): string {
  if (!text) return "";
  let rendered = text;
  Object.entries(values).forEach(([key, val]) => {
    if (val) {
      rendered = rendered.replaceAll(`[${key}]`, val);
    }
  });
  return rendered;
}
