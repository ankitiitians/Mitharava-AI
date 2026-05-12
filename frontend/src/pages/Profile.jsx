import { useState, useEffect } from "react";
import { Award, FileText, Save } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

const TABS = [["personal", "Personal Info"], ["exam", "Exam Settings"], ["resume", "Resume"], ["achievements", "Achievements"]];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [tab, setTab] = useState("personal");
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => { if (user) setForm(user); }, [user]);

  const setF = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await api.patch("/profile", form);
      updateUser(data);
      toast.success("Profile updated");
    } catch { toast.error("Update failed"); }
    finally { setSaving(false); }
  };

  return (
    <div className="p-6 lg:p-10">
      <h1 className="font-display text-3xl font-semibold text-foreground">Your Profile</h1>

      <div className="mt-6 flex flex-wrap gap-2 border-b border-gold-subtle">
        {TABS.map(([k, label]) => (
          <button
            key={k}
            data-testid={`profile-tab-${k}`}
            onClick={() => setTab(k)}
            className={`px-5 py-3 text-sm font-medium relative ${tab === k ? "text-gold" : "text-foreground/60 hover:text-foreground"}`}
          >
            {label}
            {tab === k && <span className="absolute -bottom-px left-0 right-0 h-0.5 gradient-gold-bg" />}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "personal" && (
          <div className="card-surface p-6 space-y-4 max-w-2xl">
            <Field label="Full Name" value={form.full_name || ""} onChange={setF("full_name")} testid="prof-name" />
            <Field label="Email" value={form.email || ""} disabled testid="prof-email" />
            <Field label="Phone" value={form.phone || ""} onChange={setF("phone")} testid="prof-phone" />
            <Field label="State" value={form.state || ""} onChange={setF("state")} testid="prof-state" />
            <Field label="College / Institution" value={form.college || ""} onChange={setF("college")} testid="prof-college" />
            <Field label="LinkedIn" value={form.linkedin || ""} onChange={setF("linkedin")} testid="prof-linkedin" />
            <div>
              <div className="text-xs text-foreground/60 mb-1">Bio (200 chars)</div>
              <textarea data-testid="prof-bio" maxLength={200} value={form.bio || ""} onChange={setF("bio")} rows={3} className="w-full px-3 py-2 rounded-xl border border-gold-subtle bg-[var(--surface-card)] text-foreground text-sm focus:outline-none focus:border-gold" />
            </div>
            <Field label="Target Year" value={form.target_year || ""} onChange={setF("target_year")} testid="prof-year" />
            <button data-testid="prof-save" onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full gradient-gold-bg text-navy-deep font-semibold disabled:opacity-60">
              <Save size={14} /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        )}

        {tab === "exam" && (
          <div className="card-surface p-6 space-y-4 max-w-2xl">
            <div>
              <div className="text-xs text-foreground/60 mb-1">Primary Exam Goal</div>
              <select value={form.exam_focus || "upsc"} onChange={setF("exam_focus")} className="w-full px-3 py-2 rounded-xl border border-gold-subtle bg-[var(--surface-card)] text-foreground text-sm">
                <option value="upsc">UPSC Civil Services</option>
                <option value="ssc">SSC</option>
                <option value="banking">Banking</option>
                <option value="railway">Railway</option>
                <option value="campus_it">Campus IT</option>
                <option value="campus_mba">Campus MBA</option>
              </select>
            </div>
            <Field label="DAF — Optional Subject" value={form.daf_optional_subject || ""} onChange={setF("daf_optional_subject")} testid="prof-daf-opt" />
            <Field label="DAF — Home State" value={form.daf_home_state || ""} onChange={setF("daf_home_state")} testid="prof-daf-home" />
            <Field label="DAF — Hobbies" value={form.daf_hobbies || ""} onChange={setF("daf_hobbies")} testid="prof-daf-hobbies" />
            <Field label="DAF — Service Preference (IAS / IPS / IFS)" value={form.daf_service_preference || ""} onChange={setF("daf_service_preference")} testid="prof-daf-service" />
            <div>
              <div className="text-xs text-foreground/60 mb-1">Preferred Language</div>
              <select value={form.preferred_language || "english"} onChange={setF("preferred_language")} className="w-full px-3 py-2 rounded-xl border border-gold-subtle bg-[var(--surface-card)] text-foreground text-sm">
                <option value="english">English</option>
                <option value="hindi">Hindi</option>
                <option value="hinglish">Hinglish</option>
              </select>
            </div>
            <button data-testid="prof-save-exam" onClick={save} disabled={saving} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full gradient-gold-bg text-navy-deep font-semibold disabled:opacity-60">
              <Save size={14} /> Save Changes
            </button>
          </div>
        )}

        {tab === "resume" && (
          <div className="card-surface p-6 max-w-2xl">
            <div className="rounded-xl panel-surface p-5 flex items-center gap-4">
              <div className="h-12 w-12 rounded-full gradient-gold-bg flex items-center justify-center text-navy-deep">
                <FileText size={20} />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-foreground">{(form.full_name || "Rahul_Kumar").replace(" ", "_")}_CV.pdf</div>
                <div className="text-xs text-foreground/60">Uploaded Jan 15, 2026</div>
              </div>
              <button className="px-4 py-1.5 rounded-full text-xs border border-gold-subtle hover:border-gold">Preview</button>
              <button className="px-4 py-1.5 rounded-full text-xs gradient-gold-bg text-navy-deep">Re-upload</button>
            </div>

            <div className="mt-6">
              <div className="text-xs tracking-widest text-gold mb-3">🤖 AI RESUME ANALYSIS</div>
              <div className="text-sm text-foreground/70 mb-2">Key Skills detected:</div>
              <div className="flex flex-wrap gap-2">
                {["Public Administration", "Geography", "Cricket", "Leadership", "Hindi/English", "Data Analysis"].map((s) => (
                  <span key={s} className="px-3 py-1 rounded-full text-xs bg-[rgba(184,150,46,0.08)] text-gold border border-gold-subtle">{s}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "achievements" && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🏆", title: "First Interview", status: "earned", date: "Jan 15, 2026" },
              { icon: "🔥", title: "5-Day Streak", status: "earned", date: "Apr 30, 2026" },
              { icon: "⭐", title: "Score 8+ Club", status: "earned", date: "May 2, 2026" },
              { icon: "🎙️", title: "Voice Master", status: "earned", date: "10 voice sessions" },
              { icon: "📚", title: "Question Guru", status: "earned", date: "100 questions practiced" },
              { icon: "💎", title: "UPSC Specialist", status: "pending", progress: 65, date: "13/20 sessions" },
              { icon: "🌟", title: "Monthly Topper", status: "pending", progress: 30, date: "Reach top 10" },
              { icon: "🎯", title: "Perfect Score", status: "pending", progress: 0, date: "Score 10/10 in any session" },
            ].map((b) => (
              <div key={b.title} className={`card-surface p-5 ${b.status === "earned" ? "" : "opacity-70"}`}>
                <div className="text-4xl">{b.icon}</div>
                <div className={`mt-3 font-semibold ${b.status === "earned" ? "text-gold" : "text-foreground/70"}`}>{b.title}</div>
                <div className="text-xs text-foreground/60">{b.date}</div>
                {b.status === "earned" ? (
                  <div className="mt-3 inline-flex items-center gap-1 text-xs text-emerald-500"><Award size={12} /> Earned</div>
                ) : (
                  <div className="mt-3">
                    <div className="h-1.5 bg-foreground/10 rounded-full overflow-hidden">
                      <div className="h-full gradient-gold-bg" style={{ width: `${b.progress}%` }} />
                    </div>
                    <div className="text-xs text-foreground/60 mt-1">{b.progress}% complete</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, testid, ...props }) {
  return (
    <div>
      <div className="text-xs text-foreground/60 mb-1">{label}</div>
      <input data-testid={testid} {...props} className="w-full px-3 py-2 rounded-xl border border-gold-subtle bg-[var(--surface-card)] text-foreground text-sm focus:outline-none focus:border-gold disabled:opacity-60" />
    </div>
  );
}
