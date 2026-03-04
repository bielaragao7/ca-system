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
    <div
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: 24,
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 16,
          border: "1px solid var(--border-main)",
          background: "var(--card-bg)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.45)",
          padding: 22,
        }}
      >
        {/* Marca */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <img
            src="/logo-potencia.png"
            alt="Potência"
            width={44}
            height={44}
            style={{
              borderRadius: 12,
              background: "#fff",
              padding: 4,
            }}
          />
          <div style={{ lineHeight: 1.1 }}>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Potência</div>
            <div style={{ opacity: 0.7, fontSize: 12 }}>CA System</div>
          </div>
        </div>

        <h1 style={{ margin: "0 0 6px 0", fontSize: 20 }}>Entrar</h1>
        <p style={{ margin: "0 0 16px 0", opacity: 0.75, fontSize: 13 }}>
          Acesse com seu e-mail e senha.
        </p>

        <label style={{ display: "block", fontSize: 12, opacity: 0.75, marginBottom: 6 }}>
          Email
        </label>
        <input
          placeholder="seuemail@empresa.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            display: "block",
            marginBottom: 12,
            padding: 12,
            width: "100%",
            color: "var(--text-main)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border-main)",
            borderRadius: 12,
            outline: "none",
          }}
        />

        <label style={{ display: "block", fontSize: 12, opacity: 0.75, marginBottom: 6 }}>
          Senha
        </label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            display: "block",
            marginBottom: 16,
            padding: 12,
            width: "100%",
            color: "var(--text-main)",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border-main)",
            borderRadius: 12,
            outline: "none",
          }}
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            border: "none",
            borderRadius: 12,
            padding: "12px 14px",
            fontWeight: 900,
            cursor: loading ? "not-allowed" : "pointer",
            background: "var(--potencia-orange)",
            color: "#fff",
            boxShadow: "0 10px 22px rgba(255,122,0,0.28)",
            opacity: loading ? 0.85 : 1,
            transition: "transform 0.12s ease, opacity 0.12s ease",
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.99)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <div style={{ marginTop: 14, fontSize: 12, opacity: 0.6 }}>
          Feito por <strong>Gabriel - TI</strong>
        </div>
      </div>
    </div>
  );
}
