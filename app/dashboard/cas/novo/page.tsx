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
  const [expiresAt, setExpiresAt] = useState("");

  const [tipo, setTipo] = useState("");
  const [tecido, setTecido] = useState("");
  const [aprovacaoPara, setAprovacaoPara] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [composicao, setComposicao] = useState("");
  const [referencia, setReferencia] = useState("");
  const [dataAt, setDataAt] = useState("");
  const [normas, setNormas] = useState("");

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
      expires_at,

      tipo: tipo.trim() || null,
      tecido: tecido.trim() || null,
      aprovacao_para: aprovacaoPara.trim() || null,
      fabricante: fabricante.trim() || null,
      composicao: composicao.trim() || null,
      referencia: referencia.trim() || null,
      data_at: dataAt.trim() || null,
      normas: normas.trim() || null,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/dashboard/cas";
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

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontWeight: 700,
    marginTop: 4,
  };

  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ marginTop: 0 }}>Novo CA</h1>

      <label style={labelStyle}>Nº do CA *</label>
      <input
        value={caNumber}
        onChange={(e) => setCaNumber(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Item *</label>
      <input
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Tipo</label>
      <input
        value={tipo}
        onChange={(e) => setTipo(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Tecido</label>
      <input
        value={tecido}
        onChange={(e) => setTecido(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Aprovação para</label>
      <input
        value={aprovacaoPara}
        onChange={(e) => setAprovacaoPara(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Fabricante</label>
      <input
        value={fabricante}
        onChange={(e) => setFabricante(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Composição</label>
      <input
        value={composicao}
        onChange={(e) => setComposicao(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Referência</label>
      <input
        value={referencia}
        onChange={(e) => setReferencia(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Marca</label>
      <input
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Modelo</label>
      <input
        value={model}
        onChange={(e) => setModel(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Fornecedor</label>
      <input
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Data AT</label>
      <input
        type="date"
        value={dataAt}
        onChange={(e) => setDataAt(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Normas</label>
      <input
        value={normas}
        onChange={(e) => setNormas(e.target.value)}
        style={inputStyle}
      />

      <label style={labelStyle}>Vencimento *</label>
      <input
        type="date"
        value={expiresAt}
        onChange={(e) => setExpiresAt(e.target.value)}
        style={inputStyle}
      />

      <button onClick={salvar} disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </button>

      <button
        onClick={() => router.back()}
        style={{ marginLeft: 10 }}
        disabled={loading}
      >
        Cancelar
      </button>
    </div>
  );
}
