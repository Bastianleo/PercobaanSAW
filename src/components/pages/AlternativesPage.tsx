import { useState } from "react";

import { useSPK } from "../../context/SPKContext";

import type { AlternativeForm } from "../../types";

import { uid } from "../../utils/helpers";

import { Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Icon } from "../ui/Icon";

export function AlternativesPage() {
  const {
    criteria,
    alternatives,
    addAlternative,
    updateAlternative,
    deleteAlternative,
  } = useSPK();

  const [form, setForm] = useState<AlternativeForm>({
    name: "",
    values: {},
  });

  const [editId, setEditId] = useState<string | null>(null);

  const handleSave = () => {
    if (!form.name) return;

    const vals: Record<string, number> = {};

    criteria.forEach((c) => {
      vals[c.id] = +(form.values[c.id] || 0);
    });

    if (editId) {
      updateAlternative(editId, {
        name: form.name,
        values: vals,
      });

      setEditId(null);
    } else {
      addAlternative({
        id: uid(),
        name: form.name,
        values: vals,
      });
    }

    setForm({
      name: "",
      values: {},
    });
  };

  const handleEdit = (a: any) => {
    setEditId(a.id);

    setForm({
      name: a.name,
      values: { ...a.values },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Manajemen Alternatif
        </h1>

        <p className="text-slate-500 text-sm mt-1">
          Input data alternatif untuk setiap kriteria
        </p>
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">
          {editId
            ? "Edit Alternatif"
            : "Tambah Alternatif"}
        </h3>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <Input
            label="Nama Alternatif"
            placeholder="Contoh: Produk A"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          {criteria.map((c) => (
            <Input
              key={c.id}
              label={`${c.name} (${c.type})`}
              placeholder="Masukkan nilai"
              type="number"
              value={form.values[c.id] || ""}
              onChange={(e) =>
                setForm({
                  ...form,
                  values: {
                    ...form.values,
                    [c.id]: e.target.value,
                  },
                })
              }
            />
          ))}
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
                  values: {},
                });
              }}
            >
              Batal
            </Button>
          )}
        </div>
      </Card>

      <Card>
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-sm font-semibold text-slate-800">
            Tabel Data Alternatif
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  #
                </th>

                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Alternatif
                </th>

                {criteria.map((c) => (
                  <th
                    key={c.id}
                    className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide"
                  >
                    {c.name}
                  </th>
                ))}

                <th className="text-left px-5 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {alternatives.map((a, i) => (
                <tr
                  key={a.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-5 py-3.5 text-sm text-slate-400">
                    {i + 1}
                  </td>

                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">
                    {a.name}
                  </td>

                  {criteria.map((c) => (
                    <td
                      key={c.id}
                      className="px-5 py-3.5 text-sm text-slate-600"
                    >
                      {a.values[c.id] ?? "-"}
                    </td>
                  ))}

                  <td className="px-5 py-3.5">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleEdit(a)
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
                          deleteAlternative(a.id)
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