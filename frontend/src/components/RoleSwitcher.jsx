import { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

const EXAMS = [
  { k: "upsc", label: "UPSC Civil Services", icon: "🏛️" },
  { k: "ssc", label: "SSC", icon: "📋" },
  { k: "banking", label: "Banking", icon: "🏦" },
  { k: "railway", label: "Railway", icon: "🚂" },
  { k: "campus_it", label: "Campus IT", icon: "💻" },
  { k: "campus_mba", label: "Campus MBA", icon: "🎓" },
];

export default function RoleSwitcher({ className = "" }) {
  const { user, updateUser } = useAuth();
  const [open, setOpen] = useState(false);
  const current = EXAMS.find((e) => e.k === user?.exam_focus) || EXAMS[0];

  const switchTo = async (k) => {
    setOpen(false);
    if (k === user?.exam_focus) return;
    try {
      const { data } = await api.patch("/profile", { exam_focus: k });
      updateUser(data);
      const label = EXAMS.find((e) => e.k === k)?.label;
      toast.success(`Switched to ${label}. Content tailored.`);
    } catch {
      toast.error("Could not switch focus");
    }
  };

  if (!user) return null;

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setOpen(!open)}
        data-testid="role-switcher"
        className="inline-flex items-center gap-2 px-3 py-2 rounded-full border border-gold-subtle hover:border-gold text-sm text-foreground hover:text-gold transition-colors"
      >
        <span>{current.icon}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute right-0 bottom-full mb-2 z-40 w-full min-w-[220px] card-surface p-2 shadow-2xl">
            <div className="text-[10px] tracking-widest text-foreground/50 px-3 py-2">SWITCH EXAM FOCUS</div>
            {EXAMS.map((e) => (
              <button
                key={e.k}
                data-testid={`role-opt-${e.k}`}
                onClick={() => switchTo(e.k)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-left hover:bg-[rgba(198,154,60,0.08)] transition-colors ${
                  current.k === e.k ? "text-gold" : "text-foreground/80"
                }`}
              >
                <span className="text-lg">{e.icon}</span>
                <span className="flex-1">{e.label}</span>
                {current.k === e.k && <Check size={14} className="text-gold" />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
