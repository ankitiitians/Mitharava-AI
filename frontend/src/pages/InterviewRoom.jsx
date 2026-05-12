import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Mic, MicOff, Pause, Play, X, Keyboard as KeyboardIcon, Camera as CameraIcon } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";
import { useAuth } from "@/lib/auth";

const INTERVIEWERS = [
  { id: "chair", name: "Shri R.K. Sharma", role: "UPSC Chairman (IAS Retd.)", initials: "RK", color: "from-amber-400 to-yellow-700" },
  { id: "domain", name: "Dr. Priya Nambiar", role: "Domain Expert", initials: "PN", color: "from-indigo-400 to-indigo-700" },
  { id: "legal", name: "Adv. Mehul Desai", role: "Legal Expert", initials: "MD", color: "from-emerald-400 to-emerald-700" },
];

const DEMO_OPENING = "Good morning. I am R.K. Sharma, Chairman of this panel. We have reviewed your application. Tell us about yourself and what brought you to civil services.";

export default function InterviewRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const [session, setSession] = useState(null);
  const [transcript, setTranscript] = useState([]);
  const [orbState, setOrbState] = useState("idle"); // idle | listening | processing | speaking
  const [currentSpeaker, setCurrentSpeaker] = useState(0);
  const [timer, setTimer] = useState(0);
  const [latestEval, setLatestEval] = useState(null);
  const [livesnippet, setLiveSnippet] = useState("");
  const [showPerm, setShowPerm] = useState(false);
  const [cameraOn, setCameraOn] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [textMode, setTextMode] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [endConfirm, setEndConfirm] = useState(false);
  const [qIndex, setQIndex] = useState(0);

  // Load session
  useEffect(() => {
    api.get(`/sessions/${id}`).then((r) => {
      setSession(r.data);
      if (r.data.mode === "text") setTextMode(true);
    }).catch(() => navigate("/dashboard"));
  }, [id, navigate]);

  // Timer
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setTimer((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [paused]);

  // Initialize camera + opening
  useEffect(() => {
    if (!session) return;
    const wantCamera = session.mode === "voice_camera";
    const wantMic = session.mode !== "text";

    if (wantCamera || wantMic) {
      navigator.mediaDevices.getUserMedia({ video: wantCamera, audio: wantMic })
        .then((stream) => {
          streamRef.current = stream;
          if (wantCamera && videoRef.current) {
            videoRef.current.srcObject = stream;
            setCameraOn(true);
          }
        })
        .catch(() => setShowPerm(true));
    }

    // Speak opening line and add to transcript
    setTimeout(() => {
      const opening = { role: "assistant", speaker: INTERVIEWERS[0].name, text: DEMO_OPENING, ts: Date.now() };
      setTranscript([opening]);
      speak(opening.text);
    }, 1000);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      window.speechSynthesis?.cancel();
      try { recognitionRef.current?.stop(); } catch {}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;
    setOrbState("speaking");
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.95; u.pitch = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const indian = voices.find(v => /(en-IN|hi-IN)/i.test(v.lang)) || voices.find(v => /Google.*UK English Male|Daniel/i.test(v.name)) || voices[0];
    if (indian) u.voice = indian;
    u.onend = () => setOrbState("idle");
    u.onerror = () => setOrbState("idle");
    window.speechSynthesis.speak(u);
  };

  const startListening = useCallback(() => {
    if (orbState !== "idle") return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      toast.error("Speech recognition unavailable. Switch to text mode.");
      setTextMode(true);
      return;
    }
    const r = new SR();
    r.continuous = false;
    r.interimResults = true;
    r.lang = session?.language === "hindi" ? "hi-IN" : "en-IN";
    setOrbState("listening");
    setLiveSnippet("");

    let finalText = "";
    r.onresult = (ev) => {
      let interim = "";
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const t = ev.results[i][0].transcript;
        if (ev.results[i].isFinal) finalText += t;
        else interim += t;
      }
      setLiveSnippet(finalText + interim);
    };
    r.onerror = (e) => {
      setOrbState("idle");
      if (e.error !== "no-speech") toast.error(`Mic error: ${e.error}`);
    };
    r.onend = () => {
      const final = finalText.trim();
      setLiveSnippet("");
      if (final) submitAnswer(final);
      else setOrbState("idle");
    };
    recognitionRef.current = r;
    try { r.start(); } catch { setOrbState("idle"); }
  }, [orbState, session]);

  const stopListening = () => {
    try { recognitionRef.current?.stop(); } catch {}
  };

  const submitAnswer = async (answerText) => {
    setOrbState("processing");
    const userMsg = { role: "user", text: answerText, ts: Date.now() };
    setTranscript((t) => [...t, userMsg]);
    try {
      const { data } = await api.post("/sessions/turn", { session_id: id, user_message: answerText, question_index: qIndex });
      const p = data.parsed || {};
      const speakerName = p.speakerName || INTERVIEWERS[(currentSpeaker + 1) % INTERVIEWERS.length].name;
      // rotate panel speaker for visual variety
      const newSpeaker = (currentSpeaker + 1) % INTERVIEWERS.length;
      setCurrentSpeaker(newSpeaker);
      setLatestEval(p.evaluation || null);
      setQIndex((q) => q + 1);

      const aiMsg = {
        role: "assistant",
        speaker: speakerName,
        text: p.nextQuestion || "Thank you. Please tell me more.",
        ts: Date.now(),
        evaluation: p.evaluation,
      };
      setTranscript((t) => [...t, aiMsg]);
      speak(aiMsg.text);

      if (p.isInterviewComplete || qIndex >= 11) {
        setTimeout(() => endInterview(), 5000);
      }
    } catch (err) {
      setOrbState("idle");
      toast.error("AI response failed. Try again.");
    }
  };

  const submitText = () => {
    if (!textInput.trim()) return;
    submitAnswer(textInput.trim());
    setTextInput("");
  };

  const endInterview = async () => {
    try {
      window.speechSynthesis?.cancel();
      stopListening();
      await api.post("/sessions/complete", {
        session_id: id,
        transcript: transcript.map(t => ({ role: t.role, text: t.text, speaker: t.speaker, evaluation: t.evaluation })),
        duration_seconds: timer,
        camera_used: cameraOn,
      });
      toast.success("Interview complete! Generating report...");
      navigate(`/interview/results/${id}`);
    } catch {
      toast.error("Failed to save session");
    }
  };

  if (!session) return <div className="min-h-screen bg-navy-deep flex items-center justify-center text-white">Loading interview room...</div>;

  const mmss = `${String(Math.floor(timer/60)).padStart(2,"0")}:${String(timer%60).padStart(2,"0")}`;

  return (
    <div className="min-h-screen bg-navy-deep text-white flex flex-col" data-testid="interview-room">
      {/* TOP BAR */}
      <div className="h-14 px-4 lg:px-6 flex items-center justify-between border-b border-gold-subtle bg-navy/60 backdrop-blur-md">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-gold font-display font-bold">◆ Mitharva AI</span>
          <span className="hidden md:inline text-white/40">•</span>
          <span className="hidden md:inline text-white/70 text-xs">{labelFor(session.session_type)} — {session.sub_type?.replace("_"," ")}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm text-gold" data-testid="room-timer">⏱ {mmss}</span>
          <span className="flex items-center gap-1 text-xs text-red-400"><span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" /> REC</span>
          <button onClick={() => setEndConfirm(true)} data-testid="room-end-btn" className="ml-2 inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-white/20 text-xs hover:border-red-400 hover:text-red-400">
            <X size={12} /> End
          </button>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="flex-1 grid lg:grid-cols-[280px_1fr_320px] grid-cols-1 gap-0 overflow-hidden">
        {/* LEFT: Interviewers */}
        <div className="hidden lg:block border-r border-gold-subtle bg-navy/40 p-4 space-y-3 overflow-y-auto">
          <div className="text-[10px] tracking-[0.2em] text-gold mb-2">PANEL</div>
          {INTERVIEWERS.map((it, idx) => {
            const speaking = orbState === "speaking" && idx === currentSpeaker;
            return (
              <div key={it.id} className={`rounded-2xl p-4 border bg-navy-mid/60 ${speaking ? "border-gold glow-gold-sm" : "border-gold-subtle"}`}>
                <div className="flex items-center gap-3">
                  <div className={`relative h-12 w-12 rounded-full bg-gradient-to-br ${it.color} flex items-center justify-center text-navy-deep font-bold ${speaking ? "animate-pulse-gold" : ""}`}>
                    {it.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate">{it.name}</div>
                    <div className="text-[10px] text-white/60">{it.role}</div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-[11px]">
                  {speaking ? (
                    <>
                      <span className="text-emerald-400">🟢 Speaking</span>
                      <div className="wave-bars ml-1"><span/><span/><span/><span/></div>
                    </>
                  ) : orbState === "listening" ? (
                    <span className="text-white/50">⚫ Listening</span>
                  ) : (
                    <span className="text-white/50">⚫ Waiting</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CENTER: Camera + Transcript + Orb */}
        <div className="flex flex-col min-h-0">
          {/* Camera */}
          <div className="relative bg-black border-b border-gold-subtle">
            <div className="aspect-video max-h-[40vh] w-full relative overflow-hidden">
              {cameraOn ? (
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover border-2 border-gold/40" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-center">
                  <div>
                    <CameraIcon size={40} className="mx-auto text-gold/50" />
                    <div className="mt-2 text-xs text-white/60">{session.mode === "text" ? "Text mode active" : "Camera off"}</div>
                  </div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-xs">You — {user?.full_name?.split(" ")[0] || "Candidate"}</div>
              {cameraOn && latestEval && (
                <div className="absolute top-2 right-2 px-2 py-1 rounded bg-black/60 text-xs text-gold border border-gold-subtle">
                  💡 {latestEval.liveTip || "Make eye contact with the camera"}
                </div>
              )}
            </div>
          </div>

          {/* Transcript */}
          <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-4 space-y-4" data-testid="transcript-area">
            {transcript.map((m, i) => (
              <Message key={i} m={m} />
            ))}
            {orbState === "listening" && livesnippet && (
              <Message m={{ role: "user", text: livesnippet + "…" }} live />
            )}
            {orbState === "processing" && (
              <div className="text-xs text-gold flex items-center gap-2"><span className="inline-block h-2 w-2 bg-gold rounded-full animate-bounce" />Thinking...</div>
            )}
          </div>

          {/* Bottom voice bar */}
          <div className="border-t border-gold-subtle bg-navy/60 p-5 flex flex-col items-center">
            {textMode ? (
              <div className="w-full max-w-2xl">
                <textarea
                  data-testid="text-input"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-navy-mid border border-gold-subtle text-white text-sm focus:outline-none focus:border-gold resize-none"
                  placeholder="Type your answer here…"
                />
                <div className="flex justify-between items-center mt-2">
                  <button onClick={() => setTextMode(false)} className="text-xs text-white/60 hover:text-gold inline-flex items-center gap-1"><Mic size={12} /> Switch to voice</button>
                  <button data-testid="text-submit" disabled={!textInput.trim() || orbState !== "idle"} onClick={submitText} className="px-5 py-2 rounded-full gradient-gold-bg text-navy-deep font-semibold text-sm disabled:opacity-50">Send →</button>
                </div>
              </div>
            ) : (
              <>
                <button
                  onClick={orbState === "listening" ? stopListening : startListening}
                  disabled={orbState === "speaking" || orbState === "processing" || paused}
                  data-testid="voice-orb"
                  className={`disabled:opacity-50 ${orbState === "listening" ? "orb-listening" : orbState === "processing" ? "orb-processing" : orbState === "speaking" ? "orb-speaking" : "orb-idle"}`}
                  aria-label="Voice control"
                />
                <div className="mt-4 text-sm text-white/70">
                  {orbState === "idle" && "Tap to speak your answer"}
                  {orbState === "listening" && "Listening..."}
                  {orbState === "processing" && "Analyzing..."}
                  {orbState === "speaking" && "AI is responding..."}
                </div>
                {orbState === "listening" && (
                  <div className="mt-3 wave-bars"><span/><span/><span/><span/></div>
                )}
                <div className="mt-5 flex items-center gap-3">
                  <button onClick={() => setPaused(!paused)} data-testid="room-pause" className="px-4 py-2 rounded-full border border-white/20 text-xs hover:border-gold hover:text-gold inline-flex items-center gap-1">
                    {paused ? <Play size={12} /> : <Pause size={12} />} {paused ? "Resume" : "Pause"}
                  </button>
                  <button onClick={() => setMuted(!muted)} data-testid="room-mute" className="px-4 py-2 rounded-full border border-white/20 text-xs hover:border-gold hover:text-gold inline-flex items-center gap-1">
                    {muted ? <MicOff size={12} /> : <Mic size={12} />} {muted ? "Unmute" : "Mute"}
                  </button>
                  <button onClick={() => setTextMode(true)} data-testid="switch-text" className="px-4 py-2 rounded-full border border-white/20 text-xs hover:border-gold hover:text-gold inline-flex items-center gap-1">
                    <KeyboardIcon size={12} /> Text Mode
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* RIGHT: Live Analytics */}
        <div className="hidden lg:block border-l border-gold-subtle bg-navy/40 p-5 overflow-y-auto text-sm">
          <div className="text-[10px] tracking-[0.2em] text-gold mb-1">LIVE ANALYTICS</div>
          <div className="mb-4">
            <div className="text-xs text-white/60 mb-1">Question {qIndex + 1} of ~12</div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full gradient-gold-bg transition-all" style={{ width: `${Math.min(100, ((qIndex + 1)/12)*100)}%` }} />
            </div>
          </div>

          <div className="mb-5">
            <div className="text-xs text-white/60 mb-1">Current Answer Score</div>
            <div className="rounded-xl bg-navy-mid p-3">
              <div className="flex items-baseline justify-between">
                <span className="font-mono text-2xl font-bold text-gold">{(latestEval?.overallScore ?? 0).toFixed(1)}</span>
                <span className="text-xs text-white/50">/ 10</span>
              </div>
              <div className="mt-2 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full gradient-gold-bg" style={{ width: `${(latestEval?.overallScore ?? 0)*10}%` }} />
              </div>
            </div>
          </div>

          <div className="space-y-2 mb-5">
            {[
              ["Technical", latestEval?.technicalScore],
              ["Clarity", latestEval?.clarityScore],
              ["Structure", latestEval?.structureScore],
              ["Confidence", latestEval?.confidenceEstimate],
            ].map(([label, val]) => (
              <div key={label}>
                <div className="flex justify-between text-xs text-white/70"><span>{label}</span><span className="font-mono">{(val ?? 0).toFixed(1)}</span></div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full gradient-gold-bg" style={{ width: `${((val ?? 0))*10}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="mb-5 p-3 rounded-xl bg-[rgba(184,150,46,0.08)] border border-gold-subtle">
            <div className="text-xs text-gold mb-1">💡 Live Tip</div>
            <div className="text-xs text-white/80">{latestEval?.liveTip || "Speak clearly and structure your answer with a beginning, middle, and end."}</div>
          </div>

          <div className="mb-5">
            <div className="text-xs text-white/60 mb-2">📷 Body Language</div>
            <BLine label="Eye Contact" v={cameraOn ? "Good ✅" : "—"} />
            <BLine label="Posture" v={cameraOn ? "Upright ✅" : "—"} />
            <BLine label="Expressions" v={cameraOn ? "Neutral ✅" : "—"} />
            <BLine label="Nervousness" v={cameraOn ? "Low ✅" : "—"} />
          </div>

          <div>
            <div className="text-xs text-white/60 mb-2">⏱ Session</div>
            <BLine label="Time" v={`${mmss} / ${String(session.duration_minutes).padStart(2,'0')}:00`} />
            <BLine label="Done" v={`${qIndex} / ~12`} />
            <BLine label="Avg" v={`${((latestEval?.overallScore ?? 0)).toFixed(1)} / 10`} />
          </div>
        </div>
      </div>

      {/* PERMISSION MODAL */}
      {showPerm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
          <div className="card-surface !bg-navy-mid max-w-md w-full p-6 text-white">
            <div className="flex items-center gap-2 text-gold mb-3"><CameraIcon size={20} /> <span className="font-semibold">Camera Access for Better Experience</span></div>
            <p className="text-sm text-white/80">Mitharva AI uses your camera to:</p>
            <ul className="mt-2 text-sm text-white/70 space-y-1">
              <li>• Simulate a real interview environment</li>
              <li>• Analyze eye contact & body language</li>
              <li>• Give posture feedback</li>
            </ul>
            <div className="flex gap-2 mt-5">
              <button data-testid="perm-allow" onClick={() => { setShowPerm(false); navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((s) => { streamRef.current = s; if (videoRef.current) { videoRef.current.srcObject = s; setCameraOn(true); } }).catch(() => {}); }} className="flex-1 px-4 py-2 rounded-full gradient-gold-bg text-navy-deep font-semibold text-sm">Allow Camera + Mic</button>
              <button data-testid="perm-deny" onClick={() => setShowPerm(false)} className="flex-1 px-4 py-2 rounded-full border border-white/20 text-sm">Continue Voice Only</button>
            </div>
          </div>
        </div>
      )}

      {/* END CONFIRM */}
      {endConfirm && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-6">
          <div className="card-surface !bg-navy-mid max-w-md w-full p-6 text-white">
            <div className="font-display text-xl">End interview?</div>
            <p className="text-sm text-white/70 mt-2">Your session will be saved and analyzed. You can review it on the results page.</p>
            <div className="flex gap-2 mt-5">
              <button data-testid="end-cancel" onClick={() => setEndConfirm(false)} className="flex-1 px-4 py-2 rounded-full border border-white/20 text-sm">Continue</button>
              <button data-testid="end-confirm" onClick={endInterview} className="flex-1 px-4 py-2 rounded-full bg-red-500 text-white font-semibold text-sm">End & Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Message({ m, live }) {
  if (m.role === "assistant") {
    return (
      <div className="flex gap-3 animate-fade-up">
        <div className="h-9 w-9 rounded-full gradient-gold-bg flex items-center justify-center text-navy-deep text-xs font-bold shrink-0">{(m.speaker || "AI").split(" ").map(s => s[0]).join("").slice(0,2)}</div>
        <div className="max-w-[80%]">
          <div className="text-[10px] tracking-widest text-gold mb-1">{m.speaker || "AI"}</div>
          <div className="rounded-2xl bg-navy-mid border border-gold-subtle px-4 py-3 text-sm leading-relaxed">{m.text}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3 justify-end animate-fade-up">
      <div className="max-w-[80%]">
        <div className="text-[10px] tracking-widest text-white/60 text-right mb-1">YOU</div>
        <div className={`rounded-2xl bg-navy-light border ${live ? "border-gold animate-pulse" : "border-gold-subtle"} px-4 py-3 text-sm leading-relaxed`}>{m.text}</div>
      </div>
    </div>
  );
}

function BLine({ label, v }) {
  return (
    <div className="flex justify-between text-xs text-white/80 py-1">
      <span className="text-white/60">{label}</span>
      <span className="font-mono">{v}</span>
    </div>
  );
}

function labelFor(t) {
  return { upsc: "UPSC Personality Test", ssc: "SSC Interview", banking: "Banking Interview", railway: "Railway Interview", campus_it: "Campus IT Interview", campus_mba: "MBA Campus Interview", hr: "HR Round", quick: "Quick Drill" }[t] || t;
}
