"use client";

interface WillLogoProps {
  label?: string;
  labelColor?: string;
  ringColor?: string;
  dotColor?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * The WILL / Forge AI capsule logo with two dots inside an oval ring.
 * ringColor / dotColor default to the amber accent (#e0a046).
 */
export default function WillLogo({
  label = "READY",
  labelColor = "rgba(255,255,255,0.28)",
  ringColor = "#e0a046",
  dotColor = "#e0a046",
  size = "sm",
  className = "",
}: WillLogoProps) {
  const scale = size === "lg" ? 1.51 : size === "md" ? 1.0 : 0.667;
  const logoW = 68 * scale;
  const logoH = 31.73 * scale;

  return (
    <div className={`flex flex-col items-center gap-[2px] ${className}`}>
      {/* Logo mark */}
      <div
        style={{ width: logoW, height: logoH, position: "relative", flexShrink: 0 }}
      >
        {/* Outer ring */}
        <svg
          viewBox="0 0 68 31.733"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
        >
          <path
            d="M15.867 0c-2.104 0-4.128.403-6.072 1.208C7.85 2.013 6.134 3.16 4.646 4.647 3.158 6.136 2.012 7.851 1.207 9.795.402 11.739 0 13.763 0 15.867c0 2.104.402 4.128 1.207 6.072.805 1.944 1.952 3.66 3.439 5.147 1.488 1.488 3.204 2.634 5.148 3.439C11.739 31.33 13.763 31.733 15.867 31.733h36.266c2.104 0 4.128-.403 6.072-1.208 1.944-.805 3.66-1.951 5.148-3.44 1.488-1.487 2.634-3.202 3.439-5.146C67.597 19.995 68 17.97 68 15.867c0-2.104-.403-4.128-1.208-6.072-.805-1.944-1.951-3.66-3.44-5.148C61.865 3.16 60.15 2.013 58.205 1.208 56.261.403 54.237 0 52.133 0H15.867zM5.708 26.025C2.903 23.22 1.5 19.834 1.5 15.867c0-3.967 1.403-7.354 4.208-10.159S11.9 1.5 15.867 1.5h36.266c3.967 0 7.354 1.403 10.159 4.208s4.208 6.192 4.208 10.159c0 3.967-1.403 7.354-4.208 10.158-2.805 2.805-6.192 4.208-10.159 4.208H15.867c-3.967 0-7.354-1.403-10.159-4.208z"
            fill={ringColor}
            fillRule="evenodd"
          />
        </svg>
        {/* Left dot */}
        <svg
          viewBox="0 0 7.556 7.556"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            left: `${13.6 * scale}px`,
            top: `${12.09 * scale}px`,
            width: `${7.556 * scale}px`,
            height: `${7.556 * scale}px`,
          }}
        >
          <circle cx="3.778" cy="3.778" r="3.778" fill={dotColor} />
        </svg>
        {/* Right dot */}
        <svg
          viewBox="0 0 7.556 7.556"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            position: "absolute",
            left: `${46.844 * scale}px`,
            top: `${12.09 * scale}px`,
            width: `${7.556 * scale}px`,
            height: `${7.556 * scale}px`,
          }}
        >
          <circle cx="3.778" cy="3.778" r="3.778" fill={dotColor} />
        </svg>
      </div>
      {/* Label */}
      <span
        style={{
          color: labelColor,
          fontSize: size === "lg" ? 24 : size === "md" ? 11 : 11,
          fontWeight: size === "lg" ? 500 : 500,
          letterSpacing: size === "lg" ? "3.85px" : "3.85px",
          lineHeight: 1,
          whiteSpace: "nowrap",
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
}
