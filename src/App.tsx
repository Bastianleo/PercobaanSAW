import React, { useState } from "react";
import { SPKProvider } from "./context/SPKContext";
import { Sidebar } from "./components/layout/Sidebar";
import { DashboardPage } from "./components/pages/DashboardPage";
import { CriteriaPage } from "./components/pages/CriteriaPage";
import { AlternativesPage } from "./components/pages/AlternativesPage";
import { SAWPage } from "./components/pages/SAWPage";
import { AHPPage } from "./components/pages/AHPPage";
import { ResultsPage } from "./components/pages/ResultsPage";
import { ExportPage } from "./components/pages/ExportPage";
import { Icon } from "./components/ui/Icon";
import type { NavItem } from "./types";

const pageComponents: Record<
  string,
  React.ComponentType<{ setPage: (page: string) => void }>
> = {
  dashboard: DashboardPage,
  criteria: CriteriaPage,
  alternatives: AlternativesPage,
  saw: SAWPage,
  ahp: AHPPage,
  results: ResultsPage,
  export: ExportPage,
};

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "criteria", label: "Kriteria", icon: "list" },
  { id: "alternatives", label: "Alternatif", icon: "users" },
  { id: "saw", label: "Metode SAW", icon: "calculator" },
  { id: "ahp", label: "Metode AHP", icon: "layers" },
  { id: "results", label: "Hasil Akhir", icon: "award" },
  { id: "export", label: "Export Data", icon: "download" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const PageComponent = pageComponents[page];

  return (
    <SPKProvider>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #f8fafc; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 99px; }
      `}</style>
      <div className="min-h-screen bg-slate-50/80 flex">
        <Sidebar
          page={page}
          setPage={setPage}
          open={sidebarOpen}
          setOpen={setSidebarOpen}
        />
        <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-100 px-5 py-4 flex items-center gap-3">
            <button
              className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600"
              onClick={() => setSidebarOpen(true)}
            >
              <Icon name="menu" size={18} />
            </button>
            <div>
              <p className="text-sm font-semibold text-slate-800">
                {navItems.find((n) => n.id === page)?.label}
              </p>
              <p className="text-[10px] text-slate-400">
                SPK · SAW & AHP
              </p>
            </div>
          </header>
          <main className="flex-1 p-5 lg:p-8 max-w-6xl w-full mx-auto">
            <PageComponent setPage={setPage} />
          </main>
        </div>
      </div>
    </SPKProvider>
  );
}