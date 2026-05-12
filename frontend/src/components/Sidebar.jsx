import { NavLink, useNavigate } from "react-router-dom";
import { Home, Mic, FolderOpen, BookOpen, Newspaper, User, CreditCard, Settings, LogOut } from "lucide-react";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";
import RoleSwitcher from "./RoleSwitcher";
import { useAuth } from "../lib/auth";

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const itemCls = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all relative ${
      isActive
        ? "text-gold bg-[rgba(184,150,46,0.08)] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-6 before:w-[3px] before:rounded-r gradient-gold-bg-marker"
        : "text-foreground/70 hover:text-gold hover:bg-[rgba(184,150,46,0.05)]"
    }`;

  const readiness = Math.min(95, 40 + (user?.total_interviews || 0) * 2);

  const initials = (user?.full_name || "U").split(" ").map(s => s[0]).join("").slice(0, 2).toUpperCase();

  return (
    <aside className="w-[260px] shrink-0 hidden lg:flex flex-col border-r border-gold-subtle bg-[var(--surface-card)] py-6 sticky top-0 h-screen" data-testid="dashboard-sidebar">
      <div className="px-6 pb-4">
        <BrandLogo size={32} />
      </div>
      <div className="px-6 pb-4 border-b border-gold-subtle">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-full gradient-gold-bg flex items-center justify-center text-navy-deep font-bold">{initials}</div>
          <div className="min-w-0">
            <div className="font-semibold text-sm text-foreground truncate">{user?.full_name || "Guest"}</div>
            <div className="text-xs text-foreground/60 capitalize">{user?.exam_focus?.replace("_", " ") || "—"}</div>
          </div>
        </div>
        <div className="mt-3 inline-flex items-center gap-1.5 text-[10px] px-2 py-1 rounded-full border border-gold-subtle text-gold">
          ◆ {user?.plan?.toUpperCase() || "FREE"} PLAN
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <NavLink to="/dashboard" end className={itemCls} data-testid="side-dashboard"><Home size={16}/> Dashboard</NavLink>
        <NavLink to="/interview/setup" className={itemCls} data-testid="side-new-interview"><Mic size={16}/> New Interview</NavLink>
        <NavLink to="/practice" className={itemCls} data-testid="side-practice"><BookOpen size={16}/> Question Bank</NavLink>
        <NavLink to="/current-affairs" className={itemCls} data-testid="side-current-affairs"><Newspaper size={16}/> Current Affairs</NavLink>
        <div className="h-px bg-gold-subtle my-3" />
        <NavLink to="/profile" className={itemCls} data-testid="side-profile"><User size={16}/> Profile</NavLink>
        <NavLink to="/subscription" className={itemCls} data-testid="side-subscription"><CreditCard size={16}/> Subscription</NavLink>
      </nav>

      <div className="px-5 py-4 border-t border-gold-subtle">
        <div className="text-[10px] tracking-[0.2em] text-gold mb-2">INTERVIEW READINESS</div>
        <div className="flex items-center gap-3">
          <ReadinessRing value={readiness} />
          <div className="text-xs text-foreground/70">
            {readiness >= 70 ? "Interview Ready" : "Keep practicing"}
          </div>
        </div>
      </div>

      <div className="px-5 py-3 border-t border-gold-subtle">
        <RoleSwitcher className="w-full" />
      </div>

      <div className="px-3 pt-2 pb-4 flex items-center gap-2">
        <ThemeToggle className="h-9 w-9" />
        <button
          onClick={() => { logout(); navigate("/"); }}
          data-testid="side-logout"
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-foreground/70 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16}/> Logout
        </button>
      </div>
    </aside>
  );
}

function ReadinessRing({ value }) {
  const r = 22, c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative h-14 w-14">
      <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(184,150,46,0.2)" strokeWidth="4" />
        <circle cx="28" cy="28" r={r} fill="none" stroke="url(#ring-grad)" strokeWidth="4" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
        <defs>
          <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0C755" />
            <stop offset="100%" stopColor="#B8962E" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xs font-bold font-mono text-gold">{value}%</div>
    </div>
  );
}
