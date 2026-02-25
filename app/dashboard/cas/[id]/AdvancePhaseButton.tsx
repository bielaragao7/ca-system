"use client";

import { useState } from "react";

export default function AdvancePhaseButton({ caId }: { caId: string }) {
  const [loading, setLoading] = useState(false);

  async function advance() {
    setLoading(true);
    try {
      const res = await fetch(`/api/cas/${caId}/advance`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.message || "Erro ao avançar fase");
      window.location.reload();
    } catch (e: any) {
      alert(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button onClick={advance} disabled={loading}>
      {loading ? "Avançando..." : "Avançar fase →"}
    </button>
  );
}