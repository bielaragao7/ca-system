"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NovoCaPage() {
  const router = useRouter();

  const [caNumber, setCaNumber] = useState("");
  const [itemName, setItemName] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [supplier, setSupplier] = useState("");
  const [expiresAt, setExpiresAt] = useState(""); // YYYY-MM-DD
  const [loading, setLoading] = useState(false);

  async function salvar() {
    const ca_number = caNumber.trim();
    const item_name = itemName.trim();
    const expires_at = expiresAt.trim();

    if (!ca_number || !item_name || !expires_at) {
      alert("Preencha Nº do CA, Item e Vencimento.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("cas").insert({
      ca_number,
      item_name,
      brand: brand.trim() || null,
      model: model.trim() || null,
      supplier: supplier.trim() || null,
      expires_at, // IMPORTANTÍSSIMO
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/dashboard/cas");
    router.refresh();
  }

  const inputStyle: React.CSSProperties = {
    display: "block",
    width: "100%",
    padding: 10,
    margin: "6px 0 12px",
    color: "#000",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: 6,
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <h1 style={{ marginTop: 0 }}>Novo CA</h1>

      <label>Nº do CA *</label>
      <input value={caNumber} onChange={(e) => setCaNumber(e.target.value)} style={inputStyle} />

      <label>Item *</label>
      <input value={itemName} onChange={(e) => setItemName(e.target.value)} style={inputStyle} />

      <label>Marca</label>
      <input value={brand} onChange={(e) => setBrand(e.target.value)} style={inputStyle} />

      <label>Modelo</label>
      <input value={model} onChange={(e) => setModel(e.target.value)} style={inputStyle} />

      <label>Fornecedor</label>
      <input value={supplier} onChange={(e) => setSupplier(e.target.value)} style={inputStyle} />

      <label>Vencimento *</label>
      <input
        type="date"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
        style={inputStyle}
      />

      <button onClick={salvar} disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </button>

      <button onClick={() => router.back()} style={{ marginLeft: 10 }} disabled={loading}>
        Cancelar
      </button>
    </div>
  );
}