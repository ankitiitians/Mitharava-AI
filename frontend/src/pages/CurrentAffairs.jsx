import { useEffect, useState } from "react";
import { Loader2, X, Sparkles, Star } from "lucide-react";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

const CATEGORIES = ["Relevant", "All", "Economy", "Polity", "International", "Environment", "Science & Tech", "Social", "Defence", "Sports"];

// Map exam focus → most relevant news categories
const EXAM_RELEVANCE = {
  upsc: ["Polity", "Economy", "International", "Environment", "Science & Tech", "Social"],
  banking: ["Economy", "Polity"],
  ssc: ["Polity", "Economy", "Social", "Sports"],
  railway: ["Polity", "Social", "Economy"],
  campus_it: ["Science & Tech", "Economy"],
  campus_mba: ["Economy", "International", "Polity"],
};

export default function CurrentAffairs() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(null);
  const [tab, setTab] = useState("Relevant");

  const relevantCats = EXAM_RELEVANCE[user?.exam_focus] || EXAM_RELEVANCE.upsc;

  useEffect(() => {
    api.get(`/current-affairs`).then((r) => {
      let data = r.data;
      if (tab === "Relevant") {
        data = data.filter((d) => relevantCats.includes(d.category));
      } else if (tab !== "All") {
        data = data.filter((d) => d.category === tab);
      }
      setItems(data);
    }).catch(() => {});
  }, [tab, user?.exam_focus]);

  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const top5 = items.slice(0, 5);

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-foreground">Daily Current Affairs <span className="text-foreground/40 text-lg">— Updated every morning</span></h1>
          <p className="text-foreground/60 mt-1">AI-powered questions generated from today's news — tailored for <span className="text-gold capitalize">{user?.exam_focus?.replace("_", " ") || "your exam"}</span>.</p>
        </div>
      </div>

      <section className="mt-6 rounded-2xl border-2 border-gold p-6 bg-[rgba(184,150,46,0.04)]">
        <div className="text-xs tracking-[0.2em] text-gold">📰 TODAY'S TOP 5 — {today.toUpperCase()}</div>
        <ol className="mt-3 space-y-2 text-sm">
          {top5.map((t, i) => (
            <li key={t.id} className="flex gap-3 text-foreground">
              <span className="font-mono text-gold w-6 shrink-0">{i + 1}.</span>
              <span>{t.title}</span>
            </li>
          ))}
        </ol>
        {top5[0] && (
          <button data-testid="news-generate-top" onClick={() => setActive(top5[0])} className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 rounded-full gradient-gold-bg text-navy-deep font-semibold hover:scale-[1.02]">
            <Sparkles size={14} /> Generate AI Interview Questions from Today's News →
          </button>
        )}
      </section>

      <div className="mt-8 flex flex-wrap gap-2 border-b border-gold-subtle pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            data-testid={`ca-tab-${c}`}
            onClick={() => setTab(c)}
            className={`px-4 py-2 text-sm rounded-full transition-colors ${tab === c ? "gradient-gold-bg text-navy-deep font-semibold" : "text-foreground/70 hover:text-gold"}`}
          >{c}</button>
        ))}
      </div>

      <div className="mt-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((n) => {
          const isRelevant = relevantCats.includes(n.category);
          return (
            <div key={n.id} className="card-surface p-5 hover:-translate-y-0.5 hover:glow-gold-sm transition-all relative">
              {isRelevant && (
                <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gold/10 border border-gold text-[10px] text-gold font-medium">
                  <Star size={10} className="fill-gold" /> Relevant
                </div>
              )}
              <div className="flex justify-between text-xs text-foreground/60">
                <span className="px-2 py-0.5 rounded-full bg-[rgba(198,154,60,0.1)] text-gold">{n.category}</span>
                <span>{n.published_date}</span>
              </div>
              <h3 className="font-semibold text-foreground mt-3 leading-snug pr-16">{n.title}</h3>
              <p className="text-xs text-foreground/70 mt-2 line-clamp-3">{n.summary}</p>
              <button data-testid={`ca-practice-${n.id}`} onClick={() => setActive(n)} className="mt-4 text-xs text-gold hover:underline">Practice This →</button>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 card-surface p-10 text-center text-foreground/60">
            No news in this category. Try "All" or "Relevant".
          </div>
        )}
      </div>

      {active && <NewsQuestionsModal news={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function NewsQuestionsModal({ news, onClose }) {
  const [qs, setQs] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.post("/current-affairs/questions", { news_title: news.title, news_summary: news.summary })
      .then((r) => setQs(r.data))
      .catch(() => setQs([]))
      .finally(() => setLoading(false));
  }, [news]);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="card-surface max-w-2xl w-full my-8 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-start gap-3">
          <div>
            <div className="text-xs text-gold tracking-widest">📰 {news.category.toUpperCase()}</div>
            <h2 className="font-display text-xl font-semibold text-foreground mt-1">{news.title}</h2>
            <p className="text-sm text-foreground/70 mt-2">{news.summary}</p>
          </div>
          <button data-testid="news-modal-close" onClick={onClose} className="h-9 w-9 rounded-full border border-gold-subtle flex items-center justify-center"><X size={16} /></button>
        </div>

        <div className="mt-5">
          <div className="text-xs text-gold mb-3 flex items-center gap-2"><Sparkles size={14} /> AI-GENERATED INTERVIEW QUESTIONS</div>
          {loading && <div className="flex items-center gap-2 text-sm text-foreground/60"><Loader2 size={14} className="animate-spin" /> Generating questions...</div>}
          {!loading && qs && (
            <div className="space-y-3">
              {qs.map((q, i) => (
                <div key={i} className="rounded-xl panel-surface p-4">
                  <div className="text-xs flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-full bg-[rgba(184,150,46,0.1)] text-gold uppercase">{q.difficulty}</span>
                  </div>
                  <p className="text-sm text-foreground mt-2 font-medium">Q{i+1}. {q.question}</p>
                  {q.hint && <p className="text-xs text-foreground/60 mt-2">💡 Hint: {q.hint}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
