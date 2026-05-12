import { useEffect, useState } from "react";
import { Bookmark, Mic, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function Practice() {
  const [questions, setQuestions] = useState([]);
  const [filters, setFilters] = useState({ category: "all", difficulty: "all", type: "all" });
  const [active, setActive] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.category !== "all") params.append("category", filters.category);
    if (filters.difficulty !== "all") params.append("difficulty", filters.difficulty);
    if (filters.type !== "all") params.append("type", filters.type);
    api.get(`/questions?${params}`).then((r) => setQuestions(r.data)).catch(() => {});
  }, [filters]);

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-3xl font-semibold text-foreground">Question Bank — <span className="gradient-gold-text">5,000+ Curated</span></h1>
      <p className="text-foreground/60 mt-1">Practice individual questions with AI feedback.</p>

      <div className="mt-8 grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="card-surface p-5 space-y-5 h-fit">
          <FilterGroup label="Category" options={[["all","All"],["upsc","UPSC"],["ssc","SSC"],["banking","Banking"],["railway","Railway"],["campus_it","Campus IT"],["campus_mba","Campus MBA"],["hr","HR"]]} value={filters.category} onChange={(v) => setFilters({...filters, category: v})} testidPrefix="filter-cat" />
          <FilterGroup label="Difficulty" options={[["all","All"],["easy","Easy"],["medium","Medium"],["hard","Hard"]]} value={filters.difficulty} onChange={(v) => setFilters({...filters, difficulty: v})} testidPrefix="filter-diff" />
          <FilterGroup label="Type" options={[["all","All"],["long_answer","Long Answer"],["situational","Situational"],["current_affairs","Current Affairs"],["hr","HR"],["technical","Technical"]]} value={filters.type} onChange={(v) => setFilters({...filters, type: v})} testidPrefix="filter-type" />
        </aside>

        <div className="space-y-4">
          {questions.length === 0 && <div className="card-surface p-8 text-center text-foreground/60">No questions match these filters.</div>}
          {questions.map((q) => (
            <div key={q.id} className="card-surface p-5 hover:-translate-y-0.5 hover:glow-gold-sm transition-all">
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-2 py-1 rounded-full bg-[rgba(184,150,46,0.1)] text-gold font-medium uppercase">{q.category.replace("_"," ")}</span>
                  <span className="px-2 py-1 rounded-full border border-gold-subtle text-foreground/70 capitalize">{q.type?.replace("_"," ")}</span>
                  <span className={`px-2 py-1 rounded-full text-xs capitalize ${q.difficulty === "hard" ? "bg-red-500/10 text-red-400" : q.difficulty === "medium" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"}`}>{q.difficulty}</span>
                </div>
                <button data-testid={`bookmark-${q.id}`} className="text-foreground/50 hover:text-gold">
                  <Bookmark size={16} />
                </button>
              </div>
              <p className="text-foreground mt-3 text-sm leading-relaxed">"{q.question_text}"</p>
              <div className="mt-4 flex justify-end">
                <button data-testid={`practice-${q.id}`} onClick={() => setActive(q)} className="inline-flex items-center gap-2 px-4 py-2 rounded-full gradient-gold-bg text-navy-deep text-sm font-semibold hover:scale-[1.02]">
                  <Mic size={14} /> Practice This Answer →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {active && <PracticeModal q={active} onClose={() => setActive(null)} />}
    </div>
  );
}

function FilterGroup({ label, options, value, onChange, testidPrefix }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-widest text-foreground/60 mb-2">{label}</div>
      <div className="flex flex-wrap gap-1.5">
        {options.map(([v, l]) => (
          <button
            key={v}
            data-testid={`${testidPrefix}-${v}`}
            onClick={() => onChange(v)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${value === v ? "gradient-gold-bg text-navy-deep" : "border border-gold-subtle text-foreground/70 hover:border-gold"}`}
          >{l}</button>
        ))}
      </div>
    </div>
  );
}

function PracticeModal({ q, onClose }) {
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return toast.error("Voice not supported. Use text.");
    const r = new SR(); r.lang = "en-IN"; r.interimResults = true;
    setListening(true);
    let finalText = "";
    r.onresult = (ev) => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const t = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) finalText += t; else interim += t;
      }
      setAnswer(finalText + interim);
    };
    r.onend = () => setListening(false);
    r.start();
  };

  const submit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post("/practice/feedback", { question: q.question_text, answer, exam_type: q.category });
      setFeedback(data);
    } catch {
      toast.error("Feedback failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className="card-surface max-w-2xl w-full my-8 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-gold tracking-widest">PRACTICE QUESTION</div>
            <p className="text-foreground mt-2">"{q.question_text}"</p>
          </div>
          <button data-testid="practice-close" onClick={onClose} className="h-9 w-9 rounded-full border border-gold-subtle flex items-center justify-center"><X size={16} /></button>
        </div>

        <div className="mt-5">
          <textarea
            data-testid="practice-answer"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={6}
            className="w-full px-4 py-3 rounded-xl border border-gold-subtle bg-[var(--surface-card)] text-foreground text-sm focus:outline-none focus:border-gold resize-none"
            placeholder="Type or speak your answer..."
          />
          <div className="flex items-center justify-between mt-3">
            <button data-testid="practice-voice" onClick={startVoice} disabled={listening} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm ${listening ? "bg-red-500 text-white" : "border border-gold-subtle text-foreground/80 hover:border-gold"}`}>
              <Mic size={14} /> {listening ? "Listening..." : "Voice answer"}
            </button>
            <button data-testid="practice-submit" disabled={!answer.trim() || loading} onClick={submit} className="inline-flex items-center gap-2 px-5 py-2 rounded-full gradient-gold-bg text-navy-deep font-semibold disabled:opacity-50">
              {loading && <Loader2 size={14} className="animate-spin" />} Submit for AI Feedback →
            </button>
          </div>
        </div>

        {feedback && (
          <div className="mt-6 rounded-xl panel-surface p-5">
            <div className="flex items-baseline gap-2">
              <span className="font-mono text-3xl font-bold gradient-gold-text">{(feedback.score || 7.5).toFixed(1)}</span>
              <span className="text-xs text-foreground/60">/10</span>
            </div>
            <div className="mt-4">
              <div className="text-xs text-emerald-500 font-medium uppercase tracking-widest">Strengths</div>
              <ul className="text-sm text-foreground/85 mt-1 space-y-1">
                {(feedback.strengths || []).map((s, i) => <li key={i}>✅ {s}</li>)}
              </ul>
            </div>
            <div className="mt-4">
              <div className="text-xs text-amber-500 font-medium uppercase tracking-widest">Improvements</div>
              <ul className="text-sm text-foreground/85 mt-1 space-y-1">
                {(feedback.improvements || []).map((s, i) => <li key={i}>📈 {s}</li>)}
              </ul>
            </div>
            {feedback.modelAnswerApproach && (
              <div className="mt-4 p-3 rounded-lg bg-[rgba(184,150,46,0.06)] border border-gold-subtle">
                <div className="text-xs text-gold mb-1">💡 Model Answer Approach</div>
                <p className="text-sm text-foreground/80">{feedback.modelAnswerApproach}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
