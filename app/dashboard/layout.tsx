export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0b0b", color: "#fff" }}>
      <aside style={{ width: 240, padding: 20, borderRight: "1px solid #222" }}>
        <h2 style={{ marginTop: 0 }}>CA System</h2>
        <nav style={{ display: "grid", gap: 10, marginTop: 20 }}>
          <a href="/dashboard" style={{ color: "#fff" }}>Início</a>
          <a href="/dashboard/cas" style={{ color: "#fff" }}>CAs</a>
          <a href="/dashboard/cas/novo" style={{ color: "#fff" }}>Novo CA</a>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: 24 }}>{children}</main>
    </div>
  );
}