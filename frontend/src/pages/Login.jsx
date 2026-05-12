import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import BrandLogo from "@/components/BrandLogo";
import ParticleField from "@/components/ParticleField";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back 👋");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Login failed");
    } finally { setLoading(false); }
  };

  const useDemo = () => { setEmail("demo@mitharva.ai"); setPassword("Demo@2026"); };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <aside className="relative hidden md:flex flex-col justify-between p-10 lg:p-16 gradient-hero overflow-hidden">
        <ParticleField count={30} />
        <Link to="/"><BrandLogo size={42} tagline /></Link>
        <div className="relative">
          <div className="font-deva text-gold text-2xl">अभ्यासेन सिद्धिः</div>
          <h2 className="font-display text-4xl font-bold text-foreground mt-3 max-w-md">
            Welcome back. <span className="gradient-gold-text">Practice today,</span> succeed tomorrow.
          </h2>
        </div>
        <div className="text-xs text-foreground/50">© 2026 Mitharva AI</div>
      </aside>

      <section className="flex flex-col px-6 py-8 lg:p-12 bg-[var(--surface-page)] relative">
        <div className="flex md:hidden items-center justify-between mb-6">
          <Link to="/"><BrandLogo size={32} /></Link>
          <ThemeToggle />
        </div>
        <div className="hidden md:flex justify-end mb-4"><ThemeToggle /></div>

        <div className="max-w-md w-full mx-auto my-auto">
          <h1 className="font-display text-3xl font-bold text-foreground">Login to your account</h1>
          <p className="text-foreground/60 text-sm mt-1">Continue your interview preparation.</p>

          <form onSubmit={submit} className="mt-6 space-y-3.5">
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3.5 text-foreground/50" />
              <input
                data-testid="login-email"
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full pl-10 pr-3 py-3 rounded-xl border border-gold-subtle bg-[var(--surface-card)] text-foreground text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3.5 text-foreground/50" />
              <input
                data-testid="login-password"
                type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-10 py-3 rounded-xl border border-gold-subtle bg-[var(--surface-card)] text-foreground text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
              />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-foreground/50 hover:text-gold">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="flex items-center justify-between text-xs">
              <button type="button" onClick={useDemo} data-testid="login-demo-fill" className="text-gold hover:underline">Use Demo Credentials</button>
              <Link to="/" className="text-foreground/60 hover:text-gold">Forgot password?</Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              data-testid="login-submit-btn"
              className="w-full py-3.5 rounded-full gradient-gold-bg text-navy-deep font-semibold hover:scale-[1.01] transition-transform disabled:opacity-60"
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          </form>

          <div className="text-center text-sm text-foreground/60 mt-5">
            New to Mitharva AI? <Link to="/auth/signup" data-testid="login-signup-link" className="text-gold hover:underline">Create an account</Link>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[rgba(184,150,46,0.06)] border border-gold-subtle text-xs text-foreground/70">
            <div className="font-medium text-gold">Demo account</div>
            <div className="mt-1 font-mono">demo@mitharva.ai / Demo@2026</div>
          </div>
        </div>
      </section>
    </div>
  );
}
