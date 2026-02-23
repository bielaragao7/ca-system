"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DeleteCAButton } from "./_components/DeleteCAButton";
import { StatusBadge } from "./_components/StatusBadge";

type CA = {
  id: string;
  ca_number: string;
  item_name: string;
  brand?: string | null;
  model?: string | null;
  supplier?: string | null;

  // data de vencimento (tente manter pelo menos um no select)
  vencimento?: string | null;
  expiration_date?: string | null;
  expires_at?: string | null;
};

export default function CasListPage() {
  const [cas, setCas] = useState<CA[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // ⚠️ ajuste os campos conforme sua tabela
      const { data, error } = await supabase
        .from("cas")
        .select("id, ca_number, item_name, brand, model, supplier, expires_at")
        .order("expires_at", { ascending: true })

      if (!error && data) setCas(data as CA[]);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700 }}>CAs</h1>

        <a
          href="/dashboard/cas/novo"
          style={{
            background: "#fff",
            color: "#000",
            padding: "10px 14px",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 700,
          }}
        >
          + Novo CA
        </a>
      </div>

      <div style={{ marginTop: 14, border: "1px solid #222", borderRadius: 12, overflow: "hidden" }}>
        {/* Cabeçalho */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "140px 1fr 140px 140px 1fr 120px 100px",
            padding: 12,
            borderBottom: "1px solid #222",
            color: "#aaa",
            fontWeight: 600,
            background: "#0b0b0b",
          }}
        >
          <div>CA</div>
          <div>Item</div>
          <div>Marca</div>
          <div>Modelo</div>
          <div>Fornecedor</div>
          <div>Status</div>
          <div>Ações</div>
        </div>

        {/* Conteúdo */}
        {loading ? (
          <div style={{ padding: 14, color: "#aaa" }}>Carregando...</div>
        ) : cas.length === 0 ? (
          <div style={{ padding: 14, color: "#aaa" }}>Nenhum CA encontrado.</div>
        ) : (
          cas.map((c) => {
            const vencStr = c.vencimento ?? c.expiration_date ?? c.expires_at ?? null;

            return (
              <div
                key={c.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr 140px 140px 1fr 120px 100px",
                  padding: 12,
                  borderBottom: "1px solid #222",
                  alignItems: "center",
                  gap: 10,
                  color: "#fff",
                }}
              >
                <a
                  href={`/dashboard/cas/${encodeURIComponent(c.ca_number)}`}
                  style={{
                    textDecoration: "none",
                    color: "#fff",
                    fontWeight: 700,
                  }}
                >
                  {c.ca_number}
                </a>

                <div>{c.item_name}</div>
                <div>{c.brand ?? "-"}</div>
                <div>{c.model ?? "-"}</div>
                <div>{c.supplier ?? "-"}</div>

                <div>
                  <StatusBadge vencimento={vencStr ?? ""} />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <DeleteCAButton id={c.id} />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}