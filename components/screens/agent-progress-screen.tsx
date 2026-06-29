"use client";

import { ArrowLeft, ArrowRight, Check, ShareNetwork } from "@phosphor-icons/react";
import WillLogo from "@/components/will-logo";

type StepStatus = "done" | "active" | "queued" | "pending";

interface Step {
  title: string;
  desc: string;
  metric: string;
  status: StepStatus;
}

const STEPS: Step[] = [
  {
    title: "Research Complete",
    desc: "Analyzed your brand, industry, and top competitors. Identified target audience segments.",
    metric: "12 sources",
    status: "done",
  },
  {
    title: "Content Strategy",
    desc: "Built content framework with 3 core messages, tone guidelines, and distribution channels.",
    metric: "6 pillars",
    status: "done",
  },
  {
    title: "Ad Copy Generation",
    desc: "Creating ad variations with AI-powered copywriting for your campaigns.",
    metric: "3 / 5 done",
    status: "active",
  },
  {
    title: "Visual Design",
    desc: "Designing visual assets — hero images, icons, and layout compositions.",
    metric: "Queued",
    status: "queued",
  },
  {
    title: "Review & Polish",
    desc: "Final quality check, alignment adjustments, and export preparation.",
    metric: "Pending",
    status: "pending",
  },
];

// Done circle — purple filled with check
function DoneCircle() {
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{ width: 16, height: 16, background: "#502eb0" }}
    >
      <Check size={10} color="#ffffff" weight="bold" />
    </div>
  );
}

// Active circle — dark bg with blue border, purple dot
function ActiveCircle() {
  return (
    <div
      className="flex items-center justify-center rounded-full shrink-0"
      style={{ width: 20, height: 20, background: "#252525", border: "2px solid rgba(96,165,250,0.6)" }}
    >
      <span
        className="rounded-full"
        style={{ width: 8, height: 8, background: "#bda9f5", display: "block" }}
      />
    </div>
  );
}

// Inactive circle — dark bg with subtle border
function InactiveCircle() {
  return (
    <div
      className="rounded-full shrink-0"
      style={{ width: 16, height: 16, background: "#252525", border: "2px solid rgba(255,255,255,0.15)" }}
    />
  );
}

// Connector line between steps
function StepLine({ status }: { status: StepStatus }) {
  const bg =
    status === "done"   ? "#9e6cf0" :
    status === "active" ? "#38383b" :
    "rgba(255,255,255,0.08)";
  return (
    <div style={{ width: 2, height: 60, background: bg, flexShrink: 0, marginTop: 2 }} />
  );
}

interface AgentProgressScreenProps {
  task: string;
  detail: string;
  onViewResults: () => void;
}

export default function AgentProgressScreen({ task, detail, onViewResults }: AgentProgressScreenProps) {
  const doneCt   = STEPS.filter((s) => s.status === "done").length;
  const activeCt = STEPS.filter((s) => s.status === "active").length;

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden">
      {/* Status bar */}
      <div
        className="w-full shrink-0 flex flex-row gap-2 items-center justify-center"
        style={{ height: 49, background: "#0a0a0a" }}
      >
        <div
          style={{ width: 6, height: 6, background: "#2eff89", borderRadius: 3, flexShrink: 0 }}
        />
        <span style={{ fontSize: 11, lineHeight: "11px", color: "#ffffff", fontWeight: 400, whiteSpace: "nowrap" }}>
          Generating ad variations for your brand
        </span>
      </div>

      {/* Header */}
      <div
        className="w-full shrink-0 flex flex-row items-center justify-between"
        style={{ height: 68, padding: "0 16px", borderBottom: "1.5px solid #0a0a0a" }}
      >
        <ArrowLeft size={20} color="#ffffff" weight="bold" />
        <span style={{ fontSize: 14, lineHeight: "14px", color: "#2d2d2d", fontWeight: 500 }}>
          Agent Activity Log
        </span>
        <div style={{ width: 20 }} />
      </div>

      {/* Stepper container — scrollable */}
      <div
        className="flex-1 overflow-y-auto flex flex-col items-center"
        style={{ padding: "12px 20px 0 20px" }}
      >
        {/* Green BUILDING logo with chevrons */}
        <WillLogo variant="building" label="BUILDING" />

        {/* Stats row */}
        <div
          className="flex flex-row gap-[10px] w-full shrink-0"
          style={{ padding: "20px 20px 0 20px", marginTop: 0 }}
        >
          {[
            { value: String(doneCt),   label: "Tasks Done",      color: "#2eff89" },
            { value: String(activeCt), label: "In Progress",     color: "#bda9f5" },
            { value: "~4 min",         label: "Est. Remaining",  color: "#68686a" },
          ].map(({ value, label, color }) => (
            <div
              key={label}
              className="flex-1 flex flex-col items-center gap-1 rounded-[10px]"
              style={{ padding: 10, background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <span style={{ fontSize: 18, lineHeight: "18px", fontWeight: 700, color }}>{value}</span>
              <span style={{ fontSize: 10, lineHeight: "10px", fontWeight: 500, color: "#727274" }}>{label}</span>
            </div>
          ))}
        </div>

        {/* Steps */}
        <div className="flex flex-col w-full" style={{ marginTop: 0 }}>
          {STEPS.map((step, i) => {
            const isLast = i === STEPS.length - 1;

            const titleColor =
              step.status === "done"   ? "#d9d9d9" :
              step.status === "active" ? "transparent" :
              "#68686a";

            const descColor =
              step.status === "done"   ? "#d9d9d9" :
              step.status === "active" ? "#bda9f5" :
              "#68686a";

            const metricColor =
              step.status === "done"   ? "#ffffff" :
              step.status === "active" ? "#bda9f5" :
              "#68686a";

            return (
              <div
                key={step.title}
                className="flex flex-row gap-[14px] w-full"
                style={{ paddingTop: i === 0 ? 14 : 0 }}
              >
                {/* Left timeline */}
                <div className="flex flex-col items-center shrink-0" style={{ width: 24 }}>
                  {step.status === "done"   && <DoneCircle />}
                  {step.status === "active" && <ActiveCircle />}
                  {(step.status === "queued" || step.status === "pending") && <InactiveCircle />}
                  {!isLast && <StepLine status={step.status} />}
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col gap-1 pb-3">
                  <div className="flex flex-row justify-between items-center w-full">
                    {step.status === "active" ? (
                      <span
                        style={{
                          fontSize: 14,
                          lineHeight: "14px",
                          fontWeight: 600,
                          letterSpacing: 0.5,
                          backgroundImage: "linear-gradient(0deg, rgba(255,255,255,0.50) 0%, #fff 30%, #240f7a 50%, #fff 70%, rgba(255,255,255,0.50) 100%)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                          backgroundClip: "text",
                          color: "transparent",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {step.title}
                      </span>
                    ) : (
                      <span style={{ fontSize: 14, lineHeight: "14px", fontWeight: 600, color: titleColor, whiteSpace: "nowrap" }}>
                        {step.title}
                      </span>
                    )}
                    <span style={{ fontSize: 10, lineHeight: "10px", fontWeight: 500, color: metricColor }}>
                      {step.metric}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, lineHeight: "15px", color: descColor, margin: 0 }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom actions */}
      <div
        className="w-full flex flex-row gap-[10px] shrink-0"
        style={{ padding: "12px 20px 20px 20px" }}
      >
        <button
          onClick={onViewResults}
          className="flex-1 flex flex-row items-center justify-center gap-[6px] rounded-[10px] font-semibold"
          style={{ height: 51, background: "#ffffff", color: "#000000", fontSize: 15, border: "none", cursor: "pointer" }}
        >
          View Results
          <ArrowRight size={17} color="#000000" weight="bold" />
        </button>
        {/* Share icon button */}
        <button
          className="flex items-center justify-center rounded-[10px] shrink-0"
          style={{ width: 50, height: 51, background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.10)", cursor: "pointer" }}
        >
          <ShareNetwork size={18} color="#ffffff" weight="bold" />
        </button>
      </div>
    </div>
  );
}
