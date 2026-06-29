"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle, Circle, Spinner, Eye } from "@phosphor-icons/react";
import WillLogo from "@/components/will-logo";

interface AgentWorkingScreenProps {
  task: string;
  detail: string;
  onDone: () => void;
}

// Live activity log entries that stream in
const ACTIVITY_LOG = [
  { ms: 200,  text: "Initializing WILL agent…",                icon: "init"    },
  { ms: 800,  text: "Reading task context",                    icon: "read"    },
  { ms: 1400, text: "Searching knowledge base",               icon: "search"  },
  { ms: 2000, text: "Analyzing 12 relevant sources",          icon: "analyze" },
  { ms: 2500, text: "Structuring output framework",           icon: "struct"  },
  { ms: 3000, text: "Generating first draft…",                icon: "gen"     },
  { ms: 3500, text: "Refining tone and voice",                icon: "refine"  },
  { ms: 4000, text: "Checking brand alignment",               icon: "check"   },
  { ms: 4400, text: "Finalizing output",                      icon: "done"    },
];

const STAGES = [
  { label: "Research",  pct: 100 },
  { label: "Strategy",  pct: 100 },
  { label: "Generate",  pct: 72  },
  { label: "Review",    pct: 0   },
  { label: "Export",    pct: 0   },
];

function ActivityRow({ text, icon, visible }: { text: string; icon: string; visible: boolean }) {
  const isDone = icon === "done" || icon === "check";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(6px)",
        transition: "opacity 0.35s ease, transform 0.35s cubic-bezier(0.34,1.1,0.64,1)",
        marginBottom: 8,
      }}
    >
      <div style={{ flexShrink: 0, width: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {isDone
          ? <CheckCircle size={14} color="#2eff89" weight="fill" />
          : icon === "init" || icon === "gen"
            ? <Spinner size={13} color="#bda9f5" weight="bold" style={{ animation: "spin 1s linear infinite" }} />
            : <Circle size={10} color="rgba(255,255,255,0.25)" weight="fill" />
        }
      </div>
      <span style={{ fontSize: 12, color: isDone ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.42)", fontWeight: 400, lineHeight: 1.4 }}>
        {text}
      </span>
    </div>
  );
}

export default function AgentWorkingScreen({ task, detail, onDone }: AgentWorkingScreenProps) {
  const [visibleLog, setVisibleLog] = useState<number[]>([]);
  const [progress, setProgress]     = useState(0); // 0–100 overall
  const startRef = useRef(Date.now());

  // Stream log entries
  useEffect(() => {
    const timers = ACTIVITY_LOG.map(({ ms }, i) =>
      setTimeout(() => setVisibleLog((prev) => [...prev, i]), ms)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // Animate progress bar 0 → 72 over ~4s
  useEffect(() => {
    const start = Date.now();
    const target = 72;
    const duration = 4000;
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      const p = Math.min(target, (elapsed / duration) * target);
      setProgress(p);
      if (p < target) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Auto-advance
  useEffect(() => {
    const t = setTimeout(onDone, 4800);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden select-none"
      style={{ background: "#050505" }}
    >
      {/* Top bar */}
      <div
        className="w-full shrink-0 flex items-center justify-between px-4"
        style={{ height: 48, borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <WillLogo variant="building" label="" />
        <div className="flex items-center gap-2">
          <div style={{ width: 6, height: 6, borderRadius: 3, background: "#2eff89", flexShrink: 0 }} />
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, fontWeight: 500, textTransform: "uppercase" }}>
            Working
          </span>
        </div>
        <div style={{ width: 60 }} />
      </div>

      {/* Task context header */}
      <div
        className="w-full shrink-0 flex flex-col px-5"
        style={{ paddingTop: 20, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <p style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", margin: "0 0 4px" }}>
          {task}
        </p>
        <p style={{ fontSize: 18, fontWeight: 700, color: "#ffffff", margin: 0, lineHeight: 1.3 }}>
          {detail}
        </p>
      </div>

      {/* Stage pipeline */}
      <div
        className="w-full shrink-0 flex flex-row items-stretch px-5 gap-1"
        style={{ paddingTop: 14, paddingBottom: 14, borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        {STAGES.map((stage, i) => {
          const done    = stage.pct === 100;
          const active  = stage.pct > 0 && stage.pct < 100;
          const pending = stage.pct === 0;
          return (
            <div key={stage.label} className="flex-1 flex flex-col gap-1">
              {/* Bar */}
              <div style={{ height: 3, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: done ? "100%" : active ? `${progress}%` : "0%",
                    background: done ? "#2eff89" : "#bda9f5",
                    borderRadius: 2,
                    transition: "width 0.3s ease",
                  }}
                />
              </div>
              {/* Label */}
              <span style={{
                fontSize: 9,
                fontWeight: 600,
                letterSpacing: 1.2,
                textTransform: "uppercase",
                color: done ? "#2eff89" : active ? "#bda9f5" : "rgba(255,255,255,0.2)",
                transition: "color 0.3s ease",
              }}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Live activity log — scrollable */}
      <div className="flex-1 overflow-hidden flex flex-col" style={{ padding: "16px 20px 0" }}>
        <div className="flex items-center gap-2 mb-3">
          <Eye size={12} color="rgba(255,255,255,0.3)" weight="bold" />
          <span style={{ fontSize: 10, letterSpacing: 1.8, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", fontWeight: 600 }}>
            Live Activity
          </span>
        </div>

        <div className="flex flex-col">
          {ACTIVITY_LOG.map((entry, i) => (
            <ActivityRow
              key={i}
              text={entry.text}
              icon={entry.icon}
              visible={visibleLog.includes(i)}
            />
          ))}
        </div>
      </div>

      {/* Overall progress footer */}
      <div
        className="w-full shrink-0 flex flex-col gap-2 px-5"
        style={{ paddingBottom: 24, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex justify-between items-center">
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 500 }}>Overall progress</span>
          <span style={{ fontSize: 11, color: "#bda9f5", fontWeight: 700 }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: "rgba(255,255,255,0.07)", overflow: "hidden" }}>
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              background: "linear-gradient(90deg, #502eb0, #bda9f5)",
              borderRadius: 2,
              transition: "width 0.1s linear",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
