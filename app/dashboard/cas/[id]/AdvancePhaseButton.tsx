"use client";

import { useMemo, useState } from "react";

type Props = {
  caId: string;
};

export default function AdvancePhaseButton({ caId }: Props) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  const label = useMemo(() => {
    if (loading) return "Avançando...";
    return "Avançar fase";
  }, [loading]);

  async function advance() {
    if (loading) return;

    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch(`/api/cas/${caId}/advance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(json?.message || "Erro ao avançar fase");
      }

      setMsg({ type: "ok", text: "Fase avançada com sucesso ✅" });

      // dá 400ms pra mostrar feedback e recarrega
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch (e: any) {
      setMsg({ type: "err", text: e?.message || "Erro inesperado" });
      setLoading(false);
    }
  }

  return (
    <div className="inline-flex flex-col gap-2">
      <button
        type="button"
        onClick={advance}
        disabled={loading}
        className={[
          // base
          "group relative inline-flex items-center justify-center gap-2",
          "rounded-xl px-4 py-2.5",
          "font-semibold text-white",
          "transition-all duration-200",
          "select-none",
          // gradiente + glow
          "bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500",
          "shadow-[0_10px_25px_rgba(16,185,129,0.35)]",
          "hover:shadow-[0_14px_35px_rgba(16,185,129,0.55)]",
          "active:scale-[0.98]",
          // borda “neon”
          "ring-1 ring-white/15",
          "hover:ring-white/25",
          // disabled
          "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100",
        ].join(" ")}
        aria-busy={loading}
        aria-label="Avançar fase do CA"
      >
        {/* brilho animado */}
        <span
          className={[
            "pointer-events-none absolute inset-0 rounded-xl",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
            "bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%),radial-gradient(circle_at_80%_60%,rgba(255,255,255,0.20),transparent_45%)]",
          ].join(" ")}
        />

        {/* conteúdo */}
        <span className="relative flex items-center gap-2">
          {loading ? (
            <Spinner />
          ) : (
            <ArrowIcon className="h-5 w-5 opacity-95 transition-transform duration-200 group-hover:translate-x-0.5" />
          )}

          <span className="tracking-tight">{label}</span>

          {!loading && (
            <span className="ml-1 rounded-full bg-black/20 px-2 py-0.5 text-xs font-bold text-white/90">
              GO
            </span>
          )}
        </span>
      </button>

      {msg && (
        <div
          className={[
            "text-sm",
            msg.type === "ok" ? "text-emerald-300" : "text-red-300",
          ].join(" ")}
        >
          {msg.text}
        </div>
      )}
    </div>
  );
}

function Spinner() {
  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center"
      aria-hidden="true"
    >
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
    </span>
  );
}

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      role="img"
      aria-hidden="true"
    >
      <path
        d="M5 12h12"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
