"use client";

import StatusBar from "@/components/status-bar";
import WillLogo from "@/components/will-logo";

type StepStatus = "done" | "active" | "queued" | "pending";

interface Step {
  title: string;
  desc: string;
  metric: string;
  status: StepStatus;
}

interface AgentProgressScreenProps {
  task: string;
  detail: string;
  onViewResults: () => void;
}

const STEPS: Step[] = [
  { title: "Research Complete",   desc: "Analyzed your brand, industry, and top competitors. Identified target audience segments.", metric: "12 sources", status: "done" },
  { title: "Content Strategy",    desc: "Built content framework with 3 core messages, tone guidelines, and distribution channels.", metric: "6 pillars",  status: "done" },
  { title: "Ad Copy Generation",  desc: "Creating ad variations with AI-powered copywriting for your campaigns.", metric: "3 / 5 done", status: "active" },
  { title: "Visual Design",       desc: "Designing visual assets — hero images, icons, and layout compositions.", metric: "Queued",     status: "queued" },
  { title: "Review & Polish",     desc: "Final quality check, alignment adjustments, and export preparation.", metric: "Pending",    status: "pending" },
];

function StepCircle({ status }: { status: StepStatus }) {
  if (status === "done") {
    return (
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 16, height: 16, background: "#502eb0" }}
      >
        <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ width: 9, height: 9 }}>
          <path
            d="M11.48 2.953q-.071.014-.13.058-.054.041-3.076 3.066l-3.025 3.008-1.289-1.289q-1.289-1.285-1.38-1.326-.089-.044-.222-.044-.133 0-.232.038-.096.034-.188.113-.089.075-.133.171-.027.072-.034.113-.007.041-.007.14v.041q-.014.113.041.198.072.11.366.403.195.212.967.981l1.497 1.483q.28.267.39.338.072.055.185.041l.096.014q.071 0 .14-.027.085-.072.321-.287.239-.219.8-.762l2.283-2.283q2.085-2.099 2.7-2.714.615-.619.646-.687.041-.085.041-.239 0-.099-.007-.14-.007-.041-.034-.113-.044-.082-.137-.164-.089-.085-.181-.12-.089-.037-.208-.037-.12 0-.188.027z"
            fill="#ffffff"
          />
        </svg>
      </div>
    );
  }
  if (status === "active") {
    return (
      <div
        className="flex items-center justify-center rounded-full shrink-0"
        style={{ width: 20, height: 20, background: "#252525", border: "2px solid rgba(96,165,250,0.6)" }}
      >
        <span className="rounded-full" style={{ width: 8, height: 8, background: "#bda9f5" }} />
      </div>
    );
  }
  return (
    <div
      className="rounded-full shrink-0"
      style={{ width: 16, height: 16, background: "#252525", border: "2px solid rgba(255,255,255,0.15)" }}
    />
  );
}

function StepLine({ status }: { status: StepStatus }) {
  const color =
    status === "done"   ? "#9e6cf0" :
    status === "active" ? "#38383b" :
    "rgba(255,255,255,0.08)";
  return <div style={{ width: 2, height: 60, background: color, flexShrink: 0 }} />;
}

export default function AgentProgressScreen({ task, detail, onViewResults }: AgentProgressScreenProps) {
  const doneCt  = STEPS.filter((s) => s.status === "done").length;
  const activeCt = STEPS.filter((s) => s.status === "active").length;

  return (
    <div className="w-full h-full flex flex-col bg-black overflow-hidden">
      {/* Status bar */}
      <StatusBar text="Generating ad variations for your brand" />

      {/* Header */}
      <div
        className="w-full flex flex-row items-center justify-between shrink-0"
        style={{ height: 68, padding: "0 16px", borderBottom: "1.5px solid #0a0a0a" }}
      >
        {/* Back arrow */}
        <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ width: 20, height: 20 }}>
          <path d="M6.9 2.352q-.096.014-.168.051-.068.034-2.177 2.136-2.105 2.099-2.146 2.167-.113.181-.072.407.027.096.068.174.044.075 2.157 2.177l1.682 1.678q.376.366.516.465.085.055.198.055h.041q.239 0 .42-.181.113-.113.147-.28.034-.167-.02-.321-.027-.085-.26-.321-.232-.239-1.364-1.374-1.582-1.582-1.582-1.596 0-.014 3.428-.014l3.011 0q.448 0 .53-.034.085-.038.167-.12.085-.085.133-.188.051-.106.051-.232 0-.126-.041-.239-.099-.195-.294-.294l-.085-.041-3.445 0q-3.456 0-3.456-.014 0-.014 1.582-1.596 1.132-1.135 1.364-1.371.232-.239.26-.325.068-.208-.003-.403-.068-.198-.243-.301-.174-.106-.4-.065z" fill="#ffffff" />
        </svg>
        <span style={{ fontSize: 14, lineHeight: "14px", color: "#2d2d2d", fontWeight: 500 }}>
          Agent Activity Log
        </span>
        <div style={{ width: 20 }} />
      </div>

      {/* Stepper container */}
      <div className="flex-1 overflow-y-auto flex flex-col" style={{ padding: "12px 20px 0 20px" }}>
        {/* Logo */}
        <div className="flex items-center justify-center mb-2">
          <WillLogo label="BUILDING" ringColor="#29e671" dotColor="#29e671" />
        </div>

        {/* Stats row */}
        <div className="flex flex-row gap-[10px] w-full shrink-0" style={{ padding: "20px 0 0 0" }}>
          {[
            { value: doneCt.toString(), label: "Tasks Done",     color: "#2eff89" },
            { value: activeCt.toString(), label: "In Progress",  color: "#bda9f5" },
            { value: "~4 min",  label: "Est. Remaining",         color: "#68686a" },
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
        <div className="flex flex-col w-full mt-2">
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
              <div key={step.title} className="flex flex-row gap-[14px] w-full" style={{ paddingTop: i === 0 ? 14 : 0 }}>
                {/* Left timeline */}
                <div className="flex flex-col items-center shrink-0" style={{ width: 24 }}>
                  <StepCircle status={step.status} />
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
        style={{ padding: "12px 20px 20px 20px", background: "#000" }}
      >
        <button
          onClick={onViewResults}
          className="flex-1 flex flex-row items-center justify-center gap-[6px] rounded-[10px] font-semibold"
          style={{ height: 51, background: "#ffffff", color: "#000", fontSize: 15 }}
        >
          View Results
          <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ width: 17, height: 17 }}>
            <path d="M6.9 2.352q-.181.027-.321.167-.113.113-.147.28-.034.167.02.321.027.085.26.325.232.236 1.364 1.371 1.582 1.582 1.582 1.596 0 .014-3.456.014l-3.445 0-.085.041q-.222.113-.301.338-.075.222.007.434.058.096.14.181.085.082.167.12.085.034.533.034l3.011 0q3.428 0 3.428.014 0 .014-1.582 1.596-1.132 1.135-1.364 1.374-.232.236-.26.321-.055.154-.02.321.034.167.147.28.181.181.42.181h.041q.113 0 .198-.055.14-.099.516-.465l1.682-1.678q2.112-2.102 2.153-2.184.072-.126.072-.28 0-.154-.072-.28-.041-.082-2.15-2.181-2.105-2.102-2.177-2.136-.068-.038-.236-.065-.041 0-.126.014z" fill="#000" />
          </svg>
        </button>
        <button
          className="flex items-center justify-center rounded-[10px]"
          style={{ width: 50, height: 50, background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.10)" }}
        >
          <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ width: 17, height: 17 }}>
            <path d="M9.625 8.75q-.93 0-1.586.656L5.523 7.766q.328-.766 0-1.586l2.516-1.586q.547.547 1.34.629.793.082 1.449-.355.656-.438.875-1.176.219-.738-.055-1.449-.273-.711-.984-1.094-.711-.383-1.477-.246-.766.137-1.258.766-.492.629-.492 1.395 0 .383.164.766L5.086 6.246q-.492-.492-1.148-.629-.656-.137-1.258.137-.601.273-.984.82-.383.547-.383 1.203 0 .656.383 1.203.383.547.984.82.601.273 1.258.137.656-.137 1.148-.629l2.516 1.586q-.164.437-.164.82 0 .93.629 1.559.629.629 1.559.629.93 0 1.559-.629.629-.629.629-1.559 0-.93-.629-1.559-.629-.629-1.559-.629zm0-7q.547 0 .93.383.383.383.383.93 0 .547-.383.93-.383.383-.93.383-.547 0-.93-.383-.383-.383-.383-.93 0-.547.383-.93.383-.383.93-.383zM3.5 13.313q-.547 0-.93-.383-.383-.383-.383-.93 0-.547.383-.93.383-.383.93-.383.547 0 .93.383.383.383.383.93 0 .547-.383.93-.383.383-.93.383zm6.125-3.938q-.547 0-.93-.383-.383-.383-.383-.93 0-.547.383-.93.383-.383.93-.383.547 0 .93.383.383.383.383.93 0 .547-.383.93-.383.383-.93.383z" fill="#fff" />
          </svg>
        </button>
      </div>
    </div>
  );
}
