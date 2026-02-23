"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Dashboard - CA System</h1>
      <p>Bem-vindo ao sistema.</p>

      <button
        onClick={logout}
        style={{
          marginTop: 20,
          padding: 10,
          background: "#111",
          color: "#fff",
          borderRadius: 6,
        }}
      >
        Sair
      </button>
    </main>
  );
}