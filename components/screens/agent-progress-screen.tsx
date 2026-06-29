"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, ShareNetwork, CircleNotch } from "@phosphor-icons/react";
import WillLogo from "@/components/will-logo";

type StepStatus = "done" | "active" | "queued" | "pending";

interface Step {
  title: string;
  desc: string;
  metric: string;
  status: StepStatus;
  logs: string[];
}

const INITIAL_STEPS: Step[] = [
  {
    title: "Research Complete",
    desc: "Analyzed your brand, industry, and top competitors. Identified target audience segments.",
    metric: "12 sources",
    status: "done",
    logs: [],
  },
  {
    title: "Content Strategy",
    desc: "Built content framework with 3 core messages, tone guidelines, and distribution channels.",
    metric: "6 pillars",
    status: "done",
    logs: [],
  },
  {
    title: "Ad Copy Generation",
    desc: "Creating ad variations with AI-powered copywriting for your campaigns.",
    metric: "3 / 5 done",
    status: "active",
    logs: [
      "Drafting headline variants...",
      "Generating CTA options...",
      "Applying tone guidelines...",
      "Scoring copy variations...",
      "Selecting top performers...",
    ],
  },
  {
    title: "Visual Design",
    desc: "Designing visual assets — hero images, icons, and layout compositions.",
    metric: "Queued",
    status: "queued",
    logs: [],
  },
  {
    title: "Review & Polish",
    desc: "Final quality check, alignment adjustments, and export preparation.",
    metric: "Pending",
    status: "pending",
    logs: [],
  },
];

function DoneCircle() {
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{ width: 18, height: 18, background: "#502eb0" }}
    >
      <Check size={10} color="#ffffff" weight="bold" />
    </div>
  );
}

function ActiveCircle({ pulse }: { pulse: boolean }) {
  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: 22, height: 22 }}>
      {/* Pulse ring */}
      {pulse && (
        <span
          className="absolute rounded-full"
          style={{
            width: 22,
            height: 22,
            border: "1.5px solid rgba(189,169,245,0.5)",
            animation: "will-pulse-ring 1.4s ease-out infinite",
          }}
        />
      )}
      <div
        className="flex items-center justify-center rounded-full"
        style={{ width: 18, height: 18, background: "#1a1a1a", border: "2px solid #9e6cf0", position: "relative", zIndex: 1 }}
      >
        <span className="rounded-full" style={{ width: 7, height: 7, background: "#bda9f5", display: "block" }} />
      </div>
    </div>
  );
}

function InactiveCircle() {
  return (
    <div
      className="rounded-full shrink-0"
      style={{ width: 18, height: 18, background: "#161616", border: "1.5px solid rgba(255,255,255,0.1)" }}
    />
  );
}

function StepConnector({ fromStatus }: { fromStatus: StepStatus }) {
  const filled = fromStatus === "done";
  return (
    <div
      style={{
        width: 2,
        height: 50,
        marginLeft: 1,
        background: filled ? "#9e6cf0" : "rgba(255,255,255,0.07)",
        flexShrink: 0,
        borderRadius: 1,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Shimmer on done connectors */}
      {filled && (
        <span
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
            animation: "will-connector-shimmer 2s ease-in-out infinite",
          }}
        />
      )}
    </div>
  );
}

interface AgentProgressScreenProps {
  task: string;
  detail: string;
  onViewResults: () => void;
}

export default function AgentProgressScreen({ task, detail, onViewResults }: AgentProgressScreenProps) {
  const [visibleLogs, setVisibleLogs] = useState(0);
  const [progressPct, setProgressPct] = useState(58);
  const logEndRef = useRef<HTMLDivElement>(null);

  const activeStep = INITIAL_STEPS.find((s) => s.status === "active")!;
  const doneCt = INITIAL_STEPS.filter((s) => s.status === "done").length;

  // Stream log lines one by one
  useEffect(() => {
    if (visibleLogs >= activeStep.logs.length) return;
    const t = setTimeout(() => setVisibleLogs((v) => v + 1), 800);
    return () => clearTimeout(t);
  }, [visibleLogs, activeStep.logs.length]);

  // Slowly tick progress up
  useEffect(() => {
    const t = setInterval(() => {
      setProgressPct((p) => Math.min(p + 0.4, 82));
    }, 300);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll log to bottom
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleLogs]);

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden">
      {/* Status bar */}
      <div
        className="w-full shrink-0 flex flex-row gap-2 items-center justify-center"
        style={{ height: 44, background: "#080808", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <span
          className="rounded-full"
          style={{
            width: 6,
            height: 6,
            background: "#2eff89",
            display: "block",
            flexShrink: 0,
            boxShadow: "0 0 6px #2eff89",
            animation: "will-dot-blink 2s ease-in-out infinite",
          }}
        />
        <span style={{ fontSize: 11, color: "#ffffff", fontWeight: 400, letterSpacing: 0.2 }}>
          Generating {detail || "ad variations"} for your brand
        </span>
      </div>

      {/* Header */}
      <div
        className="w-full shrink-0 flex flex-row items-center justify-between"
        style={{ height: 56, padding: "0 16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <button style={{ background: "none", border: "none", padding: 0, cursor: "pointer", display: "flex" }}>
          <ArrowLeft size={20} color="#ffffff" weight="bold" />
        </button>
        <span style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 500, letterSpacing: 0.3 }}>
          Agent Activity Log
        </span>
        <div style={{ width: 20 }} />
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto" style={{ padding: "0 20px 0 20px" }}>

        {/* Logo + label */}
        <div className="flex flex-col items-center" style={{ paddingTop: 20, paddingBottom: 16 }}>
          <WillLogo variant="building" label="BUILDING" />
        </div>

        {/* Stats row */}
        <div className="flex flex-row gap-2 w-full" style={{ marginBottom: 20 }}>
          {[
            { value: String(doneCt), label: "Tasks Done", color: "#2eff89" },
            { value: "1", label: "In Progress", color: "#bda9f5" },
            { value: "~4 min", label: "Est. Remaining", color: "rgba(255,255,255,0.35)" },
          ].map(({ value, label, color }) => (
            <div
              key={label}
              className="flex-1 flex flex-col items-center gap-1 rounded-xl"
              style={{ padding: "10px 6px", background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span style={{ fontSize: 19, fontWeight: 700, color, lineHeight: 1 }}>{value}</span>
              <span style={{ fontSize: 9, fontWeight: 500, color: "rgba(255,255,255,0.3)", letterSpacing: 0.5, textTransform: "uppercase" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Overall progress bar */}
        <div
          className="w-full rounded-full overflow-hidden"
          style={{ height: 3, background: "rgba(255,255,255,0.07)", marginBottom: 24 }}
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${progressPct}%`,
              background: "linear-gradient(90deg, #502eb0, #9e6cf0)",
              transition: "width 0.3s linear",
              boxShadow: "0 0 8px rgba(158,108,240,0.6)",
            }}
          />
        </div>

        {/* Steps */}
        <div className="flex flex-col w-full">
          {INITIAL_STEPS.map((step, i) => {
            const isLast = i === INITIAL_STEPS.length - 1;
            const isActive = step.status === "active";

            return (
              <div key={step.title} className="flex flex-row gap-3 w-full">
                {/* Timeline */}
                <div className="flex flex-col items-center shrink-0" style={{ width: 20, paddingTop: 2 }}>
                  {step.status === "done"   && <DoneCircle />}
                  {isActive                 && <ActiveCircle pulse />}
                  {(step.status === "queued" || step.status === "pending") && <InactiveCircle />}
                  {!isLast && <StepConnector fromStatus={step.status} />}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col" style={{ paddingBottom: 20 }}>
                  {/* Title row */}
                  <div className="flex flex-row items-center justify-between w-full" style={{ marginBottom: 4 }}>
                    <span
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: 0.2,
                        color: isActive ? "#ffffff" :
                          step.status === "done" ? "rgba(255,255,255,0.8)" :
                          "rgba(255,255,255,0.25)",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {isActive && (
                        <CircleNotch
                          size={12}
                          color="#9e6cf0"
                          weight="bold"
                          style={{ animation: "will-spin 1s linear infinite", flexShrink: 0 }}
                        />
                      )}
                      {step.title}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 500,
                        color: isActive ? "#bda9f5" :
                          step.status === "done" ? "rgba(255,255,255,0.5)" :
                          "rgba(255,255,255,0.2)",
                        letterSpacing: 0.3,
                      }}
                    >
                      {step.metric}
                    </span>
                  </div>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: 11,
                      lineHeight: "16px",
                      color: isActive ? "rgba(189,169,245,0.75)" :
                        step.status === "done" ? "rgba(255,255,255,0.4)" :
                        "rgba(255,255,255,0.18)",
                      margin: 0,
                      marginBottom: isActive ? 10 : 0,
                    }}
                  >
                    {step.desc}
                  </p>

                  {/* Streaming log lines for active step */}
                  {isActive && (
                    <div
                      className="flex flex-col gap-1 rounded-xl overflow-hidden"
                      style={{
                        background: "#0a0a0a",
                        border: "1px solid rgba(255,255,255,0.06)",
                        padding: "10px 12px",
                      }}
                    >
                      {step.logs.slice(0, visibleLogs).map((line, li) => (
                        <div
                          key={li}
                          className="flex flex-row items-center gap-2"
                          style={{
                            animation: "will-log-in 0.3s cubic-bezier(0.34,1.2,0.64,1) both",
                          }}
                        >
                          <span
                            className="rounded-full shrink-0"
                            style={{
                              width: 5,
                              height: 5,
                              background: li === visibleLogs - 1 ? "#9e6cf0" : "rgba(255,255,255,0.2)",
                              display: "block",
                            }}
                          />
                          <span
                            style={{
                              fontSize: 11,
                              color: li === visibleLogs - 1 ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)",
                              fontFamily: "monospace",
                              letterSpacing: 0.2,
                            }}
                          >
                            {line}
                          </span>
                        </div>
                      ))}
                      {/* Blinking cursor */}
                      {visibleLogs < step.logs.length && (
                        <div className="flex flex-row items-center gap-2">
                          <span
                            className="rounded-full shrink-0"
                            style={{ width: 5, height: 5, background: "#9e6cf0", display: "block", animation: "will-dot-blink 1s ease-in-out infinite" }}
                          />
                          <span style={{ fontSize: 11, color: "rgba(158,108,240,0.6)", fontFamily: "monospace" }}>
                            &nbsp;
                          </span>
                        </div>
                      )}
                      <div ref={logEndRef} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom actions */}
      <div
        className="w-full flex flex-row gap-2 shrink-0"
        style={{ padding: "12px 20px 24px 20px", background: "#000", borderTop: "1px solid rgba(255,255,255,0.05)" }}
      >
        <button
          onClick={onViewResults}
          className="flex-1 flex flex-row items-center justify-center gap-2 rounded-xl font-semibold"
          style={{ height: 50, background: "#ffffff", color: "#000000", fontSize: 15, border: "none", cursor: "pointer" }}
        >
          View Results
          <ArrowRight size={16} color="#000000" weight="bold" />
        </button>
        <button
          className="flex items-center justify-center rounded-xl shrink-0"
          style={{ width: 50, height: 50, background: "#0d0d0d", border: "1px solid rgba(255,255,255,0.08)", cursor: "pointer" }}
        >
          <ShareNetwork size={17} color="rgba(255,255,255,0.6)" weight="bold" />
        </button>
      </div>
    </div>
  );
}
