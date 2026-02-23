"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export function DeleteCAButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmDelete = confirm("Tem certeza que deseja apagar este CA?");
    if (!confirmDelete) return;

    setLoading(true);

    const { error } = await supabase
      .from("cas")
      .delete()
      .eq("id", id);

    setLoading(false);

    if (error) {
      alert("Erro ao apagar: " + error.message);
      return;
    }

    window.location.reload();
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
    >
      {loading ? "Apagando..." : "Apagar"}
    </button>
  );
}