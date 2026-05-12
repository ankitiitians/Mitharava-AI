import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const m = (price) => annual ? Math.round(price * 12 * 0.8) : price;
  const period = annual ? "/yr" : "/mo";

  const plans = [
    { name: "FREE", monthly: 0, features: ["2 interviews total", "Text mode only", "Basic question bank", "Community support"], cta: "Get Started", testid: "pricing-page-free" },
    { name: "BASIC", monthly: 199, popular: true, features: ["10 interviews/month", "Voice AI conversations", "Resume-based questions", "Performance PDF reports", "Hindi support"], cta: "Start Basic →", testid: "pricing-page-basic" },
    { name: "PRO", monthly: 499, features: ["UNLIMITED interviews", "Camera + body language AI", "Panel mode (3 AI interviewers)", "Priority support", "Advanced analytics"], cta: "Go Pro →", testid: "pricing-page-pro" },
  ];

  const faqs = [
    { q: "Can I cancel anytime?", a: "Yes. Cancel from your dashboard any time. You'll continue to have access until the end of your billing period." },
    { q: "Is there a free trial for Basic or Pro?", a: "Free plan gives you 2 full interviews. Use them to test the AI before upgrading." },
    { q: "Does Mitharva AI support Hindi and regional languages?", a: "Yes. Basic and Pro support Hindi voice conversations. Tamil, Bengali, Marathi, Telugu are available on Pro." },
    { q: "Do you offer student discounts?", a: "Yes — verified students get 30% off the annual Basic and Pro plans." },
    { q: "What payment methods are accepted?", a: "UPI, all major credit/debit cards, and net banking via Razorpay." },
    { q: "Is my data and resume safe?", a: "Absolutely. We use bank-grade encryption. Your resume and interview data are never shared." },
    { q: "Can my college buy bulk access for students?", a: "Yes — see our Enterprise section below for college partnership pricing." },
    { q: "How accurate is the AI feedback?", a: "Our AI uses Gemini 3 Flash for natural conversation and provides feedback validated against actual interview rubrics. Most users see a 1-2 point score improvement within 2 weeks." },
  ];

  return (
    <div className="py-20">
      <div className="w-full px-6 lg:px-12 xl:px-20">
        <div className="text-center">
          <h1 className="font-display text-5xl sm:text-6xl font-bold text-foreground">
            Pricing That <span className="gradient-gold-text">Respects Your Pocket</span>
          </h1>
          <p className="mt-4 text-foreground/70">Choose any plan. Cancel anytime. No hidden fees.</p>

          <div className="mt-8 inline-flex items-center gap-2 p-1 rounded-full border border-gold-subtle">
            <button
              onClick={() => setAnnual(false)}
              data-testid="pricing-toggle-monthly"
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${!annual ? "gradient-gold-bg text-navy-deep" : "text-foreground/70"}`}
            >Monthly</button>
            <button
              onClick={() => setAnnual(true)}
              data-testid="pricing-toggle-annual"
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${annual ? "gradient-gold-bg text-navy-deep" : "text-foreground/70"}`}
            >Annual <span className="text-xs text-gold">Save 20%</span></button>
          </div>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((p) => (
            <div key={p.name} className={`relative card-surface p-8 ${p.popular ? "border-gold glow-gold scale-[1.02]" : ""}`}>
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-gold-bg text-navy-deep text-xs font-bold tracking-wider">
                  ★ MOST POPULAR ★
                </div>
              )}
              <div className="text-xs tracking-[0.25em] text-foreground/60">{p.name}</div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="font-display text-5xl font-bold gradient-gold-text">₹{m(p.monthly).toLocaleString("en-IN")}</span>
                <span className="text-foreground/60">{period}</span>
              </div>
              <ul className="mt-6 space-y-2.5 text-sm text-foreground/85">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check size={16} className="text-gold mt-0.5 shrink-0" /> {f}</li>
                ))}
              </ul>
              <Link
                to="/auth/signup"
                data-testid={p.testid}
                className={`mt-8 inline-flex items-center justify-center w-full py-3 rounded-full font-semibold transition-transform hover:scale-[1.02] ${p.popular ? "gradient-gold-bg text-navy-deep" : "border border-gold-subtle text-foreground hover:border-gold hover:text-gold"}`}
              >{p.cta}</Link>
            </div>
          ))}
        </div>

        <div className="mt-24">
          <h2 className="font-display text-3xl font-semibold text-foreground text-center">Feature Comparison</h2>
          <div className="mt-8 overflow-x-auto rounded-2xl card-surface">
            <table className="w-full text-sm min-w-[600px]">
              <thead><tr className="border-b border-gold-subtle">
                <th className="text-left p-4 text-foreground/60 font-medium">Feature</th>
                <th className="p-4 text-foreground/80">Free</th>
                <th className="p-4 gradient-gold-bg text-navy-deep">Basic</th>
                <th className="p-4 text-foreground/80">Pro</th>
              </tr></thead>
              <tbody>
                {[
                  ["Interview sessions", "2 total", "10/mo", "Unlimited"],
                  ["Voice AI", X, Check, Check],
                  ["Camera + Body language", X, X, Check],
                  ["Panel mode (3 AI)", X, X, Check],
                  ["Hindi voice", X, Check, Check],
                  ["Regional languages (Tamil/Bengali/Marathi)", X, X, Check],
                  ["Performance PDF reports", X, Check, Check],
                  ["Resume parsing & personalization", X, Check, Check],
                  ["Priority support", X, X, Check],
                ].map((row, i) => (
                  <tr key={i} className="border-t border-gold-subtle">
                    <td className="p-4 text-foreground/85">{row[0]}</td>
                    {row.slice(1).map((c, j) => (
                      <td key={j} className={`p-4 text-center ${j === 1 ? "bg-[rgba(184,150,46,0.06)]" : ""}`}>
                        {c === Check ? <Check className="text-emerald-500 mx-auto" size={16} /> :
                         c === X ? <X className="text-red-400 mx-auto" size={16} /> :
                         <span className="text-foreground/80 text-xs">{c}</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-24 max-w-3xl mx-auto">
          <h2 className="font-display text-3xl font-semibold text-foreground text-center">Frequently Asked</h2>
          <Accordion type="single" collapsible className="mt-8">
            {faqs.map((f, i) => (
              <AccordionItem key={i} value={`f${i}`} className="border-gold-subtle">
                <AccordionTrigger className="text-left text-foreground hover:text-gold" data-testid={`faq-${i}`}>{f.q}</AccordionTrigger>
                <AccordionContent className="text-foreground/70">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        <div className="mt-24 rounded-3xl panel-surface p-10 text-center border border-gold-subtle">
          <h2 className="font-display text-3xl font-semibold text-foreground">
            <span className="gradient-gold-text">Enterprise</span> — College Partnerships
          </h2>
          <p className="mt-4 text-foreground/70 max-w-xl mx-auto">
            For colleges wanting to offer Mitharva AI to all students. Unlimited access for an entire campus.
          </p>
          <div className="mt-6 font-mono text-3xl font-bold gradient-gold-text">₹50,000/year</div>
          <div className="text-xs text-foreground/60">For unlimited student access</div>
          <button data-testid="enterprise-contact" className="mt-6 px-7 py-3 rounded-full gradient-gold-bg text-navy-deep font-semibold hover:scale-[1.03] transition-transform">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}
