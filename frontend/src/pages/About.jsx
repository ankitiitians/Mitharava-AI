import ParticleField from "@/components/ParticleField";
import { Target, Eye, Gem } from "lucide-react";

export default function About() {
  const team = [
    { initials: "AM", name: "Arjun Mehta", role: "CEO & Co-Founder", credentials: "IIT Bombay '20 | Ex-Google | UPSC CSE Aspirant", quote: "Built Mitharva AI after failing my first UPSC interview due to lack of structured practice." },
    { initials: "SI", name: "Shreya Iyer", role: "CTO & Co-Founder", credentials: "IIT Madras '21 | ML Engineer | NLP Specialist", quote: "Passionate about making AI work for Bharat's regional languages." },
    { initials: "VN", name: "Vikram Nair", role: "Head of Product", credentials: "NIT Trichy '19 | Ex-Unacademy | EdTech Veteran", quote: "5 years building education products for Tier-2 India." },
    { initials: "KR", name: "Kavitha Reddy", role: "Head of AI Research", credentials: "IIIT Hyderabad '22 | Speech AI Specialist", quote: "Led voice AI research for Indian languages before joining Mitharva." },
  ];

  return (
    <div>
      <section className="relative py-24 gradient-hero overflow-hidden">
        <ParticleField count={30} />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="text-xs tracking-[0.3em] text-gold">OUR STORY</div>
          <h1 className="font-display text-5xl sm:text-6xl font-bold mt-4 text-foreground">
            Built for <span className="gradient-gold-text">Bharat's Brightest</span>
          </h1>
          <p className="text-foreground/70 mt-6">
            Mitharva AI was born from a simple belief: every student — from Varanasi, Patna, Prayagraj — deserves the same quality of interview preparation as those in Delhi's best coaching institutes.
          </p>
          <div className="mt-6 font-deva text-gold/90">अभ्यासेन सिद्धिः — Excellence through Practice</div>
        </div>
      </section>

      <section className="py-20 bg-[var(--surface-card)] border-y border-gold-subtle">
        <div className="w-full px-6 lg:px-12 xl:px-20 grid md:grid-cols-3 gap-8">
          {[
            { icon: Target, title: "Mission", body: "Democratize interview preparation for every Indian aspirant regardless of geography or income." },
            { icon: Eye, title: "Vision", body: "Become the default interview preparation tool for India's 130+ lakh annual job seekers by 2030." },
            { icon: Gem, title: "Values", body: "Technology First. Student First. India First." },
          ].map((m, i) => (
            <div key={m.title} className={`card-surface p-8 text-center hover:glow-gold-sm transition-all animate-fade-up stagger-${i+1}`}>
              <div className="mx-auto h-14 w-14 rounded-full gradient-gold-bg flex items-center justify-center text-navy-deep">
                <m.icon size={24} />
              </div>
              <div className="mt-5 font-display text-2xl font-semibold text-foreground">{m.title}</div>
              <p className="mt-3 text-foreground/70 text-sm">{m.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <h2 className="font-display text-4xl font-semibold text-center text-foreground">
            <span className="gradient-gold-text">Market Opportunity</span>
          </h2>
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {[["₹4,000+ Cr", "Coaching Market"], ["11.6%", "AI Recruitment CAGR"], ["18%", "of World's Job Seekers are Indian"]].map(([n, l]) => (
              <div key={l} className="rounded-2xl gradient-gold-bg p-[1px]">
                <div className="rounded-2xl bg-[var(--surface-card)] py-10 text-center">
                  <div className="font-mono text-4xl font-bold gradient-gold-text">{n}</div>
                  <div className="text-xs uppercase tracking-widest text-foreground/60 mt-2">{l}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[var(--surface-card)] border-y border-gold-subtle">
        <div className="w-full px-6 lg:px-12 xl:px-20">
          <h2 className="font-display text-4xl font-semibold text-center text-foreground">Meet the <span className="gradient-gold-text">Team</span></h2>
          <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((t, i) => (
              <div key={t.name} className={`card-surface p-6 text-center animate-fade-up stagger-${i+1}`}>
                <div className="mx-auto h-20 w-20 rounded-full gradient-gold-bg flex items-center justify-center text-navy-deep font-bold text-xl">{t.initials}</div>
                <div className="mt-4 font-semibold text-foreground">{t.name}</div>
                <div className="text-xs text-gold">{t.role}</div>
                <div className="text-xs text-foreground/60 mt-1">{t.credentials}</div>
                <p className="text-xs text-foreground/70 mt-3 italic">"{t.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
