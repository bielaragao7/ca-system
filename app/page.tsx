"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/login");
      }
    };

    checkUser();
  }, [router]);

  return (
    <div style={{ padding: 40 }}>
      <h1>Sistema de CAs</h1>
      <p>Logado com sucesso.</p>
    </div>
  );
}