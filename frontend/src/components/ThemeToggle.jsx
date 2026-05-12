import { Sun, Moon } from "lucide-react";
import { useTheme } from "../lib/theme";

export default function ThemeToggle({ className = "" }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      data-testid="theme-toggle"
      className={`relative h-10 w-10 rounded-full border border-gold-subtle hover:border-gold transition-all flex items-center justify-center text-foreground hover:text-gold ${className}`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
