import { useSPK } from "../../context/SPKContext";
import type { StatItem } from "../../types";

import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Icon } from "../ui/Icon";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardPageProps {
  setPage: (page: string) => void;
}

export function DashboardPage({
  setPage,
}: DashboardPageProps) {
  const {
    criteria,
    alternatives,
    sawResults,
    ahpResults,
  } = useSPK();

  const top3 = sawResults.slice(0, 3);

  const chartData = sawResults.map((r) => ({
    name: r.name,
    SAW: +(r.score * 100).toFixed(1),
  }));

  const stats: StatItem[] = [
    {
      label: "Total Kriteria",
      value: criteria.length,
      icon: "list",
      color: "blue",
    },
    {
      label: "Total Alternatif",
      value: alternatives.length,
      icon: "users",
      color: "indigo",
    },
    {
      label: "Benefit Kriteria",
      value: criteria.filter(
        (c) => c.type === "benefit"
      ).length,
      icon: "chart",
      color: "emerald",
    },
    {
      label: "Cost Kriteria",
      value: criteria.filter(
        (c) => c.type === "cost"
      ).length,
      icon: "calculator",
      color: "amber",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Ringkasan sistem pendukung keputusan
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="p-5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                stat.color === "blue"
                  ? "bg-blue-100 text-blue-600"
                  : stat.color === "indigo"
                  ? "bg-indigo-100 text-indigo-600"
                  : stat.color === "emerald"
                  ? "bg-emerald-100 text-emerald-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              <Icon name={stat.icon as any} size={16} />
            </div>

            <div className="text-2xl font-bold text-slate-800">
              {stat.value}
            </div>

            <div className="text-xs text-slate-500 mt-0.5">
              {stat.label}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-800">
              Ranking SAW
            </h3>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPage("saw")}
            >
              Lihat Semua
            </Button>
          </div>

          <div className="space-y-2">
            {top3.map((r, i) => (
              <div
                key={r.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-50"
              >
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    i === 0
                      ? "bg-amber-400 text-white"
                      : i === 1
                      ? "bg-slate-400 text-white"
                      : "bg-orange-300 text-white"
                  }`}
                >
                  {r.rank}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">
                    {r.name}
                  </p>

                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{
                          width: `${r.score * 100}%`,
                        }}
                      />
                    </div>

                    <span className="text-xs text-slate-500 font-medium">
                      {(r.score * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">
            Skor Perbandingan
          </h3>

          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={28}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
              />

              <XAxis
                dataKey="name"
                tick={{
                  fontSize: 11,
                  fill: "#94a3b8",
                }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                tick={{
                  fontSize: 11,
                  fill: "#94a3b8",
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow:
                    "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                  fontSize: "12px",
                }}
              />

              <Bar
                dataKey="SAW"
                fill="#3b82f6"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {ahpResults && (
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">
                Status AHP
              </h3>

              <p className="text-xs text-slate-500 mt-0.5">
                Consistency Ratio check
              </p>
            </div>

            <Badge
              color={
                ahpResults.consistent
                  ? "green"
                  : "red"
              }
            >
              {ahpResults.consistent
                ? "Konsisten"
                : "Tidak Konsisten"}
            </Badge>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-lg font-bold text-slate-800">
                {ahpResults.CI}
              </p>

              <p className="text-xs text-slate-500">
                CI (Consistency Index)
              </p>
            </div>

            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p
                className={`text-lg font-bold ${
                  ahpResults.consistent
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {ahpResults.CR}
              </p>

              <p className="text-xs text-slate-500">
                CR (Consistency Ratio)
              </p>
            </div>

            <div className="text-center p-3 bg-slate-50 rounded-xl">
              <p className="text-lg font-bold text-blue-600">
                {criteria.length}
              </p>

              <p className="text-xs text-slate-500">
                Jumlah Kriteria
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}