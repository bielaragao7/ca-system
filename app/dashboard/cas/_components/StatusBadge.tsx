export function StatusBadge({ vencimento }: { vencimento: string }) {
  const today = new Date();
  const venc = new Date(vencimento);

  const limit = new Date();
  limit.setMonth(limit.getMonth() + 8);

  if (venc < today) {
    return (
      <span className="rounded-full bg-red-500/20 px-3 py-1 text-xs font-medium text-red-400">
        Vencido
      </span>
    );
  }

  if (venc <= limit) {
    return (
      <span className="rounded-full bg-yellow-500/20 px-3 py-1 text-xs font-medium text-yellow-400">
        Vencendo (8m)
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs font-medium text-green-400">
      OK
    </span>
  );
}