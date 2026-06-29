"use client";

import WillLogo from "@/components/will-logo";

interface AgentDesignScreenProps {
  task: string;
  detail: string;
  onApprove: () => void;
  onBack: () => void;
}

export default function AgentDesignScreen({ task, detail, onApprove, onBack }: AgentDesignScreenProps) {
  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden">
      {/* Status bar */}
      <div
        className="w-full shrink-0 flex flex-row gap-2 items-center justify-center"
        style={{ height: 49, background: "#0a0a0a" }}
      >
        <div style={{ width: 6, height: 6, background: "#2eff89", borderRadius: 3, flexShrink: 0 }} />
        <span style={{ fontSize: 11, lineHeight: "11px", color: "#ffffff", fontWeight: 400, whiteSpace: "nowrap" }}>
          Generating ad variations for your brand
        </span>
      </div>

      {/* Header */}
      <div
        className="w-full shrink-0 flex flex-row items-center justify-between"
        style={{ height: 68, padding: "0 16px", borderBottom: "1.5px solid #0a0a0a" }}
      >
        <button
          onClick={onBack}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0 }}
        >
          <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }}>
            <path
              d="M6.9 2.352q-.096.014-.168.051-.068.034-2.177 2.136-2.105 2.099-2.146 2.167-.113.181-.072.407.027.096.068.174.044.075 2.157 2.177l1.682 1.678q.376.366.516.465.085.055.198.055h.041q.239 0 .42-.181.113-.113.147-.28.034-.167-.02-.321-.027-.085-.26-.321-.232-.239-1.364-1.374-1.582-1.582-1.582-1.596 0-.014 3.428-.014l3.011 0q.448 0 .53-.034.085-.038.167-.12.085-.085.133-.188.051-.106.051-.232 0-.126-.041-.239-.099-.195-.294-.294l-.085-.041-3.445 0q-3.456 0-3.456-.014 0-.014 1.582-1.596 1.132-1.135 1.364-1.371.232-.239.26-.325.068-.208-.003-.403-.068-.198-.243-.301-.174-.106-.4-.065z"
              fill="#ffffff"
            />
          </svg>
        </button>

        {/* Amber READY logo */}
        <WillLogo variant="ready" label="READY" />

        <div style={{ width: 20 }} />
      </div>

      {/* Canvas area — scrollable */}
      <div
        className="flex-1 overflow-y-auto flex flex-col"
        style={{ padding: "16px 20px 0 20px" }}
      >
        {/* Artboard card */}
        <div
          className="w-full flex flex-col overflow-hidden shrink-0"
          style={{
            background: "#080808",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 15,
          }}
        >
          {/* Brand strip */}
          <div
            className="w-full flex items-center justify-center shrink-0"
            style={{ height: 44, background: "#0f0f0f", borderRadius: "12px 12px 0 0" }}
          >
            <span style={{ fontSize: 14, lineHeight: "14px", fontWeight: 700, letterSpacing: 3, color: "#ffffff" }}>
              NOMAD
            </span>
          </div>

          {/* Hero image — SVG landscape */}
          <div
            className="w-full shrink-0 overflow-hidden"
            style={{ height: 160, position: "relative" }}
          >
            <svg
              viewBox="0 0 350 160"
              preserveAspectRatio="xMidYMid slice"
              xmlns="http://www.w3.org/2000/svg"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
            >
              <defs>
                <linearGradient id="g-sky" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0d1b2a" />
                  <stop offset="100%" stopColor="#1a3a4a" />
                </linearGradient>
                <linearGradient id="g-mtn" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0a2a1e" />
                  <stop offset="100%" stopColor="#061510" />
                </linearGradient>
              </defs>
              <rect width="350" height="160" fill="url(#g-sky)" />
              {[20, 55, 90, 135, 168, 208, 248, 298, 330].map((x, i) => (
                <circle key={i} cx={x} cy={6 + (i * 3) % 16} r={0.8} fill="rgba(255,255,255,0.6)" />
              ))}
              <path d="M0 160 L0 102 L48 62 L98 92 L148 47 L200 82 L252 56 L302 86 L350 66 L350 160 Z" fill="url(#g-mtn)" />
              <circle cx="290" cy="28" r="14" fill="#f5e6c8" opacity="0.9" />
              <circle cx="296" cy="22" r="12" fill="#1a2a3a" />
              {[38, 80, 158, 202, 278].map((x, i) => (
                <circle key={i} cx={x} cy={118 + (i % 3) * 8} r={1.2} fill="rgba(255,220,100,0.7)" />
              ))}
            </svg>
          </div>

          {/* Ad content */}
          <div
            className="w-full flex flex-col shrink-0"
            style={{ padding: 15, background: "#080808", gap: 8 }}
          >
            {/* Tag */}
            <div
              style={{
                background: "rgba(255,255,255,0.06)",
                borderRadius: 4,
                padding: "3px 7px",
                width: "fit-content",
              }}
            >
              <span style={{ fontSize: 9, lineHeight: "9px", fontWeight: 500, color: "#ffffff" }}>
                Travel · Adventure
              </span>
            </div>

            {/* Headline */}
            <h2 style={{ fontSize: 22, lineHeight: "25px", fontWeight: 700, color: "#ffffff", margin: 0 }}>
              Your Next Adventure<br />Starts Here
            </h2>

            {/* Body copy */}
            <p style={{ fontSize: 12, lineHeight: "18px", color: "#ffffff", margin: 0 }}>
              Experience the world differently. Curated trips for the modern explorer — from hidden gems in Tokyo to sunset safaris in Kenya.
            </p>

            {/* CTA */}
            <div
              style={{
                border: "1px solid #272727",
                borderRadius: 8,
                padding: "8px 16px",
                width: "fit-content",
                height: 45,
                display: "flex",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: 13, lineHeight: "13px", fontWeight: 600, color: "#ffffff" }}>
                Book Your Journey
              </span>
            </div>

            {/* Footer */}
            <p style={{ fontSize: 9, lineHeight: "9px", color: "rgba(255,255,255,0.5)", margin: 0, textAlign: "center" }}>
              Ad preview · 350 × 480
            </p>
          </div>
        </div>

        {/* Spacer */}
        <div style={{ height: 16, flexShrink: 0 }} />
      </div>

      {/* Bottom actions */}
      <div
        className="w-full flex flex-row gap-[10px] shrink-0"
        style={{ padding: "16px 20px 20px 20px" }}
      >
        <button
          onClick={onApprove}
          className="flex-1 flex items-center justify-center rounded-[10px] font-semibold"
          style={{ height: 51, background: "#701ed4", color: "#ffffff", fontSize: 15, border: "none", cursor: "pointer" }}
        >
          Approve
        </button>
      </div>
    </div>
  );
}
