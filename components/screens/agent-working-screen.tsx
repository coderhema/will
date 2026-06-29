"use client";

import { useEffect, useState } from "react";
import WillLogo from "@/components/will-logo";

interface AgentWorkingScreenProps {
  task: string;
  detail: string;
  onDone: () => void;
}

const BUILDING_PHRASES = [
  "Analyzing your brief…",
  "Researching competitors…",
  "Structuring the strategy…",
  "Generating content…",
  "Designing assets…",
];

export default function AgentWorkingScreen({ task, detail, onDone }: AgentWorkingScreenProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % BUILDING_PHRASES.length);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance after ~4.5s
  useEffect(() => {
    const t = setTimeout(onDone, 4500);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center select-none relative overflow-hidden"
      style={{ background: "#000000" }}
    >
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 55% at 50% 50%, rgba(80,46,176,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Pulse rings */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 310,
          height: 310,
          border: "1px solid rgba(189,169,245,0.10)",
          animation: "pulse-ring 2.2s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 195,
          height: 195,
          border: "1px solid rgba(189,169,245,0.16)",
          animation: "pulse-ring 2.2s ease-in-out 0.45s infinite",
        }}
      />

      {/* Large BUILDING logo */}
      <WillLogo variant="splash" label="BUILDING" />

      {/* Task context */}
      <div className="mt-7 flex flex-col items-center gap-1">
        <p style={{ fontSize: 13, fontWeight: 500, letterSpacing: 2.5, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", margin: 0 }}>
          {task}
        </p>
        <p style={{ fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.6)", textAlign: "center", maxWidth: 260, lineHeight: 1.5, margin: "4px 0 0" }}>
          {detail}
        </p>
      </div>

      {/* Rolling phrase */}
      <p
        className="mt-8 text-center"
        style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", transition: "opacity 0.3s ease", minHeight: 20, margin: "32px 0 0" }}
      >
        {BUILDING_PHRASES[phraseIndex]}
      </p>

      {/* Progress dots */}
      <div className="flex gap-2 mt-6">
        {BUILDING_PHRASES.map((_, i) => (
          <span
            key={i}
            className="rounded-full transition-all"
            style={{
              width: i === phraseIndex ? 16 : 6,
              height: 6,
              background: i <= phraseIndex ? "rgba(189,169,245,0.9)" : "rgba(255,255,255,0.15)",
              display: "inline-block",
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.93); opacity: 0.4; }
          50%  { transform: scale(1.05); opacity: 1;   }
          100% { transform: scale(0.93); opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
