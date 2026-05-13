export function exportToCSV(data: Record<string, any>[], filename: string): void {
  if (!data.length) return;

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((r) => Object.values(r).join(",")).join("\n");
  const blob = new Blob([headers + "\n" + rows], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".csv";
  a.click();
  URL.revokeObjectURL(url);
}