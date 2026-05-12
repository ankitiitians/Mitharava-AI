import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import BrandLogo from "@/components/BrandLogo";
import ParticleField from "@/components/ParticleField";
import ThemeToggle from "@/components/ThemeToggle";
import { useAuth } from "@/lib/auth";

const STATES = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Chandigarh","Puducherry","Jammu and Kashmir","Ladakh","Andaman and Nicobar","Dadra and Nagar Haveli","Daman and Diu","Lakshadweep"];

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    full_name: "", email: "", phone: "", password: "", confirm: "",
    exam_focus: "upsc", state: "", college: "",
  });

  const setF = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error("Passwords don't match");
    if (form.password.length < 6) return toast.error("Password must be at least 6 characters");
    setLoading(true);
    try {
      await signup({
        full_name: form.full_name, email: form.email, phone: form.phone,
        password: form.password, exam_focus: form.exam_focus,
        state: form.state, college: form.college,
      });
      toast.success("🎉 Welcome to Mitharva AI!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Signup failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <aside className="relative hidden md:flex flex-col justify-between p-10 lg:p-16 gradient-hero overflow-hidden">
        <ParticleField count={30} />
        <Link to="/"><BrandLogo size={42} tagline /></Link>
        <div className="relative">
          <div className="font-deva text-gold text-2xl">अभ्यासेन सिद्धिः</div>
          <h2 className="font-display text-4xl font-bold text-foreground mt-3 max-w-md">
            Join <span className="gradient-gold-text">10,000+</span> aspirants who chose smart preparation.
          </h2>
          <div className="mt-8 card-surface p-5 max-w-md">
            <p className="text-sm text-foreground/80 italic">
              "Mitharva AI helped me clear my UPSC personality test. It is the closest thing to a real board interview."
            </p>
            <div className="mt-3 text-xs text-gold font-medium">— Priya Sharma, AIR 234</div>
          </div>
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
          <h1 className="font-display text-3xl font-bold text-foreground">Create your account</h1>
          <p className="text-foreground/60 text-sm mt-1">Start your interview preparation journey today.</p>

          <form onSubmit={submit} className="mt-6 space-y-3.5">
            <Field icon={User} placeholder="Full Name" value={form.full_name} onChange={setF("full_name")} required testid="signup-name" />
            <Field icon={Mail} type="email" placeholder="Email address" value={form.email} onChange={setF("email")} required testid="signup-email" />
            <div className="flex items-stretch gap-2">
              <div className="px-3 flex items-center rounded-xl border border-gold-subtle bg-[var(--surface-card)] text-sm font-mono">+91</div>
              <div className="flex-1"><Field icon={Phone} placeholder="Phone number" value={form.phone} onChange={setF("phone")} testid="signup-phone" /></div>
            </div>
            <div className="relative">
              <Field icon={Lock} type={show ? "text" : "password"} placeholder="Password" value={form.password} onChange={setF("password")} required testid="signup-password" />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-3 text-foreground/50 hover:text-gold">
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <Field icon={Lock} type={show ? "text" : "password"} placeholder="Confirm Password" value={form.confirm} onChange={setF("confirm")} required testid="signup-confirm" />

            <div className="grid grid-cols-2 gap-2">
              <select value={form.exam_focus} onChange={setF("exam_focus")} data-testid="signup-exam" className="w-full px-3 py-3 rounded-xl border border-gold-subtle bg-[var(--surface-card)] text-foreground text-sm">
                <option value="upsc">UPSC Civil Services</option>
                <option value="ssc">SSC CGL/CHSL/GD</option>
                <option value="banking">Banking IBPS/SBI/RBI</option>
                <option value="railway">Railway RRB</option>
                <option value="campus_it">Campus IT</option>
                <option value="campus_mba">Campus MBA</option>
                <option value="other">Other</option>
              </select>
              <select value={form.state} onChange={setF("state")} data-testid="signup-state" className="w-full px-3 py-3 rounded-xl border border-gold-subtle bg-[var(--surface-card)] text-foreground text-sm">
                <option value="">Select State</option>
                {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <Field icon={MapPin} placeholder="College / Institution (optional)" value={form.college} onChange={setF("college")} testid="signup-college" />

            <label className="flex items-start gap-2 text-xs text-foreground/70">
              <input type="checkbox" required className="mt-0.5 accent-[#B8962E]" />
              I agree to the <Link to="/" className="text-gold hover:underline">Terms</Link> & <Link to="/" className="text-gold hover:underline">Privacy Policy</Link>
            </label>

            <button
              type="submit"
              disabled={loading}
              data-testid="signup-submit-btn"
              className="w-full py-3.5 rounded-full gradient-gold-bg text-navy-deep font-semibold hover:scale-[1.01] transition-transform disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create My Account →"}
            </button>
          </form>

          <div className="text-center text-sm text-foreground/60 mt-5">
            Already have an account? <Link to="/auth/login" data-testid="signup-login-link" className="text-gold hover:underline">Login</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ icon: Icon, testid, ...props }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-3 top-3.5 text-foreground/50" />
      <input
        data-testid={testid}
        {...props}
        className="w-full pl-10 pr-3 py-3 rounded-xl border border-gold-subtle bg-[var(--surface-card)] text-foreground text-sm placeholder:text-foreground/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
      />
    </div>
  );
}
