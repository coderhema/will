"use client";

/**
 * WILL logo mark — five variants:
 *   "splash"   → 68×31.73px ring, white dots (7.556px), label 24px
 *   "home"     → 45×21px ring amber, amber dots (5px), label 11px
 *   "thinking" → 45×21px ring amber, + symbols inside, label 11px
 *   "building" → 45×21px ring green #29e671, chevron < > symbols, label 11px
 *   "ready"    → 45×21px ring #db9d46, amber dots (5px), label 11px
 */
type LogoVariant = "splash" | "home" | "thinking" | "building" | "ready";

interface WillLogoProps {
  variant?: LogoVariant;
  label?: string;
  className?: string;
}

// The full-size ring path (68×31.733) — used for splash
const RING_LARGE =
  "M15.86667 0c-2.10405 0-4.12802.40259-6.07191 1.20778-1.94389.80519-3.65973 1.95167-5.14752 3.43946-1.48779 1.48779-2.63428 3.20363-3.43946 5.14752-.80519 1.94389-1.20778 3.96786-1.20778 6.07191 0 2.10405.40259 4.12802 1.20778 6.07191.80519 1.94389 1.95167 3.65973 3.43946 5.14751 1.48779 1.48779 3.20363 2.63427 5.14752 3.43946 1.94389.80519 3.96786 1.20778 6.07191 1.20778l36.26666 0c2.10405 0 4.12802-.4026 6.07191-1.20778 1.94389-.80519 3.65973-1.95167 5.14752-3.43946 1.48779-1.48779 2.63428-3.20363 3.43946-5.14751.80518-1.94389 1.20778-3.96786 1.20778-6.07191 0-2.10405-.4026-4.12802-1.20778-6.07191-.80518-1.94389-1.95167-3.65973-3.43946-5.14752-1.48779-1.48779-3.20363-2.63428-5.14752-3.43946-1.94389-.80519-3.96786-1.20778-6.07191-1.20778l-36.26666 0zm-10.15877 26.02543c-2.80527-2.80527-4.2079-6.19152-4.2079-10.15876 0-3.96725 1.40263-7.3535 4.2079-10.15877 2.80527-2.80527 6.19152-4.2079 10.15877-4.2079l36.26666 0c3.96724 0 7.3535 1.40263 10.15877 4.2079 2.80527 2.80527 4.2079 6.19153 4.2079 10.15877 0 3.96724-1.40263 7.3535-4.2079 10.15876-2.80527 2.80527-6.19152 4.2079-10.15877 4.2079l-36.26666 0c-3.96724 0-7.3535-1.40263-10.15877-4.2079z";

// The small ring path (45×21) — used for all other variants
const RING_SMALL =
  "M10.5 0c-1.39239 0-2.73178.26642-4.01818.79926-1.2864.53284-2.42188 1.29155-3.40644 2.27612-.98457.98457-1.74327 2.12005-2.27612 3.40644-.53284 1.2864-.79926 2.62579-.79926 4.01818 0 1.39239.26642 2.73178.79926 4.01817.53284 1.2864 1.29155 2.42188 2.27612 3.40645.98457.98456 2.12005 1.74327 3.40644 2.27611 1.2864.53285 2.62579.79927 4.01818.79927l24 0c1.39238 0 2.73177-.26642 4.01817-.79927 1.2864-.53284 2.42188-1.29155 3.40645-2.27611.98457-.98457 1.74327-2.12005 2.27611-3.40645.53284-1.2864.79927-2.62579.79927-4.01817 0-1.39239-.26643-2.73178-.79927-4.01818-.53284-1.2864-1.29154-2.42188-2.27611-3.40644-.98457-.98457-2.12005-1.74327-3.40645-2.27612-1.2864-.53284-2.62579-.79926-4.01817-.79926l-24 0zm-6.36396 16.86396c-1.75736-1.75736-2.63604-3.87868-2.63604-6.36396 0-2.48528.87868-4.6066 2.63604-6.36396 1.75736-1.75736 3.87868-2.63604 6.36396-2.63604l24 0c2.48528 0 4.6066.87868 6.36396 2.63604 1.75736 1.75736 2.63604 3.87868 2.63604 6.36396 0 2.48528-.87868 4.6066-2.63604 6.36396-1.75736 1.75736-3.87868 2.63604-6.36396 2.63604l-24 0c-2.48528 0-4.6066-.87868-6.36396-2.63604z";

// Circle dot path (5px radius=2.5)
const DOT_PATH =
  "M5 2.5c0 .69036-.24408 1.27961-.73223 1.76777-.48816.48816-1.07741.73223-1.76777.73223-.69036 0-1.27961-.24408-1.76777-.73223-.48816-.48816-.73223-1.07741-.73223-1.76777 0-.69036.24408-1.27961.73223-1.76777.48816-.48816 1.07741-.73223 1.76777-.73223.69036 0 1.27961.24408 1.76777.73223.48816.48816.73223 1.07741.73223 1.76777z";

// Circle dot path (7.556px, radius=3.778) — large for splash
const DOT_PATH_LG =
  "M7.55556 3.77778c0 1.0432-.36883 1.93363-1.10649 2.67129-.73766.73766-1.62809 1.10649-2.67129 1.10649-1.0432 0-1.93364-.36883-2.67129-1.10649-.73766-.73766-1.10649-1.62809-1.10649-2.67129 0-1.0432.36883-1.93364 1.10649-2.67129.73766-.73766 1.62809-1.10649 2.67129-1.10649 1.0432 0 1.93363.36883 2.67129 1.10649.73766.73766 1.10649 1.62809 1.10649 2.67129z";

// Plus/cross SVG paths (for THINKING variant)
const PLUS_LEFT =
  "M2.9248.00004c.33292-.00284.50082.16213.50391.49511l.01758 1.93848 2.05371 0c.33333 0 .5.16667.5.5-.00015.33303-.16682.5-.5.5l-2.04492 0 .01855 2.06152c.003.33326-.16191.50183-.49511.50489-.33332.003-.50188-.16277-.50489-.4961l-.01855-2.07031-1.95508 0c-.33302-.00008-.49985-.16705-.5-.5 0-.33325.16683-.49992.5-.5l1.94629 0-.01758-1.92969c-.00284-.33301.16293-.50091.49609-.5039z";
const PLUS_RIGHT =
  "M2.95117 0c.33333 0 .5.16667.5.5l0 1.93359 2.04883 0c.33333 0 .5.16667.5.5-.00008.33317-.16675.5-.5.5l-2.04883 0 0 2.06641c0 .33333-.16667.5-.5.5-.33333 0-.5-.16667-.5-.5l0-2.06641-1.95117 0c-.33309-.00008-.49992-.16691-.5-.5 0-.33325.16683-.49992.5-.5l1.95117 0 0-1.93359c0-.33333.16667-.5.5-.5z";

// Chevron < > SVG paths (for BUILDING variant — green)
const CHEVRON_LEFT =
  "M.0916.27414c.16663-.28851.39406-.34914.68262-.18262l3.46484 2c.19592.11323.28365.25432.26953.42383.04466.19543-.03998.35756-.25683.48633l-3.43946 2.04199c-.28661.17017-.51538.11179-.68554-.17481-.17017-.28662-.11182-.51538.1748-.68554l2.74121-1.62793-2.76855-1.59766c-.2886-.16666-.34927-.39495-.18262-.68359z";
const CHEVRON_RIGHT =
  "M3.76701.0879c.29052-.16312.51744-.09914.68067.1914.16315.29054.09916.51743-.19141.68067l-2.78027 1.56055 2.73047 1.66503c.28449.17352.33952.40294.16601.6875-.17342.28427-.40221.34012-.68652.167l-3.41602-2.08301c-.19289-.11773-.27859-.26087-.26074-.42969-.04002-.1965.05057-.35691.27051-.48047l3.4873-1.95898z";

export default function WillLogo({ variant = "home", label, className = "" }: WillLogoProps) {
  if (variant === "splash") {
    // Large 68×31.733px ring, white, white dots 7.556px
    const displayLabel = label ?? "WILL";
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <div style={{ width: 68, height: 31.733, position: "relative", flexShrink: 0 }}>
          {/* Right dot (z:0) */}
          <svg viewBox="0 0 7.556 7.556" xmlns="http://www.w3.org/2000/svg"
            style={{ position: "absolute", left: 46.844, top: 12.089, width: 7.556, height: 7.556 }}>
            <path d={DOT_PATH_LG} fill="#ffffff" />
          </svg>
          {/* Ring (z:1) */}
          <svg viewBox="0 0 68 31.733" xmlns="http://www.w3.org/2000/svg"
            style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
            <path d={RING_LARGE} fill="#ffffff" fillRule="evenodd" />
          </svg>
          {/* Left dot (z:2) */}
          <svg viewBox="0 0 7.556 7.556" xmlns="http://www.w3.org/2000/svg"
            style={{ position: "absolute", left: 13.6, top: 12.089, width: 7.556, height: 7.556 }}>
            <path d={DOT_PATH_LG} fill="#ffffff" />
          </svg>
        </div>
        <span style={{ color: "#ffffff", fontSize: 24, fontWeight: 500, letterSpacing: "3.85px", lineHeight: 1, whiteSpace: "nowrap" }}>
          {displayLabel}
        </span>
      </div>
    );
  }

  // Shared small logo layout
  const ringColor =
    variant === "building" ? "#29e671" :
    variant === "ready"    ? "#db9d46" :
    "#e0a046";

  const dotColor =
    variant === "building" ? "#29e671" :
    variant === "ready"    ? "#de9e45" :
    "#e0a046";

  const labelColor = "rgba(255,255,255,0.278)";
  const displayLabel = label ?? (variant === "thinking" ? "THINKING" : variant === "building" ? "BUILDING" : variant === "ready" ? "READY" : "READY");

  return (
    <div className={`flex flex-col items-center gap-[2px] ${className}`}>
      <div style={{ width: 45, height: 21, position: "relative", flexShrink: 0 }}>
        {/* Ring (z:0) */}
        <svg viewBox="0 0 45 21" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
          style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
          <path d={RING_SMALL} fill={ringColor} fillRule="evenodd" />
        </svg>

        {/* Inner symbols */}
        {variant === "thinking" ? (
          <>
            {/* Left + */}
            <svg viewBox="0 0 6 6.0001" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
              style={{ position: "absolute", left: 8.58, top: 7.565, width: 6, height: 6 }}>
              <path d={PLUS_RIGHT} fill="#ffffff" />
            </svg>
            {/* Right + */}
            <svg viewBox="0 0 6 6.0001" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
              style={{ position: "absolute", left: 30.523, top: 7.549, width: 6, height: 6 }}>
              <path d={PLUS_LEFT} fill="#ffffff" />
            </svg>
          </>
        ) : variant === "building" ? (
          <>
            {/* Left chevron < */}
            <svg viewBox="0 0 4.52 5.139" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
              style={{ position: "absolute", left: 9.174, top: 8.204, width: 4.52, height: 5.139 }}>
              <path d={CHEVRON_LEFT} fill={ringColor} />
            </svg>
            {/* Right chevron > */}
            <svg viewBox="0 0 4.536 5.138" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
              style={{ position: "absolute", left: 31.156, top: 8.157, width: 4.536, height: 5.138 }}>
              <path d={CHEVRON_RIGHT} fill={ringColor} />
            </svg>
          </>
        ) : (
          <>
            {/* Left dot */}
            <svg viewBox="0 0 5 5" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
              style={{ position: "absolute", left: 9, top: 8, width: 5, height: 5 }}>
              <path d={DOT_PATH} fill={dotColor} />
            </svg>
            {/* Right dot */}
            <svg viewBox="0 0 5 5" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"
              style={{ position: "absolute", left: 31, top: 8, width: 5, height: 5 }}>
              <path d={DOT_PATH} fill={dotColor} />
            </svg>
          </>
        )}
      </div>
      <span style={{ color: labelColor, fontSize: 11, fontWeight: 500, letterSpacing: "3.85px", lineHeight: 1, whiteSpace: "nowrap", textAlign: "center" }}>
        {displayLabel}
      </span>
    </div>
  );
}
