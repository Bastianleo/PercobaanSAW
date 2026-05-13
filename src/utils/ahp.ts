import type { Criteria, AHPResult } from "../types";

const RI: number[] = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];

export function computeAHP(
  criteria: Criteria[],
  matrix: number[][]
): AHPResult | null {
  const n = criteria.length;
  if (n < 2) return null;

  const colSums: number[] = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      colSums[j] += matrix[i][j];
    }
  }

  const normalized = matrix.map((row) =>
    row.map((v, j) => v / colSums[j])
  );

  const weights = normalized.map(
    (row) => row.reduce((s, v) => s + v, 0) / n
  );

  const weighted = matrix.map((row) =>
    row.map((v, j) => v * weights[j])
  );

  const rowSums = weighted.map((row) =>
    row.reduce((s, v) => s + v, 0)
  );

  const lambdaMax =
    rowSums.reduce((s, v, i) => s + v / weights[i], 0) / n;

  const CI = (lambdaMax - n) / (n - 1);
  const CR = CI / (RI[n] || 1.49);

  const ranked = criteria
    .map((c, i) => ({
      id: c.id,
      name: c.name,
      weight: +weights[i].toFixed(4),
    }))
    .sort((a, b) => b.weight - a.weight)
    .map((r, i) => ({ ...r, rank: i + 1 }));

  return {
    weights,
    CI: +CI.toFixed(4),
    CR: +CR.toFixed(4),
    ranked,
    consistent: CR < 0.1,
  };
}

export function defaultAHPMatrix(n: number): number[][] {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) =>
      i === j ? 1 : i < j ? 1 / (j - i + 1) : i - j + 1
    )
  );
}

export const AHP_SCALE = [
  1 / 9, 1 / 8, 1 / 7, 1 / 6, 1 / 5, 1 / 4, 1 / 3, 1 / 2,
  1, 2, 3, 4, 5, 6, 7, 8, 9,
];

export const AHP_LABELS = [
  "1/9", "1/8", "1/7", "1/6", "1/5", "1/4", "1/3", "1/2",
  "1", "2", "3", "4", "5", "6", "7", "8", "9",
];