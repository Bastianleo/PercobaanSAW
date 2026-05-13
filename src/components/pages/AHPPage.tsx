
import { useSPK } from "../../context/SPKContext";
import { AHP_SCALE, AHP_LABELS } from "../../utils/ahp";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Icon } from "../ui/Icon";

export function AHPPage() {
  const { criteria, ahpMatrix, setAhpMatrix, ahpResults } = useSPK();
  const n = criteria.length;

  const handleChange = (i: number, j: number, val: number) => {
    const v = +val;
    const newMatrix = ahpMatrix.map((row) => [...row]);
    newMatrix[i][j] = v;
    newMatrix[j][i] = v !== 0 ? 1 / v : 1;
    setAhpMatrix(newMatrix);
  };

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
                            handleChange(
                              i,
                              j,
                              AHP_SCALE[+e.target.value]
                            )
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
                    className="mt-2"
                  >
                    {ahpResults.consistent
                      ? "Konsisten (CR < 0.1)"
                      : "Tidak Konsisten"}
                  </Badge>
                )}
              </Card>
            ))}
          </div>

          <Card>
            <div className="px-5 py-4 border-b border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800">
                Bobot Kriteria (Eigen Vector)
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50">
                    {[
                      "Rank",
                      "Kriteria",
                      "Bobot (Priority Vector)",
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
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
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
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}