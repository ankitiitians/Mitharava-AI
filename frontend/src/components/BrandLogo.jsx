export default function BrandLogo({ size = 40, withWord = true, tagline = false, className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} data-testid="brand-logo">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Mitharva AI"
      >
        <defs>
          <linearGradient id="gold-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#F0C755" />
            <stop offset="50%" stopColor="#D4AF55" />
            <stop offset="100%" stopColor="#B8962E" />
          </linearGradient>
          <linearGradient id="navy-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1A2B5F" />
            <stop offset="100%" stopColor="#0F1B3D" />
          </linearGradient>
        </defs>
        {/* Hex shield */}
        <path
          d="M32 2 L58 16 L58 48 L32 62 L6 48 L6 16 Z"
          fill="url(#navy-grad)"
          stroke="url(#gold-grad)"
          strokeWidth="1.5"
        />
        {/* Stylized M with face silhouette */}
        <path
          d="M14 46 L14 18 L22 18 L32 32 L42 18 L50 18 L50 46 L44 46 L44 28 L34 41 L30 41 L20 28 L20 46 Z"
          fill="url(#gold-grad)"
        />
        {/* Face silhouette dot */}
        <circle cx="32" cy="36" r="2.2" fill="#0F1B3D" />
        {/* Gold diagonal slash */}
        <rect x="40" y="6" width="3" height="14" transform="rotate(35 41.5 13)" fill="#F0C755" />
        {/* Circuit lines */}
        <path d="M50 30 L58 30 M50 34 L60 34 M50 38 L58 38" stroke="#F0C755" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="60" cy="34" r="1.5" fill="#F0C755" />
      </svg>
      {withWord && (
        <div className="leading-none">
          <div className="flex items-baseline gap-1">
            <span className="font-display font-bold text-[1.35rem] tracking-tight text-foreground">MITHARVA</span>
            <span className="font-display font-bold text-[1.35rem] gradient-gold-text">AI</span>
          </div>
          {tagline && (
            <div className="text-[10px] tracking-[0.25em] text-gold mt-1 font-body">
              PREPARE • PRACTICE • PERFORM
            </div>
          )}
        </div>
      )}
    </div>
  );
}
