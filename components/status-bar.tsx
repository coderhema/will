"use client";

interface StatusBarProps {
  text?: string;
}

export default function StatusBar({
  text = "Generating ad variations for your brand",
}: StatusBarProps) {
  return (
    <div
      className="w-full flex flex-row items-center justify-center gap-2 shrink-0"
      style={{
        height: 49,
        background: "linear-gradient(180deg, #0a0a0a 0%, #050505 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}
    >
      {/* Live green dot */}
      <span
        className="shrink-0 rounded-full"
        style={{ width: 6, height: 6, background: "#2eff89" }}
      />
      <span
        style={{
          fontSize: 11,
          lineHeight: "11px",
          color: "#ffffff",
          fontWeight: 400,
          whiteSpace: "nowrap",
        }}
      >
        {text}
      </span>
    </div>
  );
}
