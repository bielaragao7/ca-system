"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { DeleteCAButton } from "./_components/DeleteCAButton";

type CA = {
  id: string;
  ca_number: string;
  item_name: string;
  brand?: string | null;
  model?: string | null;
  supplier?: string | null;
  vencimento?: string | null;
  expiration_date?: string | null;
  expires_at?: string | null;

  // futuros campos da planilha
  tipo?: string | null;
  tecido?: string | null;
  aprovacao_para?: string | null;
  fabricante?: string | null;
  composicao?: string | null;
  referencia?: string | null;
  data_at?: string | null;
  normas?: string | null;
};

function formatDate(value?: string | null) {
  if (!value) return "-";

  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;

  return d.toLocaleDateString("pt-BR");
}

export default function CasListPage() {
  const [cas, setCas] = useState<CA[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const { data, error } = await supabase
        .from("cas")
        .select(`
          id,
          ca_number,
          item_name,
          brand,
          model,
          supplier,
          expires_at
        `)
        .order("expires_at", { ascending: true });

      if (!error && data) {
        setCas(data as CA[]);
      }

      setLoading(false);
    }

    load();
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <h1 style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>CAs</h1>

        <a
          href="/dashboard/cas/novo"
          style={{
            background: "var(--potencia-orange)",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 700,
            boxShadow: "0 8px 18px rgba(255,122,0,0.25)",
          }}
        >
          + Novo CA
        </a>
      </div>

      <div
        style={{
          marginTop: 14,
          border: "1px solid #555",
          borderRadius: 12,
          overflowX: "auto",
          background: "#d9d9d9",
        }}
      >
        {/* Cabeçalho */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "140px 140px 280px 220px 180px 180px 100px 120px 120px 220px 120px",
            padding: 10,
            borderBottom: "1px solid #7a7a7a",
            color: "#fff",
            fontWeight: 700,
            background: "#8f98a3",
            fontSize: 13,
            gap: 0,
          }}
        >
          <div style={{ padding: "0 6px" }}>TIPO</div>
          <div style={{ padding: "0 6px" }}>TECIDO</div>
          <div style={{ padding: "0 6px" }}>APROVAÇÃO PARA</div>
          <div style={{ padding: "0 6px" }}>FABRICANTE</div>
          <div style={{ padding: "0 6px" }}>COMPOSIÇÃO</div>
          <div style={{ padding: "0 6px" }}>REFERÊNCIA</div>
          <div style={{ padding: "0 6px" }}>Nº CA</div>
          <div style={{ padding: "0 6px" }}>VENCIMENTO</div>
          <div style={{ padding: "0 6px" }}>DATA AT</div>
          <div style={{ padding: "0 6px" }}>NORMAS</div>
          <div style={{ padding: "0 6px" }}>AÇÕES</div>
        </div>

        {/* Conteúdo */}
        {loading ? (
          <div style={{ padding: 14, color: "#333" }}>Carregando...</div>
        ) : cas.length === 0 ? (
          <div style={{ padding: 14, color: "#333" }}>Nenhum CA encontrado.</div>
        ) : (
          cas.map((c) => {
            const vencStr = c.vencimento ?? c.expiration_date ?? c.expires_at ?? null;

            // Mapeamento temporário com os campos atuais
            const tipo = c.tipo ?? c.item_name ?? "-";
            const tecido = c.tecido ?? c.brand ?? "-";
            const aprovacaoPara = c.aprovacao_para ?? "-";
            const fabricante = c.fabricante ?? c.supplier ?? "-";
            const composicao = c.composicao ?? "-";
            const referencia = c.referencia ?? c.model ?? "-";
            const dataAtual = c.data_at ?? "-";
            const normas = c.normas ?? "-";

            return (
              <div
                key={c.id}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "140px 140px 280px 220px 180px 180px 100px 120px 120px 220px 120px",
                  padding: 0,
                  borderBottom: "1px solid #8c8c8c",
                  alignItems: "stretch",
                  color: "#111",
                  background: "#dcdcdc",
                }}
              >
                <div style={{ padding: 10, borderRight: "1px solid #8c8c8c" }}>{tipo}</div>
                <div style={{ padding: 10, borderRight: "1px solid #8c8c8c" }}>{tecido}</div>
                <div style={{ padding: 10, borderRight: "1px solid #8c8c8c" }}>{aprovacaoPara}</div>
                <div style={{ padding: 10, borderRight: "1px solid #8c8c8c" }}>{fabricante}</div>
                <div style={{ padding: 10, borderRight: "1px solid #8c8c8c" }}>{composicao}</div>
                <div style={{ padding: 10, borderRight: "1px solid #8c8c8c" }}>{referencia}</div>

                <a
                  href={`/dashboard/cas/${encodeURIComponent(c.ca_number)}`}
                  style={{
                    padding: 10,
                    borderRight: "1px solid #8c8c8c",
                    textDecoration: "none",
                    color: "#111",
                    fontWeight: 700,
                  }}
                >
                  {c.ca_number}
                </a>

                <div style={{ padding: 10, borderRight: "1px solid #8c8c8c" }}>
                  {formatDate(vencStr)}
                </div>

                <div style={{ padding: 10, borderRight: "1px solid #8c8c8c" }}>
                  {formatDate(dataAtual)}
                </div>

                <div style={{ padding: 10, borderRight: "1px solid #8c8c8c" }}>{normas}</div>

                <div
                  style={{
                    padding: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
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
