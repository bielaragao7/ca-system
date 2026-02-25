import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import AdvancePhaseButton from "./AdvancePhaseButton";

export default async function CaDetalhePage({
  params,
}: {
  params: { id: string };
}) {
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

  const caNumber = decodeURIComponent(params.id);

 const { data: ca, error: caErr } = await supabase
  .from("cas")
  .select(`
    id,
    ca_number,
    item_name,
    brand,
    model,
    supplier,
    status_macro,
    fase_atual_id,
    fase_atual:ca_fases (
      id,
      ordem,
      nome
    )
  `)
  .eq("ca_number", caNumber)
  .single();

  if (caErr || !ca) {
    return (
      <div>
        <h1 style={{ marginTop: 0 }}>Detalhe do CA</h1>
        <p>Nenhum CA encontrado.</p>
        <a href="/dashboard/cas" style={{ color: "#fff" }}>
          Voltar
        </a>
      </div>
    );
  }

  const faseAtual =
    Array.isArray((ca as any).fase_atual) && (ca as any).fase_atual.length > 0
      ? (ca as any).fase_atual[0]
      : null;

  const { data: passagens } = await supabase
    .from("ca_passagens")
    .select("id, fase_ordem, fase_nome, status, iniciado_em, finalizado_em")
    .eq("ca_id", ca.id)
    .order("iniciado_em", { ascending: false });

  return (
    <div style={{ maxWidth: 820 }}>
      <h1 style={{ marginTop: 0 }}>Detalhe do CA</h1>

      <div style={{ border: "1px solid #222", borderRadius: 10, padding: 16 }}>
        <p>
          <strong>Nº CA:</strong> {ca.ca_number}
        </p>
        <p>
          <strong>Item:</strong> {ca.item_name}
        </p>
        <p>
          <strong>Marca:</strong> {ca.brand ?? "-"}
        </p>
        <p>
          <strong>Modelo:</strong> {ca.model ?? "-"}
        </p>
        <p>
          <strong>Fornecedor:</strong> {ca.supplier ?? "-"}
        </p>

        <hr style={{ borderColor: "#222", margin: "14px 0" }} />

        <p>
          <strong>Status:</strong> {(ca as any).status_macro ?? "ATIVO"}
        </p>

        <p>
          <strong>Fase atual:</strong>{" "}
          {faseAtual ? `${faseAtual.ordem} — ${faseAtual.nome}` : "—"}
        </p>

        <div style={{ marginTop: 12 }}>
          <AdvancePhaseButton caId={ca.id} />
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <h2 style={{ margin: "0 0 10px 0" }}>Timeline</h2>

        <div style={{ border: "1px solid #222", borderRadius: 10, padding: 16 }}>
          {passagens && passagens.length > 0 ? (
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {passagens.map((p: any) => (
                <li key={p.id} style={{ marginBottom: 10 }}>
                  <div>
                    <strong>
                      {p.fase_ordem} — {p.fase_nome}
                    </strong>{" "}
                    <span style={{ opacity: 0.8 }}>({p.status ?? "—"})</span>
                  </div>

                  <div style={{ opacity: 0.8, fontSize: 13 }}>
                    Início:{" "}
                    {p.iniciado_em
                      ? new Date(p.iniciado_em).toLocaleString()
                      : "—"}
                    {" · "}
                    Fim:{" "}
                    {p.finalizado_em
                      ? new Date(p.finalizado_em).toLocaleString()
                      : "—"}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ margin: 0, opacity: 0.8 }}>
              Ainda não há passagens registradas.
            </p>
          )}
        </div>
      </div>

      <div style={{ marginTop: 14 }}>
        <a href="/dashboard/cas" style={{ color: "#fff" }}>
          ← Voltar
        </a>
      </div>
    </div>
  );
}