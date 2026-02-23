"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type CA = {
  id: string;
  ca_number: string;
  item_name: string;
  brand: string | null;
  model: string | null;
  supplier: string | null;
};

export default function CasListPage() {
  const [cas, setCas] = useState<CA[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);

    const { data, error } = await supabase
      .from("cas")
      .select("id, ca_number, item_name, brand, model, supplier, expires_at")
      .order("ca_number", { ascending: true });

    if (error) {
      console.error(error);
      alert(error.message);
      setCas([]);
    } else {
      setCas((data ?? []) as CA[]);
    }

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ marginTop: 0 }}>CAs</h1>

        <a href="/dashboard/cas/novo" style={{ color: "#fff", textDecoration: "none" }}>
          + Novo CA
        </a>
      </div>

      {loading && <p>Carregando...</p>}
      {!loading && cas.length === 0 && <p>Nenhum CA cadastrado.</p>}

      {cas.length > 0 && (
        <div style={{ border: "1px solid #222", borderRadius: 10, overflow: "hidden" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr 140px 140px 1fr",
              padding: 12,
              borderBottom: "1px solid #222",
              fontWeight: 700,
            }}
          >
            <div>Nº CA</div>
            <div>Item</div>
            <div>Marca</div>
            <div>Modelo</div>
            <div>Fornecedor</div>
          </div>

          {cas.map((c) => (
            <a
              key={c.id}
              href={`/dashboard/cas/${encodeURIComponent(c.ca_number)}`}
              style={{
                display: "grid",
                gridTemplateColumns: "140px 1fr 140px 140px 1fr",
                padding: 12,
                borderBottom: "1px solid #222",
                textDecoration: "none",
                color: "#fff",
              }}
            >
              <div>{c.ca_number}</div>
              <div>{c.item_name}</div>
              <div>{c.brand ?? "-"}</div>
              <div>{c.model ?? "-"}</div>
              <div>{c.supplier ?? "-"}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}