import { useSPK } from "../../context/SPKContext";

import type { ExportItem } from "../../types";

import { exportToCSV } from "../../utils/export";

import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";

export function ExportPage() {
  const {
    criteria,
    alternatives,
    sawResults,
    ahpResults,
  } = useSPK();

  const exports: ExportItem[] = [
    {
      title: "Data Kriteria",

      desc: "Export daftar kriteria beserta bobot dan tipe",

      onClick: () =>
        exportToCSV(
          criteria.map((c, i) => ({
            No: i + 1,
            Nama: c.name,
            Bobot: c.weight,
            Tipe: c.type,
          })),
          "kriteria"
        ),
    },

    {
      title: "Data Alternatif",

      desc: "Export data alternatif beserta nilai tiap kriteria",

      onClick: () =>
        exportToCSV(
          alternatives.map((a, i) => ({
            No: i + 1,
            Nama: a.name,

            ...(Object.fromEntries(
              criteria.map((c) => [
                c.name,
                a.values[c.id] ?? 0,
              ])
            ) as Record<string, number>),
          })),
          "alternatif"
        ),
    },

    {
      title: "Hasil SAW",

      desc: "Export ranking hasil perhitungan metode SAW",

      onClick: () =>
        exportToCSV(
          sawResults.map((r) => ({
            Rank: r.rank,
            Alternatif: r.name,
            Skor: r.score,
          })),
          "hasil-saw"
        ),
    },

    {
      title: "Hasil AHP",

      desc: "Export bobot kriteria hasil perhitungan AHP",

      onClick: () =>
        ahpResults &&
        exportToCSV(
          [
            ...ahpResults.ranked,

            {
              name: "—",
              weight: "—",
              rank: "—",

              CI: ahpResults.CI,
              CR: ahpResults.CR,
            },
          ],
          "hasil-ahp"
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Export Data
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Download data dalam format CSV
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {exports.map((e) => (
          <Card
            key={e.title}
            className="p-5 hover:border-blue-200 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Icon
                  name="download"
                  size={18}
                />
              </div>

              <div className="flex-1">
                <h3 className="text-sm font-semibold text-slate-800">
                  {e.title}
                </h3>

                <p className="text-xs text-slate-500 mt-0.5 mb-3">
                  {e.desc}
                </p>

                <Button
                  onClick={e.onClick}
                  size="sm"
                >
                  <Icon
                    name="download"
                    size={13}
                  />

                  Export CSV
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-5">
        <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl">
          <Icon name="info" size={15} />

          <div className="text-xs text-amber-700 leading-relaxed">
            File akan diunduh dalam format
            CSV yang dapat dibuka dengan
            Microsoft Excel, Google Sheets,
            atau aplikasi spreadsheet
            lainnya.
          </div>
        </div>
      </Card>
    </div>
  );
}