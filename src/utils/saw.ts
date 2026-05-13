import type { Criteria, Alternative, SAWResult } from "../types";

export function computeSAW(
  criteria: Criteria[],
  alternatives: Alternative[]
): SAWResult[] {
  if (!alternatives.length || !criteria.length) return [];

  const normalized = alternatives.map((alt) => {
    const norm: Record<string, number> = {};
    criteria.forEach((c) => {
      const vals = alternatives.map((a) => a.values[c.id] ?? 0);
      const max = Math.max(...vals);
      const min = Math.min(...vals);
      const val = alt.values[c.id] ?? 0;
      norm[c.id] =
        c.type === "benefit"
          ? max
            ? val / max
            : 0
          : val
          ? min / val
          : 0;
    });
    return { ...alt, norm };
  });

  const result = normalized.map((alt) => {
    const score = criteria.reduce(
      (sum, c) => sum + (alt.norm[c.id] ?? 0) * c.weight,
      0
    );
    return {
      id: alt.id,
      name: alt.name,
      score: +score.toFixed(4),
      norm: alt.norm,
    };
  });

  return result
    .sort((a, b) => b.score - a.score)
    .map((r, i) => ({ ...r, rank: i + 1 }));
}