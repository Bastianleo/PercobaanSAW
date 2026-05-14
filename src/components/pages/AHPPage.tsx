
import { useSPK } from "../../context/SPKContext";
import { AHP_SCALE, AHP_LABELS } from "../../utils/ahp";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Icon } from "../ui/Icon";

function calculateNormalizedMatrix(
  matrix: number[][],
  n: number
): { normalized: number[][]; colSums: number[] } {
  const colSums: number[] = Array(n).fill(0);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      colSums[j] += matrix[i][j];
    }
  }

  const normalized = matrix.map((row) =>
    row.map((v, j) => (colSums[j] !== 0 ? +(v / colSums[j]).toFixed(4) : 0))
  );

  return { normalized, colSums };
}

export function AHPPage() {
  const { criteria, ahpMatrix, setAhpMatrix, ahpResults } = useSPK();
  const n = criteria.length;

  const handleChange = (i: number, j: number, idx: number) => {
    const value = AHP_SCALE[idx];
    const newMatrix = ahpMatrix.map((row) => [...row]);
    newMatrix[i][j] = value;
    newMatrix[j][i] = value !== 0 ? 1 / value : 1;
    setAhpMatrix(newMatrix);
  };

  const { normalized: normalizedMatrix, colSums } = calculateNormalizedMatrix(
    ahpMatrix,
    n
  );

  if (n < 2) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Icon name="layers" size={40} />
        <p className="mt-3 text-sm">
          Minimal 2 kriteria diperlukan untuk AHP
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Metode AHP</h1>
        <p className="text-slate-500 text-sm mt-1">
          Analytical Hierarchy Process — matriks perbandingan berpasangan
        </p>
      </div>

      {/* Matriks Perbandingan Berpasangan */}
      <Card className="p-5">
        <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-xl mb-5">
          <Icon name="info" size={15} />
          <div className="text-xs text-blue-700 leading-relaxed">
            Isi nilai perbandingan antar kriteria. Nilai 1–9: kriteria
            baris lebih penting dari kolom. Nilai 1/2–1/9: kriteria kolom
            lebih penting dari baris. Diagonal otomatis = 1.
          </div>
        </div>
        <h3 className="text-sm font-semibold text-slate-800 mb-4">
          Matriks Perbandingan Berpasangan
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400">
                  Kriteria
                </th>
                {criteria.map((c) => (
                  <th
                    key={c.id}
                    className="px-3 py-2 text-center text-xs font-semibold text-slate-500"
                  >
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {criteria.map((rowC, i) => (
                <tr key={rowC.id}>
                  <td className="px-3 py-2 text-xs font-medium text-slate-600 whitespace-nowrap">
                    {rowC.name}
                  </td>
                  {criteria.map((colC, j) => (
                    <td
                      key={colC.id}
                      className="px-3 py-2 text-center"
                    >
                      {i === j ? (
                        <span className="text-slate-400 font-mono text-xs">
                          1
                        </span>
                      ) : i < j ? (
                        <select
                          value={AHP_SCALE.findIndex(
                            (s) =>
                              Math.abs(s - ahpMatrix[i][j]) < 0.001
                          )}
                          onChange={(e) =>
                            handleChange(i, j, +e.target.value)
                          }
                          className="text-xs rounded-lg border border-slate-200 px-1.5 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 w-14"
                        >
                          {AHP_LABELS.map((l, idx) => (
                            <option key={l} value={idx}>
                              {l}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-slate-400 font-mono text-xs">
                          {ahpMatrix[i][j].toFixed(3)}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Matriks Normalisasi */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-1">
          Matriks Normalisasi
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Setiap elemen dibagi dengan jumlah kolomnya
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="px-3 py-2 text-left text-xs font-semibold text-slate-400">
                  Kriteria
                </th>
                {criteria.map((c) => (
                  <th
                    key={c.id}
                    className="px-3 py-2 text-center text-xs font-semibold text-slate-500"
                  >
                    {c.name}
                  </th>
                ))}
                <th className="px-3 py-2 text-center text-xs font-semibold text-blue-600">
                  Bobot
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {criteria.map((rowC, i) => {
                const rowSum = normalizedMatrix[i]?.reduce(
                  (s, v) => s + v,
                  0
                ) ?? 0;
                const weight = n > 0 ? rowSum / n : 0;

                return (
                  <tr key={rowC.id}>
                    <td className="px-3 py-2 text-xs font-medium text-slate-600 whitespace-nowrap">
                      {rowC.name}
                    </td>
                    {criteria.map((_, j) => (
                      <td
                        key={j}
                        className="px-3 py-2 text-center"
                      >
                        <span className="text-xs font-mono text-slate-600">
                          {normalizedMatrix[i]?.[j]?.toFixed(4) ?? "0.0000"}
                        </span>
                      </td>
                    ))}
                    <td className="px-3 py-2 text-center">
                      <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                        {weight.toFixed(4)}
                      </span>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-slate-50">
                <td className="px-3 py-2 text-xs font-semibold text-slate-500">
                  Jumlah
                </td>
                {colSums.map((sum, j) => (
                  <td key={j} className="px-3 py-2 text-center">
                    <span className="text-xs font-mono font-medium text-slate-500">
                      {sum.toFixed(4)}
                    </span>
                  </td>
                ))}
                <td className="px-3 py-2 text-center">
                  <span className="text-xs font-mono font-bold text-slate-600">
                    {n > 0
                      ? normalizedMatrix
                          .reduce((s, row) => s + row.reduce((rs, v) => rs + v, 0), 0)
                          .toFixed(4)
                      : "0.0000"}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Statistik AHP */}
      {ahpResults && (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                label: "Lambda Max (λmax)",
                value: (ahpResults.CI * (n - 1) + n).toFixed(4),
              },
              {
                label: "Consistency Index (CI)",
                value: ahpResults.CI,
              },
              {
                label: "Consistency Ratio (CR)",
                value: ahpResults.CR,
                flag: true,
              },
            ].map((s) => (
              <Card key={s.label} className="p-4 text-center">
                <div
                  className={`text-xl font-bold ${
                    s.flag
                      ? ahpResults.consistent
                        ? "text-emerald-600"
                        : "text-rose-500"
                      : "text-slate-800"
                  }`}
                >
                  {s.value}
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {s.label}
                </div>
                {s.flag && (
                  <Badge
                    color={ahpResults.consistent ? "green" : "red"}
                    className="mt-2 inline-flex"
                  >
                    {ahpResults.consistent
                      ? "Konsisten (CR < 0.1)"
                      : "Tidak Konsisten"}
                  </Badge>
                )}
              </Card>
            ))}
          </div>

          {/* Tabel Bobot Prioritas */}
          <Card>
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">
                Bobot Kriteria (Priority Vector)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Rata-rata setiap baris matriks normalisasi
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    {[
                      "Rank",
                      "Kriteria",
                      "Bobot (Priority Vector)",
                      "Persentase",
                      "Visualisasi",
                    ].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {ahpResults.ranked.map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-slate-50/50"
                    >
                      <td className="px-5 py-3.5">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                            r.rank === 1
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {r.rank}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                        {r.name}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-mono text-slate-700">
                        {r.weight.toFixed(4)}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-mono text-slate-600">
                        {(r.weight * 100).toFixed(2)}%
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full transition-all"
                              style={{
                                width: `${r.weight * 100}%`,
                              }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">
                            {(r.weight * 100).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50">
                    <td className="px-5 py-3" />
                    <td className="px-5 py-3 text-sm font-semibold text-slate-700">
                      Total
                    </td>
                    <td className="px-5 py-3 text-sm font-mono font-bold text-slate-700">
                      {ahpResults.ranked
                        .reduce((s, r) => s + r.weight, 0)
                        .toFixed(4)}
                    </td>
                    <td className="px-5 py-3 text-sm font-mono font-bold text-slate-700">
                      100%
                    </td>
                    <td className="px-5 py-3" />
                  </tr>
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}