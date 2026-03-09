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
  expires_at?: string | null;

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

function getVencimentoInfo(value?: string | null) {
  if (!value) {
    return {
      label: "Sem data",
      bg: "#6b7280",
      color: "#fff",
    };
  }

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const venc = new Date(value);
  venc.setHours(0, 0, 0, 0);

  const diffMs = venc.getTime() - hoje.getTime();
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDias < 0) {
    return {
      label: "Vencido",
      bg: "#4b5563",
      color: "#fff",
    };
  }

  if (diffDias <= 150) {
    return {
      label: "Crítico",
      bg: "#dc2626",
      color: "#fff",
    };
  }

  if (hoje.getFullYear() === venc.getFullYear()) {
    return {
      label: "Atenção",
      bg: "#facc15",
      color: "#111",
    };
  }

  return {
    label: "OK",
    bg: "#16a34a",
    color: "#fff",
  };
}

const columns =
  "110px 140px 260px 180px 160px 200px 100px 140px 120px 220px 120px";

const cellStyle: React.CSSProperties = {
  padding: "10px 8px",
  borderRight: "1px solid #8c8c8c",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textAlign: "center",
  minHeight: 52,
};

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
          expires_at,
          tipo,
          tecido,
          aprovacao_para,
          fabricante,
          composicao,
          referencia,
          data_at,
          normas
        `)
        .order("expires_at", { ascending: true });

      if (error) {
        console.error(error);
        alert("Erro ao carregar CAs: " + error.message);
        setCas([]);
        setLoading(false);
        return;
      }

      setCas((data as CA[]) ?? []);
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
          marginBottom: 14,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: 0 }}>CAs</h1>
          <p style={{ margin: "6px 0 0 0", opacity: 0.7, fontSize: 13 }}>
            Visual técnico em formato de planilha.
          </p>
        </div>

        <a
          href="/dashboard/cas/novo"
          style={{
            background: "var(--potencia-orange)",
            color: "#fff",
            padding: "10px 14px",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 800,
            boxShadow: "0 8px 18px rgba(255,122,0,0.25)",
          }}
        >
          + Novo CA
        </a>
      </div>

      <div
        style={{
          border: "1px solid #555",
          borderRadius: 12,
          overflow: "hidden",
          background: "#d9d9d9",
          boxShadow: "0 10px 24px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ overflowX: "auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: columns,
              borderBottom: "1px solid #7a7a7a",
              color: "#fff",
              fontWeight: 700,
              background: "#8f98a3",
              fontSize: 12,
              minWidth: 1760,
            }}
          >
            <div style={cellStyle}>TIPO</div>
            <div style={cellStyle}>TECIDO</div>
            <div style={cellStyle}>APROVAÇÃO PARA</div>
            <div style={cellStyle}>FABRICANTE</div>
            <div style={cellStyle}>COMPOSIÇÃO</div>
            <div style={cellStyle}>REFERÊNCIA</div>
            <div style={cellStyle}>Nº CA</div>
            <div style={cellStyle}>VENCIMENTO</div>
            <div style={cellStyle}>DATA AT</div>
            <div style={cellStyle}>NORMAS</div>
            <div style={{ ...cellStyle, borderRight: "none" }}>AÇÕES</div>
          </div>

          {loading ? (
            <div style={{ padding: 16 }}>Carregando...</div>
          ) : cas.length === 0 ? (
            <div style={{ padding: 16 }}>Nenhum CA encontrado.</div>
          ) : (
            cas.map((c, index) => {
              const vencStr = c.expires_at ?? null;

              const tipo = c.tipo ?? c.item_name ?? "-";
              const tecido = c.tecido ?? c.brand ?? "-";
              const aprovacaoPara = c.aprovacao_para ?? "-";
              const fabricante = c.fabricante ?? c.supplier ?? "-";
              const composicao = c.composicao ?? "-";
              const referencia = c.referencia ?? c.model ?? "-";
              const dataAtual = c.data_at ?? "-";
              const normas = c.normas ?? "-";

              const vencInfo = getVencimentoInfo(vencStr);

              return (
                <div
                  key={c.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: columns,
                    minWidth: 1760,
                    background: index % 2 === 0 ? "#dcdcdc" : "#d4d4d4",
                    borderBottom: "1px solid #8c8c8c",
                    fontSize: 13,
                  }}
                >
                  <div style={cellStyle}>{tipo}</div>
                  <div style={cellStyle}>{tecido}</div>
                  <div style={cellStyle}>{aprovacaoPara}</div>
                  <div style={cellStyle}>{fabricante}</div>
                  <div style={cellStyle}>{composicao}</div>
                  <div style={cellStyle}>{referencia}</div>

                  <a
                    href={`/dashboard/cas/${encodeURIComponent(c.ca_number)}`}
                    style={{
                      ...cellStyle,
                      fontWeight: 800,
                      textDecoration: "none",
                      color: "#111",
                    }}
                  >
                    {c.ca_number}
                  </a>

                  <div style={cellStyle}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          background: vencInfo.bg,
                          color: vencInfo.color,
                          padding: "4px 10px",
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 800,
                        }}
                      >
                        {vencInfo.label}
                      </span>

                      {formatDate(vencStr)}
                    </div>
                  </div>

                  <div style={cellStyle}>{formatDate(dataAtual)}</div>
                  <div style={cellStyle}>{normas}</div>

                  <div
                    style={{
                      ...cellStyle,
                      borderRight: "none",
                      justifyContent: "center",
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
    </div>
  );
}
