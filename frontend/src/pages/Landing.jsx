import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sparkles, Mic, Camera, Languages, Users, Brain, BarChart3, FileText, Trophy, Award, Star, Check, X, MapPin } from "lucide-react";
import ParticleField from "@/components/ParticleField";

export default function Landing() {
  return (
    <div>
      <Hero />
      <ProblemSection />
      <HowItWorks />
      <FeatureShowcase />
      <ExamCategories />
      <Comparison />
      <PricingSummary />
      <Testimonials />
      <CtaBanner />
    </div>
  );
}

function Hero() {
  const [text, setText] = useState("");
  const fullQ = "You've mentioned public administration as your optional subject. How would you reform India's district administration to improve last-mile delivery?";
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      setText(fullQ.slice(0, i++));
      if (i > fullQ.length) clearInterval(id);
    }, 18);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[100vh] gradient-hero overflow-hidden circuit-bg">
      <ParticleField count={40} />
      <div className="absolute -top-20 -left-20 h-[500px] w-[500px] rounded-full bg-gold/10 blur-[120px]" />
      <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-[#243470]/40 blur-[120px]" />

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 pt-24 pb-20 grid lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-subtle bg-[rgba(184,150,46,0.08)] text-gold text-xs font-medium tracking-wide">
            <Sparkles size={14} /> India's #1 AI Interview Coach
            <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          </div>

          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] mt-6 text-foreground">
            Master Your<br/>
            <span className="gradient-gold-text">Interview.</span><br/>
            Land Your Dream.
          </h1>

          <p className="mt-6 text-foreground/70 max-w-xl text-base sm:text-lg">
            AI-powered mock interviews for UPSC, SSC, Banking & Campus Placements. Voice conversation. Real-time feedback. In Hindi & English. Starting ₹199/month.
          </p>

          <div className="mt-3 font-deva text-gold/80 text-sm">— अभ्यासेन सिद्धिः — Excellence through Practice</div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/auth/signup"
              data-testid="hero-start-free-btn"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full gradient-gold-bg text-navy-deep font-semibold text-base hover:scale-[1.03] glow-gold-sm transition-transform"
            >
              <Mic size={18} /> Start Free Interview
            </Link>
            <a
              href="#how"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full border border-foreground/30 text-foreground hover:border-gold hover:text-gold transition-colors"
            >
              ▶ Watch Demo
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-foreground/70">
            <span className="flex items-center gap-2"><Star size={14} className="text-gold fill-gold" /> 4.8/5 Rating</span>
            <span className="flex items-center gap-2"><Users size={14} className="text-gold" /> 10,000+ Students</span>
            <span className="flex items-center gap-2"><Trophy size={14} className="text-gold" /> UPSC Toppers Verified</span>
          </div>
        </div>

        <div className="lg:col-span-5 relative animate-float">
          <div className="relative card-surface p-6 glow-gold-sm border-gold-subtle">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs">
                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-foreground font-medium">LIVE</span>
                <span className="text-foreground/50">•</span>
                <span className="text-foreground/70">UPSC Interview Session</span>
              </div>
              <span className="font-mono text-xs text-gold">12:47</span>
            </div>
            <div className="h-px bg-gold-subtle mb-5" />

            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <div className="h-24 w-24 rounded-full gradient-gold-bg flex items-center justify-center text-2xl font-bold text-navy-deep animate-pulse-gold">
                  RK
                </div>
              </div>
              <div className="wave-bars mt-4">
                <span /><span /><span /><span />
              </div>
              <div className="mt-3 font-semibold text-foreground">Shri R.K. Sharma IAS (Retd.)</div>
              <div className="text-xs text-foreground/60">UPSC Board Chairman</div>

              <div className="mt-5 p-4 rounded-xl bg-[rgba(184,150,46,0.06)] border border-gold-subtle text-sm text-foreground/90 min-h-[120px] text-left">
                "{text}<span className="inline-block w-1 h-4 bg-gold ml-0.5 animate-pulse"></span>"
              </div>

              <div className="w-full mt-4">
                <div className="text-[10px] tracking-widest text-foreground/50 mb-2">YOUR RESPONSE</div>
                <div className="flex items-center gap-2">
                  <Mic size={14} className="text-gold" />
                  <div className="wave-bars"><span /><span /><span /><span /></div>
                  <span className="ml-auto text-xs font-mono text-gold">8.2/10</span>
                </div>
                <div className="mt-2 h-1.5 w-full bg-foreground/10 rounded-full overflow-hidden">
                  <div className="h-full w-[82%] gradient-gold-bg" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  const problems = [
    { icon: MapPin, title: "Geographic Inequality", body: "Quality interview coaching only exists in Delhi, Mumbai, Hyderabad. A student from Varanasi or Patna has no access to the same quality." },
    { icon: Award, title: "Unaffordable Coaching", body: "₹25,000–75,000 per coaching course. Interview-specific prep costs ₹10,000–30,000 more. Impossible for most Indian families." },
    { icon: X, title: "Interview Phase Neglect", body: "Only 60–70% of written exam qualifiers clear the interview. Coaching focuses on written exams, not personality tests." },
    { icon: BarChart3, title: "Zero Personalized Feedback", body: "Batch mock interviews give vague, inconsistent feedback. No data on your specific weaknesses. No improvement path." },
  ];
  return (
    <section className="relative py-24 bg-[var(--surface-card)] border-y border-gold-subtle">
      <div className="absolute top-0 inset-x-0 h-px gradient-gold-bg opacity-40" />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground">
            The Interview Preparation <span className="gradient-gold-text">Crisis</span> in India
          </h2>
          <p className="mt-4 text-foreground/70">
            Over 2.5 crore candidates compete annually. Most fail not due to lack of knowledge — but lack of practice.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-5 mt-14">
          {problems.map((p, i) => (
            <div key={p.title} className={`card-surface p-7 border-l-4 border-gold hover:glow-gold-sm hover:-translate-y-1 transition-all animate-fade-up stagger-${i+1}`}>
              <p.icon className="text-gold mb-4" size={26} />
              <div className="font-semibold text-lg text-foreground">{p.title}</div>
              <p className="text-sm text-foreground/70 mt-2">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl gradient-gold-bg p-[1px]">
          <div className="rounded-2xl bg-[var(--surface-card)] px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[["₹4,000 Cr+", "Coaching Market"], ["130+ Lakh", "Annual Aspirants"], ["0", "Platforms Serving All Needs"]].map(([n, l]) => (
              <div key={l}>
                <div className="font-mono text-3xl font-bold gradient-gold-text">{n}</div>
                <div className="text-xs uppercase tracking-widest text-foreground/60 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    { icon: FileText, title: "Upload Resume & Select Exam", body: "Upload your CV. Choose UPSC, SSC, Banking, or Campus Placement." },
    { icon: Mic, title: "Practice Voice Interview with AI", body: "Speak naturally. Our AI interviews you in real-time voice conversation." },
    { icon: BarChart3, title: "Get AI-Powered Feedback & Score", body: "Receive detailed scores across 6 dimensions with actionable insights." },
  ];
  return (
    <section id="how" className="relative py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="text-center">
          <h2 className="font-display text-4xl sm:text-5xl font-semibold text-foreground">
            Three Steps to <span className="gradient-gold-text">Interview Mastery</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-10 mt-16 relative">
          <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px border-t-2 border-dashed border-gold/40" />
          {steps.map((s, i) => (
            <div key={s.title} className={`relative text-center animate-fade-up stagger-${i+1}`}>
              <div className="mx-auto h-24 w-24 rounded-full flex items-center justify-center border-2 border-gold gradient-gold-bg text-navy-deep glow-gold-sm">
                <s.icon size={32} />
              </div>
              <div className="mt-2 text-xs tracking-widest text-gold">STEP {i+1}</div>
              <div className="mt-3 font-display text-2xl font-semibold text-foreground">{s.title}</div>
              <p className="mt-3 text-sm text-foreground/70 max-w-xs mx-auto">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureShowcase() {
  const features = [
    { icon: Camera, title: "Camera + Voice AI Interview", body: "See yourself on camera like a real interview. AI evaluates your body language in real-time." },
    { icon: Mic, title: "ChatGPT Voice-Style Conversation", body: "Speak naturally. AI responds within 2 seconds. No typing. Fully voice-driven session." },
    { icon: Users, title: "Multi-Interviewer Panel Simulation", body: "3 AI interviewers simultaneously. Different personalities — Chairman, Domain Expert, Legal Expert." },
    { icon: BarChart3, title: "Real-Time Live Scoring", body: "Watch your score update as you answer. Confidence, clarity, structure — all tracked live." },
    { icon: Languages, title: "Hindi + Regional Language Support", body: "Full Hindi voice support powered by Sarvam AI. Tamil, Bengali, Marathi, Telugu available." },
    { icon: FileText, title: "Resume-Based Personalization", body: "AI reads your resume and asks questions specific to YOUR background, not generic ones." },
  ];
  return (
    <section className="relative py-24 gradient-hero overflow-hidden">
      <ParticleField count={20} />
      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-10 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <div className="text-xs tracking-[0.3em] text-gold font-medium">AI INTERVIEW STUDIO</div>
          <h2 className="font-display text-4xl sm:text-5xl font-semibold mt-3 text-foreground">
            A futuristic interface that <span className="gradient-gold-text">feels alive</span>.
          </h2>
          <div className="mt-10 space-y-5">
            {features.map((f, i) => (
              <div key={f.title} className={`flex gap-4 animate-fade-up stagger-${(i%4)+1}`}>
                <div className="shrink-0 h-10 w-10 rounded-full border border-gold-subtle bg-[rgba(184,150,46,0.08)] flex items-center justify-center text-gold">
                  <f.icon size={18} />
                </div>
                <div>
                  <div className="font-semibold text-foreground">{f.title}</div>
                  <div className="text-sm text-foreground/70">{f.body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="aspect-[5/6] rounded-3xl bg-navy-deep border border-gold-subtle p-6 glow-gold-sm">
            <div className="flex items-center justify-between text-xs text-white/60 mb-4">
              <span>◆ Mitharva AI</span>
              <span className="text-gold">REC •</span>
            </div>
            <div className="aspect-video rounded-xl bg-navy-mid border border-gold-subtle mb-4 relative overflow-hidden">
              <div className="absolute inset-0 circuit-bg opacity-30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Camera size={42} className="text-gold mx-auto" />
                  <div className="text-white/70 text-xs mt-2 font-mono">CAMERA FEED</div>
                </div>
              </div>
              <div className="absolute bottom-3 left-3 text-xs text-white bg-navy-deep/70 px-2 py-1 rounded">You — Rahul K.</div>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl bg-navy-mid p-3 border border-gold-subtle">
                <div className="text-[10px] text-gold mb-1">SHRI R.K. SHARMA</div>
                <div className="text-xs text-white/80">Tell us about your DAF and choice of optional...</div>
              </div>
              <div className="flex justify-end">
                <div className="orb-listening !w-20 !h-20" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ExamCategories() {
  const [tab, setTab] = useState("upsc");
  const tabs = {
    upsc: { title: "IAS / IPS / IFS Personality Test", icon: "🏛️", bullets: ["DAF-based personalized questions", "UPSC Panel simulation (3 board members)", "Current affairs from The Hindu / PIB", "Optional subject deep-dive", "Hometown & hobbies questions", "Administrative scenario roleplay", "Hindi + English support"] },
    ssc: { title: "SSC CGL / CHSL / GD Interviews", icon: "📋", bullets: ["Income Tax Inspector role-play", "Customs & Central Excise scenarios", "Audit & Accounts panel mode", "Current affairs (GS focus)", "Hindi medium fully supported"] },
    banking: { title: "Banking IBPS / SBI / RBI Grade B", icon: "🏦", bullets: ["RBI / SEBI policy discussions", "Banking awareness deep-dive", "Personal interview prep", "Group Discussion (GD) practice"] },
    railway: { title: "Railway RRB / NTPC", icon: "🚂", bullets: ["Technical + GS questions", "Operational scenarios", "Document verification prep"] },
    campus_it: { title: "TCS • Infosys • Wipro • Amazon • Google • Microsoft", icon: "💻", bullets: ["Company-specific question banks", "Technical + HR + Managerial rounds", "STAR method coaching", "Resume project deep-dive", "Coding concept discussions", "Offer negotiation practice"] },
    campus_mba: { title: "MBA Campus Placements", icon: "🎓", bullets: ["Finance / Consulting / Marketing tracks", "Case interview practice", "Personal HR rounds", "Leadership scenarios"] },
  };
  const list = [["upsc","UPSC"],["ssc","SSC"],["banking","Banking"],["railway","Railway"],["campus_it","Campus IT"],["campus_mba","Campus MBA"]];
  return (
    <section className="py-24 bg-[var(--surface-card)] border-y border-gold-subtle">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <h2 className="font-display text-4xl sm:text-5xl font-semibold text-center text-foreground">
          Built for <span className="gradient-gold-text">Every Indian Exam</span>
        </h2>

        <div className="mt-10 flex flex-wrap justify-center gap-2 border-b border-gold-subtle">
          {list.map(([k, label]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              data-testid={`cat-tab-${k}`}
              className={`px-5 py-3 text-sm font-medium relative transition-colors ${
                tab === k ? "text-gold" : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {label}
              {tab === k && <span className="absolute left-0 right-0 -bottom-px h-0.5 gradient-gold-bg" />}
            </button>
          ))}
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-5xl mb-4">{tabs[tab].icon}</div>
            <div className="font-display text-3xl font-semibold text-foreground">{tabs[tab].title}</div>
            <div className="mt-6 space-y-3">
              {tabs[tab].bullets.map((b) => (
                <div key={b} className="flex gap-2 text-foreground/80 text-sm">
                  <Check size={16} className="text-gold mt-0.5 shrink-0" /> {b}
                </div>
              ))}
            </div>
            <Link
              to="/auth/signup"
              data-testid={`cat-cta-${tab}`}
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full gradient-gold-bg text-navy-deep font-semibold hover:scale-[1.03] transition-transform"
            >
              Start {tabs[tab].title.split(" ")[0]} Interview →
            </Link>
          </div>
          <div className="rounded-3xl panel-surface p-8 min-h-[300px] flex items-center justify-center relative overflow-hidden border-gold-subtle">
            <div className="absolute inset-0 circuit-bg opacity-30" />
            <div className="relative text-center">
              <div className="text-7xl mb-4">{tabs[tab].icon}</div>
              <div className="font-deva text-gold text-2xl">अभ्यासेन सिद्धिः</div>
              <div className="text-xs uppercase tracking-widest text-foreground/50 mt-2">Excellence through Practice</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  const rows = [
    ["India-Specific Content", true, false, true, true],
    ["UPSC / SSC / Banking", true, false, "Partial", true],
    ["Campus Placement", true, "Partial", true, true],
    ["Voice AI in Hindi", true, false, false, "N/A"],
    ["Camera Analysis", true, false, false, false],
    ["24/7 Availability", true, true, false, false],
    ["AI Real-Time Feedback", true, true, false, "Human only"],
  ];
  const cell = (v) => v === true ? <Check className="text-emerald-500 mx-auto" size={18} /> :
                     v === false ? <X className="text-red-400 mx-auto" size={18} /> :
                     <span className="text-foreground/60 text-xs">{v}</span>;
  return (
    <section className="py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <h2 className="font-display text-4xl sm:text-5xl font-semibold text-center text-foreground">
          Why <span className="gradient-gold-text">Mitharva AI</span>?
        </h2>
        <div className="mt-12 overflow-x-auto rounded-2xl card-surface p-1 glow-gold-sm">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr>
                <th className="text-left p-4 text-foreground/60 font-medium">Feature</th>
                <th className="p-4 gradient-gold-bg text-navy-deep font-bold relative">
                  <div>Mitharva AI</div>
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] px-2 py-0.5 rounded-full bg-navy-deep text-gold">BEST VALUE</div>
                </th>
                <th className="p-4 text-foreground/70 font-medium">Final Round AI</th>
                <th className="p-4 text-foreground/70 font-medium">InterviewBuddy</th>
                <th className="p-4 text-foreground/70 font-medium">Traditional Coaching</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[0]} className="border-t border-gold-subtle">
                  <td className="p-4 text-foreground/85">{r[0]}</td>
                  <td className="p-4 text-center bg-[rgba(184,150,46,0.06)]">{cell(r[1])}</td>
                  <td className="p-4 text-center">{cell(r[2])}</td>
                  <td className="p-4 text-center">{cell(r[3])}</td>
                  <td className="p-4 text-center">{cell(r[4])}</td>
                </tr>
              ))}
              <tr className="border-t border-gold-subtle">
                <td className="p-4 font-semibold text-foreground">Price / Month</td>
                <td className="p-4 text-center bg-[rgba(184,150,46,0.06)] font-mono text-gold font-bold text-lg">₹199</td>
                <td className="p-4 text-center font-mono text-foreground/70">$49 (~₹4,100)</td>
                <td className="p-4 text-center font-mono text-foreground/70">₹500/session</td>
                <td className="p-4 text-center font-mono text-foreground/70">₹10,000+</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

function PricingSummary() {
  const plans = [
    { name: "FREE", price: "₹0", features: ["2 interviews", "Text mode", "Basic Q bank", "Community"], cta: "Get Started", testid: "pricing-free-cta" },
    { name: "BASIC", price: "₹199", popular: true, features: ["10 interviews/mo", "Voice AI", "Resume-based Qs", "Performance PDF", "Hindi support"], cta: "Start Basic →", testid: "pricing-basic-cta" },
    { name: "PRO", price: "₹499", features: ["UNLIMITED", "+ Camera AI", "Panel mode", "Body language", "Priority support"], cta: "Go Pro →", testid: "pricing-pro-cta" },
  ];
  return (
    <section className="py-24 bg-[var(--surface-card)] border-y border-gold-subtle">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <h2 className="font-display text-4xl sm:text-5xl font-semibold text-center text-foreground">
          Simple <span className="gradient-gold-text">Pricing</span>
        </h2>
        <p className="text-center text-foreground/60 mt-3">Start free. Upgrade when you're ready.</p>

        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((p, i) => (
            <div
              key={p.name}
              className={`relative card-surface p-8 animate-fade-up stagger-${i+1} ${
                p.popular ? "border-gold glow-gold scale-[1.02]" : ""
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-gold-bg text-navy-deep text-xs font-bold tracking-wider">
                  ★ MOST POPULAR ★
                </div>
              )}
              <div className="text-xs tracking-[0.25em] text-foreground/60">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold gradient-gold-text">{p.price}</span>
                <span className="text-foreground/60">/mo</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm text-foreground/85">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check size={16} className="text-gold mt-0.5 shrink-0" /> {f}</li>
                ))}
              </ul>
              <Link
                to="/auth/signup"
                data-testid={p.testid}
                className={`mt-8 inline-flex items-center justify-center w-full py-3 rounded-full font-semibold transition-transform hover:scale-[1.02] ${
                  p.popular ? "gradient-gold-bg text-navy-deep" : "border border-gold-subtle text-foreground hover:border-gold hover:text-gold"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-8 text-sm text-foreground/60">
          <Link to="/pricing" className="text-gold hover:underline" data-testid="pricing-view-all">View full comparison →</Link>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const items = [
    { initials: "PS", name: "Priya Sharma", meta: "UPSC 2024, AIR 234 — Allahabad, UP", q: "Mitharva AI helped me prepare for my UPSC Personality Test when I couldn't afford Delhi coaching. The AI asked DAF-based questions that even surprised my actual board. I owe my IAS selection partly to this." },
    { initials: "RV", name: "Rahul Verma", meta: "TCS Digital, ₹7 LPA — Bhopal, MP", q: "I practiced 50+ mock interviews before my TCS Digital interview. The AI knew exactly what TCS asks. Got my offer letter 2 weeks later!" },
    { initials: "AK", name: "Anjali Krishnamurthy", meta: "SBI PO Selected — Chennai, TN", q: "Being from Chennai I struggled with English interviews. Mitharva AI let me practice in Tamil and transition to English. Life-changing." },
    { initials: "DM", name: "Deepak Mishra", meta: "SSC CGL, Income Tax Inspector — Varanasi, UP", q: "Current affairs questions updated daily. My interviewer was impressed when I cited recent RBI policy changes. Mitharva AI is that good." },
  ];
  return (
    <section className="py-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <h2 className="font-display text-4xl sm:text-5xl font-semibold text-center text-foreground">
          Words from Our <span className="gradient-gold-text">Toppers</span>
        </h2>
        <div className="text-center font-deva text-gold mt-3">अभ्यासेन सिद्धिः</div>

        <div className="mt-12 flex gap-6 overflow-x-auto no-scrollbar snap-x pb-4">
          {items.map((t, i) => (
            <div key={t.name} className={`min-w-[340px] md:min-w-[400px] snap-start card-surface p-6 animate-fade-up stagger-${(i%4)+1}`}>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full gradient-gold-bg flex items-center justify-center text-navy-deep font-bold">{t.initials}</div>
                <div>
                  <div className="font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-foreground/60">{t.meta}</div>
                </div>
              </div>
              <div className="flex gap-0.5 mt-3">
                {[...Array(5)].map((_, j) => <Star key={j} size={14} className="text-gold fill-gold" />)}
              </div>
              <p className="text-sm text-foreground/80 mt-4 leading-relaxed">"{t.q}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="relative py-24 overflow-hidden gradient-hero">
      <ParticleField count={25} />
      <div className="relative max-w-3xl mx-auto px-6 text-center">
        <div className="font-deva text-gold text-lg">——— अभ्यासेन सिद्धिः ———</div>
        <h2 className="font-display text-4xl sm:text-5xl font-semibold mt-6 text-foreground">
          Ready to Transform Your <span className="gradient-gold-text">Interview Skills?</span>
        </h2>
        <p className="text-foreground/70 mt-4">
          Join 10,000+ aspirants already practicing with Mitharva AI
        </p>
        <Link
          to="/auth/signup"
          data-testid="bottom-cta-start"
          className="inline-flex items-center gap-2 mt-8 px-8 py-4 rounded-full gradient-gold-bg text-navy-deep font-bold hover:scale-[1.03] glow-gold transition-transform"
        >
          <Mic size={18} /> Start Free — No Credit Card Required
        </Link>
        <div className="mt-4 text-xs text-foreground/55">2 Free Interviews • No Registration Fee • Cancel Anytime</div>
      </div>
    </section>
  );
}
