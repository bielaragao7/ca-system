import Sidebar from "./_components/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
  style={{
    display: "flex",
    minHeight: "100vh",
    background: "var(--background)",
    color: "var(--foreground)",
  }}
>
      <Sidebar />
      <main
        style={{
          flex: 1,
          padding: 24,
          background: "radial-gradient(1000px 600px at 30% 0%, rgba(34,197,94,0.06), transparent 60%)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>{children}</div>
      </main>
    </div>
  );
}