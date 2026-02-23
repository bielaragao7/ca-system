"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const e = email.trim();
    const p = password.trim();

    if (!e || !p) {
      alert("Preencha email e senha.");
      return;
    }

    setLoading(true);

    try {
      const resp = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: e, password: p }),
      });

      const data = await resp.json().catch(() => ({}));

      if (!resp.ok) {
        alert(data?.error ?? "Erro ao logar");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 40, color: "#fff" }}>
      <h1>Login</h1>

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{
          display: "block",
          marginBottom: 10,
          padding: 10,
          width: 320,
          color: "#000",
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{
          display: "block",
          marginBottom: 10,
          padding: 10,
          width: 320,
          color: "#000",
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      />

      <button onClick={handleLogin} disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </div>
  );
}