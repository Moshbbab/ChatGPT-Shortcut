export function formatCompactNumber(num: number | undefined | null): string {
  if (num === undefined || num === null || isNaN(num)) return "0";
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

export function getWeight(prompt: any): number {
  if (!prompt) return 0;
  if (typeof prompt.count === "number") return prompt.count;
  if (typeof prompt.weight === "number") return prompt.weight;
  return 0;
}
