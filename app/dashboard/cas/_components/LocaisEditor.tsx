"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

type LocalRow = {
  local: string;
  ativo: boolean;
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Lista padrão (você pode editar depois)
const LOCAIS_PADRAO = [
  "Compras",
  "Fornecedor",
  "SESMT",
  "Laboratório",
  "MTE",
  "Qualidade",
  "Diretoria",
  "Estoque de Tecidos",
];

export default function LocaisEditor({
  caId,
  initialLocais,
}: {
  caId: string;
  initialLocais: LocalRow[];
}) {
  const [locais, setLocais] = useState<LocalRow[]>(initialLocais || []);
  const [loading, setLoading] = useState(false);

  const ativos = new Set(locais.filter((l) => l.ativo).map((l) => l.local));

  async function toggleLocal(local: string) {
    setLoading(true);
    try {
      const isAtivo = ativos.has(local);

      if (isAtivo) {
        // desativar
        const { error } = await supabase
          .from("ca_locais")
          .update({ ativo: false })
          .eq("ca_id", caId)
          .eq("local", local);

        if (error) throw error;

        setLocais((prev) =>
          prev.map((x) => (x.local === local ? { ...x, ativo: false } : x))
        );
      } else {
        // se já existe inativo, reativa; senão, insere
        const existe = locais.find((x) => x.local === local);

        if (existe) {
          const { error } = await supabase
            .from("ca_locais")
            .update({ ativo: true })
            .eq("ca_id", caId)
            .eq("local", local);

          if (error) throw error;

          setLocais((prev) =>
            prev.map((x) => (x.local === local ? { ...x, ativo: true } : x))
          );
        } else {
          const { error } = await supabase.from("ca_locais").insert({
            ca_id: caId,
            local,
            ativo: true,
          });

          if (error) throw error;

          setLocais((prev) => [...prev, { local, ativo: true }]);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        marginTop: 14,
        padding: 14,
        borderRadius: 14,
        border: "1px solid rgba(255,255,255,0.12)",
        background: "rgba(24,24,27,0.6)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16 }}>Locais (onde o CA está)</h3>
          <p style={{ marginTop: 6, opacity: 0.8, fontSize: 13 }}>
            Você pode marcar mais de um local ao mesmo tempo.
          </p>
        </div>
        {loading ? (
          <div style={{ opacity: 0.8, fontSize: 13 }}>Salvando...</div>
        ) : null}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 10 }}>
        {LOCAIS_PADRAO.map((local) => {
          const on = ativos.has(local);
          return (
            <button
              key={local}
              onClick={() => toggleLocal(local)}
              disabled={loading}
              style={{
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                padding: "7px 12px",
                borderRadius: 999,
                border: on
                  ? "1px solid rgba(34,197,94,0.45)"
                  : "1px solid rgba(255,255,255,0.14)",
                background: on ? "rgba(34,197,94,0.18)" : "rgba(255,255,255,0.06)",
                color: "white",
                fontSize: 13,
                fontWeight: 600,
              }}
              type="button"
            >
              {on ? "✓ " : ""}{local}
            </button>
          );
        })}
      </div>
    </div>
  );
}