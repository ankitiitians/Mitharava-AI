import { useEffect, useState } from "react";
import { Download, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function Subscription() {
  const { user, refresh } = useAuth();
  const [history, setHistory] = useState([]);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    api.get("/subscription/history").then((r) => setHistory(r.data)).catch(() => {});
  }, []);

  const upgrade = async (plan) => {
    setPaying(true);
    // Simulate Razorpay checkout
    setTimeout(async () => {
      try {
        await api.post("/subscription/mock-pay", { plan });
        await refresh();
        const { data } = await api.get("/subscription/history");
        setHistory(data);
        toast.success(`🎉 Welcome to ${plan.toUpperCase()} plan!`);
      } catch { toast.error("Payment failed"); }
      finally { setPaying(false); }
    }, 1500);
  };

  const currentPlan = user?.plan || "free";
  const usage = user?.interviews_used_this_month || 0;
  const limit = currentPlan === "free" ? 2 : currentPlan === "basic" ? 10 : 100;

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <h1 className="font-display text-3xl font-semibold text-foreground">Subscription & Billing</h1>

      <section className="rounded-2xl border-2 border-gold p-6 bg-[rgba(184,150,46,0.04)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-xs tracking-[0.2em] text-gold">CURRENT PLAN</div>
            <div className="font-display text-3xl font-semibold text-foreground capitalize mt-1">{currentPlan} <span className="text-foreground/60 text-base font-normal">• {currentPlan === "free" ? "₹0" : currentPlan === "basic" ? "₹199" : "₹499"}/month</span></div>
            <div className="text-sm text-foreground/70 mt-2">
              {currentPlan !== "free" ? `Next billing: ${nextBilling()}` : "Upgrade for full features"}
            </div>
            {currentPlan !== "free" && <div className="text-xs text-foreground/60 mt-1">Payment: UPI — {user?.email}</div>}
            <div className="mt-4">
              <div className="text-xs text-foreground/60">Interviews used this month: {usage} / {currentPlan === "pro" ? "Unlimited" : limit}</div>
              <div className="mt-1 h-1.5 w-64 bg-foreground/10 rounded-full overflow-hidden">
                <div className="h-full gradient-gold-bg" style={{ width: `${Math.min(100, (usage/limit)*100)}%` }} />
              </div>
            </div>
          </div>
          {currentPlan !== "pro" && (
            <button data-testid="sub-upgrade-top" onClick={() => upgrade("pro")} disabled={paying} className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-gold-bg text-navy-deep font-semibold disabled:opacity-60">
              <Sparkles size={14} /> {paying ? "Processing..." : "Upgrade to Pro →"}
            </button>
          )}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-semibold text-foreground mb-4">Available Plans</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { name: "free", price: 0, features: ["2 interviews", "Text mode", "Basic Q bank"] },
            { name: "basic", price: 199, popular: true, features: ["10 interviews/mo", "Voice AI", "Resume-based Qs", "Hindi support", "PDF reports"] },
            { name: "pro", price: 499, features: ["Unlimited", "Camera AI", "Panel mode (3 AI)", "Body language", "Priority support"] },
          ].map((p) => (
            <div key={p.name} className={`card-surface p-6 ${p.popular ? "border-gold glow-gold-sm" : ""}`}>
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-widest text-foreground/60">{p.name}</div>
                {currentPlan === p.name && <span className="text-xs px-2 py-0.5 rounded-full gradient-gold-bg text-navy-deep font-bold">CURRENT</span>}
              </div>
              <div className="font-mono text-3xl font-bold gradient-gold-text mt-3">₹{p.price}<span className="text-sm text-foreground/60 font-normal">/mo</span></div>
              <ul className="mt-4 space-y-1.5 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2 text-foreground/85"><Check size={14} className="text-gold mt-0.5 shrink-0" /> {f}</li>
                ))}
              </ul>
              {currentPlan !== p.name && p.name !== "free" && (
                <button data-testid={`sub-${p.name}-pay`} onClick={() => upgrade(p.name)} disabled={paying} className={`mt-5 w-full py-2.5 rounded-full font-semibold disabled:opacity-60 ${p.popular ? "gradient-gold-bg text-navy-deep" : "border border-gold-subtle hover:border-gold text-foreground"}`}>
                  {paying ? "Processing..." : `Switch to ${p.name}`}
                </button>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="card-surface p-6">
        <h2 className="font-display text-xl font-semibold text-foreground mb-4">Billing History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-foreground/60 border-b border-gold-subtle">
                <th className="text-left py-2 pr-3">Date</th>
                <th className="text-left py-2 pr-3">Plan</th>
                <th className="text-left py-2 pr-3">Amount</th>
                <th className="text-left py-2 pr-3">Status</th>
                <th className="text-right py-2">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {history.length === 0 && (
                <tr><td colSpan={5} className="py-6 text-center text-foreground/60">No transactions yet.</td></tr>
              )}
              {history.map((h) => (
                <tr key={h.id} className="border-b border-gold-subtle/40">
                  <td className="py-3 pr-3">{(h.created_at || "").slice(0, 10)}</td>
                  <td className="py-3 pr-3 capitalize">{h.plan}</td>
                  <td className="py-3 pr-3 font-mono text-gold">₹{h.amount}</td>
                  <td className="py-3 pr-3"><span className="text-emerald-500">✅ {h.status}</span></td>
                  <td className="py-3 text-right">
                    <button data-testid={`invoice-${h.id}`} className="inline-flex items-center gap-1 text-gold hover:underline text-xs"><Download size={12} /> Download</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function nextBilling() {
  const d = new Date(); d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}
