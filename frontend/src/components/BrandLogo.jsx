export default function BrandLogo({ size = 40, withWord = true, tagline = false, className = "" }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} data-testid="brand-logo">
      <img
        src="/logo.png"
        alt="Mitharva AI"
        width={size}
        height={size}
        className="object-contain shrink-0"
        style={{ height: size, width: size }}
      />
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
