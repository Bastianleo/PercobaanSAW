import { useSPK } from "../../context/SPKContext";

import type { NormalizedAlternative } from "../../types";

import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Icon } from "../ui/Icon";

export function SAWPage() {
  const {
    criteria,
    alternatives,
    sawResults,
  } = useSPK();

  if (!alternatives.length || !criteria.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-400">
        <Icon name="calculator" size={40} />

        <p className="mt-3 text-sm">
          Tambahkan kriteria dan alternatif
          terlebih dahulu
        </p>
      </div>
    );
  }

  const normalized: NormalizedAlternative[] =
    alternatives.map((alt) => {
      const norm: Record<string, number> = {};

      criteria.forEach((c) => {
        const vals = alternatives.map(
          (a) => a.values[c.id] ?? 0
        );

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

      return {
        ...alt,
        norm,
      };
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Metode SAW
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Simple Additive Weighting —
          normalisasi & preferensi
        </p>
      </div>

      <Card>
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">
            Matriks Ternormalisasi
          </h3>

          <p className="text-xs text-slate-400 mt-0.5">
            Nilai dinormalisasi berdasarkan
            tipe benefit/cost
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Alternatif
                </th>

                {criteria.map((c) => (
                  <th
                    key={c.id}
                    className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide"
                  >
                    {c.name}

                    <span className="ml-1 text-[9px] text-slate-400">
                      ({c.type})
                    </span>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {normalized.map((a) => (
                <tr
                  key={a.id}
                  className="hover:bg-slate-50/50"
                >
                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                    {a.name}
                  </td>

                  {criteria.map((c) => (
                    <td
                      key={c.id}
                      className="px-5 py-3.5 text-sm text-slate-600"
                    >
                      {(
                        a.norm[c.id] ?? 0
                      ).toFixed(4)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">
            Hasil Ranking SAW
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                {[
                  "Rank",
                  "Alternatif",
                  "Skor Preferensi",
                  "Status",
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
              {sawResults.map((r) => (
                <tr
                  key={r.id}
                  className={`hover:bg-slate-50/50 ${
                    r.rank === 1
                      ? "bg-blue-50/40"
                      : ""
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        r.rank === 1
                          ? "bg-amber-400 text-white"
                          : r.rank === 2
                          ? "bg-slate-300 text-white"
                          : r.rank === 3
                          ? "bg-orange-300 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {r.rank}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                    {r.name}
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${r.score * 100}%`,
                          }}
                        />
                      </div>

                      <span className="text-sm font-mono text-slate-700">
                        {r.score.toFixed(4)}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    {r.rank === 1 ? (
                      <Badge color="green">
                        Terbaik
                      </Badge>
                    ) : (
                      <Badge color="gray">
                        Alternatif
                      </Badge>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}