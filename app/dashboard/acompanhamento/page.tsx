import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CA = {
  id: string;
  ca_number: string | null;
  item_name: string | null;
  status_processo: string | null;
  etapa_atual: string | null;
  andamento_atualizado_em: string | null;
};

function formatDateBR(iso?: string | null) {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleString("pt-BR");
}

function statusBadgeClass(status?: string | null) {
  const s = (status || "").toLowerCase();

  if (s.includes("aprov")) return "bg-green-600/20 text-green-300 border-green-600/30";
  if (s.includes("reprov") || s.includes("cancel") || s.includes("susp")) return "bg-red-600/20 text-red-300 border-red-600/30";
  if (s.includes("analise")) return "bg-yellow-600/20 text-yellow-300 border-yellow-600/30";
  if (s.includes("aguard")) return "bg-blue-600/20 text-blue-300 border-blue-600/30";

  return "bg-zinc-700/30 text-zinc-200 border-zinc-600/30";
}

export default async function AcompanhamentoPage() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // server component: não precisa setar cookies aqui
        },
      },
    }
  );

  const { data, error } = await supabase
    .from("cas")
    .select("id, ca_number, item_name, status_processo, etapa_atual, andamento_atualizado_em")
    .order("etapa_atual", { ascending: true });

  const cas = (data || []) as CA[];

  // Agrupa por fase
  const grouped = cas.reduce((acc, ca) => {
    const fase = ca.etapa_atual?.trim() || "Sem fase";
    if (!acc[fase]) acc[fase] = [];
    acc[fase].push(ca);
    return acc;
  }, {} as Record<string, CA[]>);

  // Ordena as fases: "Sem fase" primeiro, depois alfabético
  const fases = Object.keys(grouped).sort((a, b) => {
    if (a === "Sem fase") return -1;
    if (b === "Sem fase") return 1;
    return a.localeCompare(b);
  });

  return (
    <div style={{ padding: 24 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>Acompanhar CAs</h1>
          <p style={{ marginTop: 6, opacity: 0.8 }}>
            Aqui você vê em qual fase cada CA está (atualiza quando você avança fase).
          </p>
          {error ? (
            <p style={{ color: "tomato" }}>Erro ao buscar CAs: {error.message}</p>
          ) : null}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <Link
            href="/dashboard/cas"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.12)",
              textDecoration: "none",
              color: "white",
            }}
          >
            Ver lista
          </Link>

          <Link
            href="/dashboard/cas/novo"
            style={{
              padding: "10px 14px",
              borderRadius: 10,
              background: "#22c55e",
              textDecoration: "none",
              color: "black",
              fontWeight: 700,
            }}
          >
            Novo CA
          </Link>
        </div>
      </div>

      {/* Kanban */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 14,
          marginTop: 18,
        }}
      >
        {fases.map((fase) => (
          <div
            key={fase}
            style={{
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 14,
              padding: 12,
              background: "rgba(24,24,27,0.6)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontWeight: 800 }}>{fase}</div>
              <div
                style={{
                  fontSize: 12,
                  padding: "4px 8px",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.12)",
                  opacity: 0.9,
                }}
              >
                {grouped[fase].length}
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {grouped[fase].map((ca) => (
                <Link
                  key={ca.id}
                  href={`/dashboard/cas/${encodeURIComponent(ca.ca_number || ca.id)}`}
                  style={{
                    display: "block",
                    textDecoration: "none",
                    color: "white",
                    borderRadius: 12,
                    padding: 12,
                    background: "rgba(39,39,42,0.7)",
                    border: "1px solid rgba(255,255,255,0.10)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ fontWeight: 800 }}>CA: {ca.ca_number || "-"}</div>
                    <span
                      className={statusBadgeClass(ca.status_processo)}
                      style={{
                        fontSize: 12,
                        padding: "4px 8px",
                        borderRadius: 999,
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      {ca.status_processo || "sem_status"}
                    </span>
                  </div>

                  <div style={{ marginTop: 6, opacity: 0.9 }}>{ca.item_name || "-"}</div>

                  <div style={{ marginTop: 8, fontSize: 12, opacity: 0.7 }}>
                    Atualizado: {formatDateBR(ca.andamento_atualizado_em)}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}