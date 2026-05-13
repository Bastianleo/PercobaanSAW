import { useSPK } from "../../context/SPKContext";

import type {
  CombinedResult,
  RadarDataPoint,
} from "../../types";

import { Card } from "../ui/Card";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function ResultsPage() {
  const {
    criteria,
    sawResults,
    ahpResults,
  } = useSPK();

  const combined: CombinedResult[] =
    sawResults
      .map((s) => {
        const ahpW =
          ahpResults?.ranked.find(
            (r) => r.id === s.id
          )?.weight ?? 0;

        return {
          ...s,
          sawScore: s.score,
          ahpWeight: ahpW,
          combined: +(
            s.score * 0.5 +
            ahpW * 0.5
          ).toFixed(4),
        };
      })
      .sort((a, b) => b.combined - a.combined);

  const radarData: RadarDataPoint[] =
    criteria.map((c) => ({
      subject: c.name,

      ...(Object.fromEntries(
        sawResults.slice(0, 3).map((r) => [
          r.name,
          +(r.norm?.[c.id] ?? 0).toFixed(2),
        ])
      ) as Record<string, number>),
    }));

  const COLORS = [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Hasil Akhir
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Perbandingan ranking SAW & AHP
        </p>
      </div>

      {combined[0] && (
        <Card className="p-5 border-blue-100 bg-gradient-to-br from-blue-50/50 to-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center shadow-lg shadow-amber-200 text-white font-bold text-lg">
              1
            </div>

            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                Rekomendasi Terbaik
              </p>

              <h2 className="text-xl font-bold text-slate-800 mt-0.5">
                {combined[0].name}
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Skor SAW:{" "}
                <strong>
                  {combined[0].sawScore.toFixed(4)}
                </strong>

                {" · "}

                Bobot AHP:{" "}
                <strong>
                  {combined[0].ahpWeight.toFixed(4)}
                </strong>
              </p>
            </div>
          </div>
        </Card>
      )}

      <Card>
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">
            Tabel Perbandingan Metode
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                {[
                  "Rank",
                  "Alternatif",
                  "Skor SAW",
                  "Bobot AHP",
                  "Skor Gabungan",
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
              {combined.map((r, i) => (
                <tr
                  key={r.id}
                  className={`hover:bg-slate-50/50 ${
                    i === 0
                      ? "bg-blue-50/30"
                      : ""
                  }`}
                >
                  <td className="px-5 py-3.5">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                        i === 0
                          ? "bg-amber-400 text-white"
                          : i === 1
                          ? "bg-slate-300 text-white"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {i + 1}
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                    {r.name}
                  </td>

                  <td className="px-5 py-3.5 text-sm font-mono text-slate-700">
                    {r.sawScore.toFixed(4)}
                  </td>

                  <td className="px-5 py-3.5 text-sm font-mono text-slate-700">
                    {r.ahpWeight.toFixed(4)}
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${r.combined * 100}%`,
                          }}
                        />
                      </div>

                      <span className="text-sm font-mono font-medium text-blue-700">
                        {r.combined.toFixed(4)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">
          Radar Chart Top 3 Alternatif
        </h3>

        <ResponsiveContainer
          width="100%"
          height={250}
        >
          <RadarChart data={radarData}>
            <PolarGrid stroke="#e2e8f0" />

            <PolarAngleAxis
              dataKey="subject"
              tick={{
                fontSize: 11,
                fill: "#94a3b8",
              }}
            />

            {sawResults
              .slice(0, 3)
              .map((r, i) => (
                <Radar
                  key={r.id}
                  name={r.name}
                  dataKey={r.name}
                  stroke={COLORS[i]}
                  fill={COLORS[i]}
                  fillOpacity={0.12}
                  strokeWidth={2}
                />
              ))}

            <Tooltip
              contentStyle={{
                borderRadius: "12px",
                border:
                  "1px solid #e2e8f0",
                fontSize: "12px",
              }}
            />
          </RadarChart>
        </ResponsiveContainer>

        <div className="flex flex-wrap gap-3 mt-3 justify-center">
          {sawResults
            .slice(0, 3)
            .map((r, i) => (
              <div
                key={r.id}
                className="flex items-center gap-1.5 text-xs text-slate-600"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    background: COLORS[i],
                  }}
                />

                {r.name}
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
}