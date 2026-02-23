import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

  const { data, error } = await supabase
    .from("cas")
    .select("id, ca_number, item_name, brand, model, supplier")
    .eq("ca_number", caNumber)
    .single();

  if (error || !data) {
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

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ marginTop: 0 }}>Detalhe do CA</h1>

      <div style={{ border: "1px solid #222", borderRadius: 10, padding: 16 }}>
        <p>
          <strong>Nº CA:</strong> {data.ca_number}
        </p>
        <p>
          <strong>Item:</strong> {data.item_name}
        </p>
        <p>
          <strong>Marca:</strong> {data.brand ?? "-"}
        </p>
        <p>
          <strong>Modelo:</strong> {data.model ?? "-"}
        </p>
        <p>
          <strong>Fornecedor:</strong> {data.supplier ?? "-"}
        </p>
      </div>

      <div style={{ marginTop: 14 }}>
        <a href="/dashboard/cas" style={{ color: "#fff" }}>
          ← Voltar
        </a>
      </div>
    </div>
  );
}