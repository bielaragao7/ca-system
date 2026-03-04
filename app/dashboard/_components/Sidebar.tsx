"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/dashboard", label: "Início", icon: "🏠" },
  { href: "/dashboard/cas", label: "CAs", icon: "🧾" },
  { href: "/dashboard/cas/novo", label: "Novo CA", icon: "➕" },
  { href: "/dashboard/acompanhamento", label: "Acompanhamento", icon: "📍" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
   <aside
  style={{
    width: 260,
    padding: 18,
    borderRight: "1px solid var(--border-main)",
    background: "var(--background)",
  }}
>
      {/* Marca */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          padding: 12,
          borderRadius: 14,
          border: "1px solid #1f1f1f",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <img
          src="/logo-potencia.png"
          alt="Potência"
          width={44}
          height={44}
          style={{
            borderRadius: 12,
            background: "#fff",
            padding: 4,
            boxShadow: "0 8px 18px rgba(0,0,0,0.35)",
          }}
        />

        <div style={{ lineHeight: 1.1 }}>
          <div style={{ fontWeight: 900, letterSpacing: 0.2 }}>Potência</div>
          <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>CA System</div>
        </div>
      </div>

      {/* Navegação */}
      <nav style={{ display: "grid", gap: 8, marginTop: 16 }}>
        {items.map((it) => {
          const isActive =
            pathname === it.href || (it.href !== "/dashboard" && pathname.startsWith(it.href));

          return (
            <Link
              key={it.href}
              href={it.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 12px",
                borderRadius: 14,
                textDecoration: "none",
                color: "#fff",
                border: isActive
  ? "1px solid rgba(30,79,163,0.6)"
  : "1px solid var(--border-main)",

background: isActive
  ? "rgba(30,79,163,0.22)"
  : "rgba(255,255,255,0.02)",
                opacity: isActive ? 1 : 0.92,
                boxShadow: isActive ? "0 10px 26px rgba(0,0,0,0.35)" : "none",
                transition: "all 0.15s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(2px)";
                (e.currentTarget as HTMLAnchorElement).style.opacity = "1";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateX(0)";
                (e.currentTarget as HTMLAnchorElement).style.opacity = isActive ? "1" : "0.92";
              }}
            >
              <span style={{ width: 18, textAlign: "center" }}>{it.icon}</span>
              <span style={{ fontWeight: isActive ? 900 : 650 }}>{it.label}</span>
              {isActive && (
  <span
    style={{
      marginLeft: "auto",
      fontSize: 10,
      padding: "2px 8px",
      borderRadius: 999,
      border: "1px solid rgba(30,79,163,0.6)",
      background: "rgba(30,79,163,0.18)",
      color: "rgba(255,255,255,0.9)",
    }}
  >
    ATIVO
  </span>
)}
            </Link>
          );
        })}
      </nav>

      {/* Espaçador */}
      <div style={{ flex: 1 }} />

      {/* Rodapé */}
      <div
        style={{
          marginTop: 16,
          padding: 12,
          borderRadius: 14,
          border: "1px solid #1f1f1f",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <div style={{ fontSize: 12, opacity: 0.7 }}>Sistema interno • Potência</div>
        <div style={{ fontSize: 12, marginTop: 6 }}>
          Feito por <strong>Gabriel - TI</strong>
        </div>
      </div>
    </aside>
  );
}