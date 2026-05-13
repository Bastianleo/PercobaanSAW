import { useState } from "react";

import { useSPK } from "../../context/SPKContext";

import type { CriteriaForm } from "../../types";

import { uid } from "../../utils/helpers";

import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Icon } from "../ui/Icon";

export function CriteriaPage() {
  const {
    criteria,
    addCriteria,
    updateCriteria,
    deleteCriteria,
  } = useSPK();

  const [form, setForm] = useState<CriteriaForm>({
    name: "",
    weight: "",
    type: "benefit",
  });

  const [editId, setEditId] = useState<string | null>(null);

  const totalWeight = criteria.reduce(
    (s, c) => s + c.weight,
    0
  );

  const handleSave = () => {
    if (!form.name || !form.weight) return;

    if (editId) {
      updateCriteria(editId, {
        name: form.name,
        weight: +form.weight,
        type: form.type,
      });

      setEditId(null);
    } else {
      addCriteria({
        id: uid(),
        name: form.name,
        weight: +form.weight,
        type: form.type,
      });
    }

    setForm({
      name: "",
      weight: "",
      type: "benefit",
    });
  };

  const handleEdit = (c: any) => {
    setEditId(c.id);

    setForm({
      name: c.name,
      weight: String(c.weight),
      type: c.type,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Manajemen Kriteria
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Kelola kriteria dan bobot penilaian
        </p>
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">
          {editId
            ? "Edit Kriteria"
            : "Tambah Kriteria Baru"}
        </h3>

        <div className="grid sm:grid-cols-3 gap-4 mb-4">
          <Input
            label="Nama Kriteria"
            placeholder="Contoh: Harga"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          <Input
            label="Bobot (0–1)"
            placeholder="Contoh: 0.3"
            type="number"
            step="0.01"
            min="0"
            max="1"
            value={form.weight}
            onChange={(e) =>
              setForm({
                ...form,
                weight: e.target.value,
              })
            }
          />

          <Select
            label="Tipe"
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as
                  | "benefit"
                  | "cost",
              })
            }
          >
            <option value="benefit">
              Benefit
            </option>

            <option value="cost">
              Cost
            </option>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSave}>
            <Icon name="plus" size={14} />

            {editId ? "Update" : "Tambah"}
          </Button>

          {editId && (
            <Button
              variant="secondary"
              onClick={() => {
                setEditId(null);

                setForm({
                  name: "",
                  weight: "",
                  type: "benefit",
                });
              }}
            >
              Batal
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-800">
            Daftar Kriteria
          </h3>

          <Badge
            color={
              Math.abs(totalWeight - 1) < 0.001
                ? "green"
                : "amber"
            }
          >
            Total Bobot: {totalWeight.toFixed(2)}
          </Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                {[
                  "#",
                  "Nama Kriteria",
                  "Bobot",
                  "Tipe",
                  "Aksi",
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
              {criteria.map((c, i) => (
                <tr
                  key={c.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5 text-sm text-slate-400">
                    {i + 1}
                  </td>

                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                    {c.name}
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{
                            width: `${c.weight * 100}%`,
                          }}
                        />
                      </div>

                      <span className="text-sm text-slate-600">
                        {c.weight}
                      </span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5">
                    <Badge
                      color={
                        c.type === "benefit"
                          ? "green"
                          : "red"
                      }
                    >
                      {c.type}
                    </Badge>
                  </td>

                  <td className="px-5 py-3.5">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleEdit(c)
                        }
                      >
                        <Icon
                          name="edit"
                          size={13}
                        />
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() =>
                          deleteCriteria(c.id)
                        }
                      >
                        <Icon
                          name="trash"
                          size={13}
                        />
                      </Button>
                    </div>
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