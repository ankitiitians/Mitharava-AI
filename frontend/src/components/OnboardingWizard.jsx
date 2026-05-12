import { useEffect, useState } from "react";
import { X, Check, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

const CHALLENGES = ["Nervousness", "Answer Structure", "Language Barrier", "Domain Knowledge", "Current Affairs", "Body Language"];

export default function OnboardingWizard() {
  const { user, updateUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    preparation_stage: "",
    previous_attempts: "",
    challenges: [],
    preferred_language: "english",
  });

  useEffect(() => {
    if (!user) return;
    const dismissed = localStorage.getItem(`mitharva_onboarding_${user.id}`);
    if (!user.onboarding_completed && !dismissed && (user.total_interviews || 0) === 0) {
      setOpen(true);
    }
  }, [user]);

  if (!open) return null;

  const next = () => setStep((s) => Math.min(3, s + 1));
  const back = () => setStep((s) => Math.max(1, s - 1));
  const skip = () => {
    localStorage.setItem(`mitharva_onboarding_${user.id}`, "1");
    setOpen(false);
  };

  const toggleChallenge = (c) => {
    setForm((f) => ({
      ...f,
      challenges: f.challenges.includes(c) ? f.challenges.filter((x) => x !== c) : [...f.challenges, c],
    }));
  };

  const finish = async () => {
    setSaving(true);
    try {
      const { data } = await api.post("/profile/onboarding", form);
      updateUser(data);
      localStorage.setItem(`mitharva_onboarding_${user.id}`, "1");
      toast.success("🎉 You're all set! Let's start your first interview.");
      setOpen(false);
    } catch {
      toast.error("Could not save. You can update later in your profile.");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-up">
      <div className="card-surface max-w-xl w-full p-7 relative" data-testid="onboarding-modal">
        <button onClick={skip} data-testid="onboarding-close" className="absolute right-4 top-4 h-9 w-9 rounded-full border border-gold-subtle flex items-center justify-center text-foreground/60 hover:text-gold">
          <X size={16} />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={16} className="text-gold" />
          <span className="text-xs tracking-[0.2em] text-gold">WELCOME TO MITHARVA AI</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-2 mt-4 mb-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="flex-1 flex items-center gap-2">
              <div data-testid={`onb-step-${n}`} className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${step >= n ? "gradient-gold-bg text-navy-deep" : "border border-gold-subtle text-foreground/50"}`}>{step > n ? <Check size={14} /> : n}</div>
              {n < 3 && <div className={`flex-1 h-px ${step > n ? "bg-gold" : "bg-foreground/20"}`} />}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div>
            <h3 className="font-display text-2xl font-semibold text-foreground">Tell us about your goal</h3>
            <p className="text-sm text-foreground/60 mt-1">We'll personalize your interview practice.</p>
            <div className="mt-5">
              <div className="text-xs text-foreground/60 mb-2">Preparation stage</div>
              <div className="flex flex-wrap gap-2">
                {["Just Starting", "6 Months In", "1 Year+", "Final Stage"].map((s) => (
                  <button key={s} data-testid={`onb-stage-${s.toLowerCase().replace(/[^a-z]/g, '-')}`} onClick={() => setForm({ ...form, preparation_stage: s })}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${form.preparation_stage === s ? "gradient-gold-bg text-navy-deep font-semibold" : "border border-gold-subtle text-foreground/70 hover:border-gold"}`}>{s}</button>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <div className="text-xs text-foreground/60 mb-2">Previous attempts</div>
              <div className="flex flex-wrap gap-2">
                {["First", "2nd", "3rd+"].map((s) => (
                  <button key={s} data-testid={`onb-attempts-${s.toLowerCase().replace(/[^a-z0-9]/g, '-')}`} onClick={() => setForm({ ...form, previous_attempts: s })}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${form.previous_attempts === s ? "gradient-gold-bg text-navy-deep font-semibold" : "border border-gold-subtle text-foreground/70 hover:border-gold"}`}>{s}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3 className="font-display text-2xl font-semibold text-foreground">Your interview experience</h3>
            <p className="text-sm text-foreground/60 mt-1">Help us target your weakest areas first.</p>
            <div className="mt-5">
              <div className="text-xs text-foreground/60 mb-2">Biggest challenges? (Select all that apply)</div>
              <div className="flex flex-wrap gap-2">
                {CHALLENGES.map((c) => (
                  <button key={c} data-testid={`onb-challenge-${c.toLowerCase().replace(/[^a-z]/g, '-')}`} onClick={() => toggleChallenge(c)}
                    className={`px-4 py-2 rounded-full text-sm transition-colors ${form.challenges.includes(c) ? "gradient-gold-bg text-navy-deep font-semibold" : "border border-gold-subtle text-foreground/70 hover:border-gold"}`}>
                    {form.challenges.includes(c) ? "✓ " : ""}{c}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <div className="text-xs text-foreground/60 mb-2">Preferred interview language</div>
              <div className="flex flex-wrap gap-2">
                {["english", "hindi", "hinglish", "regional"].map((l) => (
                  <button key={l} data-testid={`onb-lang-${l}`} onClick={() => setForm({ ...form, preferred_language: l })}
                    className={`px-4 py-2 rounded-full text-sm capitalize transition-colors ${form.preferred_language === l ? "gradient-gold-bg text-navy-deep font-semibold" : "border border-gold-subtle text-foreground/70 hover:border-gold"}`}>{l}</button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="text-center">
            <div className="mx-auto h-20 w-20 rounded-full gradient-gold-bg flex items-center justify-center mb-3 animate-pulse-gold">
              <Check size={36} className="text-navy-deep" />
            </div>
            <h3 className="font-display text-2xl font-semibold text-foreground">You're all set!</h3>
            <p className="text-sm text-foreground/70 mt-3">
              Based on your <b className="text-gold capitalize">{user?.exam_focus?.replace("_", " ")}</b> goal, we've prepared your first session.
            </p>
            <div className="mt-5 font-deva text-gold">अभ्यासेन सिद्धिः</div>
            <div className="text-xs text-foreground/60 mt-1">Excellence through Practice</div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between">
          {step > 1 ? (
            <button onClick={back} data-testid="onb-back" className="inline-flex items-center gap-1 px-4 py-2 rounded-full border border-gold-subtle text-foreground/80 text-sm hover:text-gold">
              <ArrowLeft size={14} /> Back
            </button>
          ) : <span />}
          {step < 3 ? (
            <button onClick={next} data-testid="onb-next" className="inline-flex items-center gap-1 px-5 py-2 rounded-full gradient-gold-bg text-navy-deep font-semibold text-sm hover:scale-[1.02]">
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button onClick={finish} disabled={saving} data-testid="onb-finish" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full gradient-gold-bg text-navy-deep font-semibold text-sm hover:scale-[1.02] disabled:opacity-60">
              {saving ? "Saving..." : "Start My First Interview →"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
