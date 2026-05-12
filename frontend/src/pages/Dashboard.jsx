import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mic, BarChart3, Flame, Trophy, ArrowRight, TrendingUp, AlertCircle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, PolarRadiusAxis } from "recharts";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/dashboard/stats").then((r) => setStats(r.data)).catch(() => {});
  }, []);

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const today = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const radarData = stats ? Object.entries(stats.radar).map(([k, v]) => ({ subject: k.replace(/([A-Z])/g, ' $1').trim(), score: v })) : [];

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 animate-fade-up">
        <div>
          <h1 className="font-display text-4xl font-semibold text-foreground">
            {greeting}, <span className="gradient-gold-text">{user?.full_name?.split(" ")[0] || "Aspirant"}</span> 👋
          </h1>
          <div className="text-foreground/60 mt-1 text-sm">{today}</div>
        </div>
        <Link to="/interview/setup" data-testid="dash-new-interview-btn" className="inline-flex items-center gap-2 px-6 py-3 rounded-full gradient-gold-bg text-navy-deep font-semibold hover:scale-[1.03] glow-gold-sm transition-transform">
          <Mic size={16} /> New Interview
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BarChart3} label="Total Sessions" value={stats?.total_sessions ?? user?.total_interviews ?? 0} sub="↑ 12 this week" />
        <StatCard icon={Trophy} label="Avg Score" value={`${stats?.avg_score ?? 7.2}/10`} sub="↑ 0.8 trend" />
        <StatCard icon={Flame} label="Streak" value={`${stats?.streak ?? 5} days`} sub="Keep going!" />
        <StatCard icon={TrendingUp} label="Percentile" value={`Top ${100 - (stats?.percentile ?? 77)}%`} sub="Among all users" />
      </div>

      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 card-surface p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs tracking-[0.2em] text-gold">SCORE PROGRESS</div>
              <h3 className="font-display text-xl font-semibold text-foreground">Last 10 Sessions</h3>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={stats?.chart_data || []}>
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis domain={[0, 10]} stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip contentStyle={{ background: "var(--surface-card)", border: "1px solid var(--border-gold)", borderRadius: 8 }} />
                <Legend />
                <Line type="monotone" name="Communication" dataKey="comm" stroke="#F0C755" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" name="Technical" dataKey="tech" stroke="#60A5FA" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-2 card-surface p-6">
          <div className="text-xs tracking-[0.2em] text-gold">SKILL RADAR</div>
          <h3 className="font-display text-xl font-semibold text-foreground">6 Dimensions</h3>
          <div className="h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="rgba(184,150,46,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <PolarRadiusAxis domain={[0, 10]} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
                <Radar name="You" dataKey="score" stroke="#B8962E" fill="#D4AF55" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="card-surface p-6">
        <h3 className="font-display text-xl font-semibold text-foreground mb-4">Recent Sessions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs uppercase tracking-wider text-foreground/60 border-b border-gold-subtle">
                <th className="text-left py-3 pr-3">Session</th>
                <th className="text-left py-3 pr-3">Type</th>
                <th className="text-left py-3 pr-3">Score</th>
                <th className="text-left py-3 pr-3">Duration</th>
                <th className="text-left py-3 pr-3">Date</th>
                <th className="text-right py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recent || []).map((s) => (
                <tr key={s.id} className="border-b border-gold-subtle/50 hover:bg-[rgba(184,150,46,0.04)]">
                  <td className="py-3 pr-3 font-medium text-foreground">{labelFor(s.session_type)} {s.sub_type ? `— ${s.sub_type.replace("_"," ")}` : ""}</td>
                  <td className="py-3 pr-3 text-foreground/70 capitalize">{s.session_type.replace("_"," ")}</td>
                  <td className="py-3 pr-3 font-mono text-gold">{s.overall_score?.toFixed(1)}/10</td>
                  <td className="py-3 pr-3 text-foreground/70">{Math.round((s.duration_seconds || 0)/60)} min</td>
                  <td className="py-3 pr-3 text-foreground/70">{(s.completed_at || s.created_at || "").slice(0, 10)}</td>
                  <td className="py-3 text-right">
                    <Link to={`/interview/results/${s.id}`} data-testid={`view-result-${s.id}`} className="inline-flex items-center gap-1 text-gold hover:underline">View <ArrowRight size={12} /></Link>
                  </td>
                </tr>
              ))}
              {!stats?.recent?.length && (
                <tr><td colSpan={6} className="py-8 text-center text-foreground/60">No sessions yet. <Link to="/interview/setup" className="text-gold hover:underline">Start your first →</Link></td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: "🏛️", title: "UPSC Full Mock — Panel Mode", meta: "Hard • 30-45 min", sub: "Based on your DAF" },
          { icon: "📰", title: "Current Affairs Speed Round", meta: "Medium • 15 min", sub: "Last 7 days news" },
          { icon: "🗣️", title: "Confidence Drill", meta: "Easy • 10 min", sub: "Target weak areas" },
        ].map((c) => (
          <Link key={c.title} to="/interview/setup" data-testid={`suggest-${c.title.toLowerCase().replace(/[^a-z]+/g, '-').slice(0,30)}`} className="card-surface p-5 hover:glow-gold-sm hover:-translate-y-1 transition-all">
            <div className="text-3xl">{c.icon}</div>
            <div className="mt-3 font-semibold text-foreground">{c.title}</div>
            <div className="text-xs text-foreground/60">{c.meta}</div>
            <div className="text-xs text-foreground/70 mt-2">{c.sub}</div>
            <div className="mt-4 text-gold text-sm font-medium inline-flex items-center gap-1">Start Now <ArrowRight size={14} /></div>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border-2 border-gold p-5 bg-[rgba(184,150,46,0.06)] flex items-start gap-3">
        <AlertCircle className="text-gold mt-0.5" size={20} />
        <div className="flex-1">
          <div className="font-semibold text-foreground">Focus Areas</div>
          <div className="text-sm text-foreground/70 mt-1">Your Confidence ({stats?.radar?.Confidence ?? 6.5}/10) and Current Affairs ({stats?.radar?.CurrentAffairs ?? 7.0}/10) need attention.</div>
          <div className="mt-3 flex gap-2 flex-wrap">
            <Link to="/interview/setup" className="px-3 py-1.5 rounded-full text-xs border border-gold text-gold hover:bg-gold hover:text-navy-deep transition-colors">Practice Confidence</Link>
            <Link to="/current-affairs" className="px-3 py-1.5 rounded-full text-xs border border-gold text-gold hover:bg-gold hover:text-navy-deep transition-colors">Daily News Quiz</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function labelFor(t) {
  return { upsc: "UPSC", ssc: "SSC", banking: "Banking", railway: "Railway", campus_it: "Campus IT", campus_mba: "Campus MBA" }[t] || t;
}

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="card-surface p-5 hover:border-gold hover:-translate-y-1 transition-all">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-wider text-foreground/60">{label}</div>
        <div className="h-9 w-9 rounded-full bg-[rgba(184,150,46,0.08)] flex items-center justify-center text-gold">
          <Icon size={16} />
        </div>
      </div>
      <div className="font-mono text-3xl font-bold text-foreground mt-3">{value}</div>
      <div className="text-xs text-foreground/60 mt-1">{sub}</div>
    </div>
  );
}
