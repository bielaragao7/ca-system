export type CAStatus = "vencido" | "vencendo" | "ok";

export function getCAStatus(vencimento: string | Date): CAStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const venc = new Date(vencimento);
  venc.setHours(0, 0, 0, 0);

  const limit = new Date(today);
  limit.setMonth(limit.getMonth() + 8);

  if (venc < today) return "vencido";
  if (venc <= limit) return "vencendo";
  return "ok";
}

export function formatDateBR(date: string | Date) {
  const d = new Date(date);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function addMonthsISO(months: number) {
  const d = new Date();
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}
