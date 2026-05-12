import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import BrandLogo from "./BrandLogo";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "../lib/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkCls = ({ isActive }) =>
    `text-sm font-medium px-3 py-2 rounded-full transition-colors ${
      isActive ? "text-gold" : "text-foreground/80 hover:text-gold"
    }`;

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 glass-nav transition-shadow ${
        scrolled ? "shadow-[0_4px_30px_rgba(184,150,46,0.12)]" : ""
      }`}
      data-testid="public-navbar"
    >
      <div className="w-full px-6 lg:px-12 xl:px-20 h-16 flex items-center justify-between">
        <Link to="/" data-testid="navbar-logo-link">
          <BrandLogo size={36} />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavLink to="/" end className={linkCls} data-testid="nav-home">Home</NavLink>
          <NavLink to="/about" className={linkCls} data-testid="nav-about">About</NavLink>
          <NavLink to="/pricing" className={linkCls} data-testid="nav-pricing">Pricing</NavLink>
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <button
              data-testid="nav-dashboard-btn"
              onClick={() => navigate("/dashboard")}
              className="px-5 py-2 rounded-full gradient-gold-bg text-navy-deep font-semibold hover:scale-[1.03] transition-transform"
            >
              Dashboard →
            </button>
          ) : (
            <>
              <Link to="/auth/login" data-testid="nav-login" className="text-sm font-medium text-foreground/80 hover:text-gold px-3">
                Login
              </Link>
              <Link
                to="/auth/signup"
                data-testid="nav-start-free"
                className="px-5 py-2 rounded-full gradient-gold-bg text-navy-deep font-semibold hover:scale-[1.03] transition-transform inline-block"
              >
                Start Free →
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden h-10 w-10 rounded-full border border-gold-subtle flex items-center justify-center text-foreground"
          onClick={() => setOpen(!open)}
          data-testid="nav-mobile-toggle"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-gold-subtle bg-background/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-2">
            <NavLink to="/" end className={linkCls} onClick={() => setOpen(false)}>Home</NavLink>
            <NavLink to="/about" className={linkCls} onClick={() => setOpen(false)}>About</NavLink>
            <NavLink to="/pricing" className={linkCls} onClick={() => setOpen(false)}>Pricing</NavLink>
            <div className="flex items-center gap-3 pt-3">
              <ThemeToggle />
              {!user && (
                <>
                  <Link to="/auth/login" className="flex-1 text-center py-2 rounded-full border border-gold-subtle">Login</Link>
                  <Link to="/auth/signup" className="flex-1 text-center py-2 rounded-full gradient-gold-bg text-navy-deep font-semibold">Start Free</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
