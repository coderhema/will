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
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % BUILDING_PHRASES.length);
      setElapsed((e) => e + 1);
    }, 900);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance after 4 seconds
  useEffect(() => {
    const t = setTimeout(onDone, 4000);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center select-none relative overflow-hidden"
      style={{
        background: "#000",
        backgroundImage:
          "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(80,46,176,0.15) 0%, transparent 70%)",
      }}
    >
      {/* Ambient pulse ring */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 320,
          height: 320,
          border: "1px solid rgba(189,169,245,0.12)",
          borderRadius: "50%",
          animation: "pulse-ring 2s ease-in-out infinite",
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: 200,
          height: 200,
          border: "1px solid rgba(189,169,245,0.18)",
          borderRadius: "50%",
          animation: "pulse-ring 2s ease-in-out 0.4s infinite",
        }}
      />

      {/* Logo */}
      <WillLogo
        label="BUILDING"
        size="lg"
        ringColor="#ffffff"
        dotColor="#ffffff"
        labelColor="#ffffff"
      />

      {/* Task name */}
      <div className="mt-6 flex flex-col items-center gap-1">
        <p
          style={{
            fontSize: 13,
            fontWeight: 500,
            letterSpacing: 2.5,
            color: "rgba(255,255,255,0.35)",
            textTransform: "uppercase",
          }}
        >
          {task}
        </p>
        <p
          style={{
            fontSize: 16,
            fontWeight: 400,
            color: "rgba(255,255,255,0.60)",
            textAlign: "center",
            maxWidth: 260,
            lineHeight: 1.5,
          }}
        >
          {detail}
        </p>
      </div>

      {/* Rolling phrase */}
      <div
        className="mt-8 text-center"
        style={{
          fontSize: 13,
          color: "rgba(255,255,255,0.45)",
          minHeight: 20,
          transition: "opacity 0.3s ease",
        }}
      >
        {BUILDING_PHRASES[phraseIndex]}
      </div>

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
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse-ring {
          0%   { transform: scale(0.92); opacity: 0.5; }
          50%  { transform: scale(1.04); opacity: 1;   }
          100% { transform: scale(0.92); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
