export function uid(): string {
  return "id_" + Math.random().toString(36).slice(2);
}