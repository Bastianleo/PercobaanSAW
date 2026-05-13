
import type { NavItem } from "../../types";
import { Icon } from "../ui/Icon";

const navItems: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "home" },
  { id: "criteria", label: "Kriteria", icon: "list" },
  { id: "alternatives", label: "Alternatif", icon: "users" },
  { id: "saw", label: "Metode SAW", icon: "calculator" },
  { id: "ahp", label: "Metode AHP", icon: "layers" },
  { id: "results", label: "Hasil Akhir", icon: "award" },
  { id: "export", label: "Export Data", icon: "download" },
];

interface SidebarProps {
  page: string;
  setPage: (page: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ page, setPage, open, setOpen }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-slate-100 z-30 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-100">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="22" x2="12" y2="15.5" />
              <polyline points="22 8.5 12 15.5 2 8.5" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800 leading-tight">
              SPK System
            </div>
            <div className="text-[10px] text-slate-400 font-medium tracking-wide">
              Decision Support
            </div>
          </div>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 mb-2">
            <p className="px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-1">
              Menu
            </p>
          </div>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setPage(item.id);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium transition-all duration-150 ${
                page === item.id
                  ? "text-blue-600 bg-blue-50 border-r-2 border-blue-600"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              <Icon name={item.icon as any} size={16} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="rounded-xl bg-blue-50 p-3">
            <p className="text-xs font-semibold text-blue-800 mb-0.5">
              SAW & AHP
            </p>
            <p className="text-[10px] text-blue-600 leading-relaxed">
              Multi-Criteria Decision Making System
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}