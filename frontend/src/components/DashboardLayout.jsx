import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 min-w-0" data-testid="dashboard-main">
        {children}
      </main>
    </div>
  );
}
