import { Link } from "react-router-dom";
import { Twitter, Linkedin, Instagram, Youtube } from "lucide-react";
import BrandLogo from "./BrandLogo";

export default function Footer() {
  return (
    <footer className="relative border-t border-gold-subtle bg-navy-deep text-white/80" data-testid="public-footer">
      <div className="absolute top-0 left-0 right-0 h-px gradient-gold-bg opacity-50" />
      <div className="w-full px-6 lg:px-12 xl:px-20 py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2">
          <BrandLogo size={44} tagline />
          <p className="font-deva text-gold/80 text-sm mt-4">अभ्यासेन सिद्धिः</p>
          <p className="text-sm text-white/60 mt-2 max-w-xs">
            India's #1 AI-powered interview preparation platform for government exams and campus placements.
          </p>
          <div className="flex gap-3 mt-6">
            {[Twitter, Linkedin, Instagram, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="h-10 w-10 rounded-full border border-gold-subtle flex items-center justify-center hover:border-gold hover:text-gold transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
        <FCol title="Product" links={[["Dashboard", "/dashboard"], ["Interview", "/interview/setup"], ["Question Bank", "/practice"], ["Pricing", "/pricing"]]} />
        <FCol title="Resources" links={[["Blog", "#"], ["Current Affairs", "/current-affairs"], ["Study Tips", "#"], ["API Docs", "#"]]} />
        <FCol title="Company" links={[["About", "/about"], ["Careers", "#"], ["Contact", "#"], ["Press", "#"]]} />
      </div>
      <div className="border-t border-gold-subtle">
        <div className="w-full px-6 lg:px-12 xl:px-20 py-5 flex flex-wrap items-center justify-between gap-3 text-xs text-white/50">
          <div>© 2026 Mitharva AI • Privacy Policy • Terms of Service • Refund Policy</div>
          <div>Made with <span className="text-gold">❤</span> in India 🇮🇳</div>
        </div>
      </div>
    </footer>
  );
}

function FCol({ title, links }) {
  return (
    <div>
      <div className="text-xs tracking-[0.2em] text-gold uppercase mb-4 font-medium">{title}</div>
      <ul className="space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <Link to={href} className="text-sm text-white/70 hover:text-gold transition-colors">{label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
