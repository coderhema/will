"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import WillLogo from "@/components/will-logo";

const TASKS = [
  "Design",
  "Write",
  "Analyze",
  "Summarize",
  "Translate",
  "Research",
  "Code",
  "Plan",
  "Generate",
  "Edit",
];

const SUGGESTIONS: Record<string, string[]> = {
  Design: ["Ad copy", "Brand story", "Social ads", "Email blast"],
  Write:  ["Blog post", "Product copy", "Email blast", "Brand story"],
  Analyze:["Market data", "User research", "Competitor", "A/B test"],
  default:["Social ads", "Email blast", "Brand story", "Ad copy"],
};

const ITEM_HEIGHT = 70;
const VISIBLE_RANGE = 4;

interface SlotConfig {
  opacity: number;
  fontSize: number;
  blur: number;
  rotate: number;
}

function getSlotConfig(absDist: number): SlotConfig {
  const configs: SlotConfig[] = [
    { opacity: 1.0,  fontSize: 50, blur: 0,    rotate: 0  },
    { opacity: 0.72, fontSize: 49, blur: 0.75, rotate: 4  },
    { opacity: 0.45, fontSize: 48, blur: 2,    rotate: 9  },
    { opacity: 0.22, fontSize: 46, blur: 4,    rotate: 14 },
    { opacity: 0.09, fontSize: 44, blur: 7,    rotate: 19 },
  ];
  return configs[Math.min(absDist, configs.length - 1)];
}

interface HomeActionScreenProps {
  initialTask: string;
  onCancel: () => void;
  onStart: (task: string, detail: string) => void;
}

export default function HomeActionScreen({ initialTask, onCancel, onStart }: HomeActionScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(TASKS.indexOf(initialTask) >= 0 ? TASKS.indexOf(initialTask) : 0);
  const [isDragging, setIsDragging] = useState(false);
  const [inlineValue, setInlineValue] = useState("");
  const dragStartY = useRef(0);
  const dragStartIndex = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 5) setSelectedIndex((i) => (i + 1) % TASKS.length);
    else if (e.deltaY < -5) setSelectedIndex((i) => (i - 1 + TASKS.length) % TASKS.length);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartIndex.current = selectedIndex;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = dragStartY.current - e.clientY;
    const steps = Math.round(delta / (ITEM_HEIGHT * 0.6));
    setSelectedIndex((dragStartIndex.current + steps + TASKS.length * 10) % TASKS.length);
  };
  const onPointerUp = () => setIsDragging(false);

  const currentTask = TASKS[selectedIndex];
  const suggestions = SUGGESTIONS[currentTask] ?? SUGGESTIONS.default;

  const visibleItems = TASKS.map((task, index) => {
    let distance = index - selectedIndex;
    if (distance > TASKS.length / 2) distance -= TASKS.length;
    if (distance < -TASKS.length / 2) distance += TASKS.length;
    return { task, index, distance };
  }).filter(({ distance }) => Math.abs(distance) <= VISIBLE_RANGE);

  const handleSubmit = () => {
    onStart(currentTask, inlineValue || suggestions[0]);
  };

  return (
    <div className="w-full h-full flex flex-col items-center bg-black overflow-hidden" style={{ padding: "44px 0 48px" }}>
      {/* Header logo — THINKING state */}
      <WillLogo label="THINKING" />

      {/* Middle scroll section */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {visibleItems.map(({ task, distance }) => {
          const absDist = Math.abs(distance);
          const cfg = getSlotConfig(absDist);
          const isSelected = distance === 0;
          const sign = distance === 0 ? 0 : distance > 0 ? 1 : -1;
          const translateY = distance * ITEM_HEIGHT;

          return (
            <div
              key={task}
              className="absolute left-0 right-0 flex items-center select-none pointer-events-none"
              style={{
                top: "50%",
                transform: `translateY(calc(-50% + ${translateY}px)) rotate(${sign * cfg.rotate}deg)`,
                transformOrigin: "top left",
                opacity: cfg.opacity,
                filter: cfg.blur > 0 ? `blur(${cfg.blur}px)` : "none",
                fontSize: cfg.fontSize,
                fontWeight: 700,
                color: "#ffffff",
                paddingLeft: 48,
                lineHeight: 1,
                whiteSpace: "nowrap",
                willChange: "transform",
                transition: isDragging ? "none" : "transform 0.18s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.18s ease",
              }}
            >
              {task}
            </div>
          );
        })}

        {/* Arrow indicator */}
        <div
          className="absolute flex items-center pointer-events-none"
          style={{ top: "50%", left: 0, transform: "translateY(-50%)", width: 40, justifyContent: "center", color: "#ffffff", fontSize: 22, fontWeight: 700 }}
        >
          →
        </div>

        {/* Inline input — floats over selected item */}
        <div
          className="absolute pointer-events-auto"
          style={{
            top: "50%",
            right: 20,
            transform: "translateY(-50%)",
            zIndex: 20,
          }}
        >
          <div
            className="flex flex-row items-center gap-2"
            style={{
              background: "#1a1a1a",
              border: "1.5px solid rgba(255,255,255,0.30)",
              borderRadius: 10,
              padding: "6px 8px 6px 14px",
              width: 128,
              height: 52,
            }}
          >
            <input
              value={inlineValue}
              onChange={(e) => setInlineValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) handleSubmit();
              }}
              placeholder="Ad copy"
              className="flex-1 bg-transparent outline-none italic text-white placeholder-white/50 text-[13px]"
              style={{ fontSize: 13 }}
            />
            <button
              onClick={handleSubmit}
              className="flex items-center justify-center rounded-[6px] shrink-0"
              style={{ width: 31, height: 29, background: "#272727" }}
            >
              <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ width: 14, height: 14 }}>
                <path d="M11.156 3.5v5.688q0 .273-.191.465-.191.191-.465.191-.273 0-.465-.191-.191-.192-.191-.465V4.898L3.988 10.75q-.219.219-.492.219-.273 0-.465-.192-.191-.191-.191-.464 0-.273.219-.438l5.851-5.906-4.101 0q-.273 0-.465-.191-.191-.192-.191-.465 0-.273.191-.465.191-.191.465-.191l5.688 0q.273 0 .464.191.191.191.191.465z" fill="#ffffff" />
              </svg>
            </button>
          </div>
        </div>

        {/* Top gradient fade */}
        <div className="absolute inset-x-0 top-0 pointer-events-none" style={{ height: "40%", background: "linear-gradient(180deg, #000 0%, rgba(0,0,0,0.9) 50%, transparent 100%)", zIndex: 10 }} />
        {/* Bottom gradient fade */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none" style={{ height: "40%", background: "linear-gradient(0deg, #000 0%, rgba(0,0,0,0.9) 50%, transparent 100%)", zIndex: 10 }} />
        {/* Highlight bar */}
        <div className="absolute inset-x-0 pointer-events-none" style={{ top: "50%", transform: "translateY(-50%)", height: ITEM_HEIGHT, background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)", borderTop: "1px solid rgba(255,255,255,0.055)", borderBottom: "1px solid rgba(255,255,255,0.055)", zIndex: 5 }} />
      </div>

      {/* Bottom section */}
      <div className="w-full flex flex-col items-center gap-4">
        {/* Suggestion pills */}
        <div className="flex flex-row gap-2 flex-wrap justify-center" style={{ padding: "0 5px" }}>
          {suggestions.map((s) => {
            const isActive = (inlineValue || suggestions[0]) === s;
            return (
              <button
                key={s}
                onClick={() => setInlineValue(s)}
                className="rounded-full shrink-0"
                style={{
                  height: 35,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.75)",
                  background: isActive ? "#272727" : "rgba(255,255,255,0.08)",
                  border: isActive ? "none" : "1px solid transparent",
                  whiteSpace: "nowrap",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Start / Cancel row */}
        <div className="flex flex-row gap-3 items-center">
          <button
            onClick={handleSubmit}
            className="flex flex-row items-center gap-2 font-bold rounded-full"
            style={{
              padding: "15px 40px",
              fontSize: 15,
              letterSpacing: 0.15,
              background: "#ffffff",
              color: "#000000",
            }}
          >
            <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: 16, flexShrink: 0 }}>
              <path d="M11.43 7.875q0 .273-.165.492-.164.219-.437.328l-2.844 1.04-1.04 2.843q-.109.273-.328.438-.219.164-.492.164-.273 0-.492-.164-.219-.164-.328-.438l-1.04-2.843-2.843-1.04q-.273-.109-.438-.328Q1 7.148 1 6.875q0-.273.164-.492.165-.219.438-.328l2.843-1.04 1.04-2.843q.109-.273.328-.438Q6.03 1.57 6.125 1.57q.273 0 .492.164.219.164.328.438L8.985 5.015l2.843 1.04q.273.11.438.328.164.22.164.492z" fill="#000" />
            </svg>
            Start
          </button>
          <button
            onClick={onCancel}
            className="flex items-center justify-center font-bold rounded-full"
            style={{
              width: 51,
              height: 51,
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#ffffff",
            }}
          >
            <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: 16 }}>
              <path d="M11.43 10.445q.164.219.164.492 0 .273-.191.465-.192.191-.465.191-.273 0-.438-.219L7 7.875l-3.445 3.445q-.219.219-.492.219-.273 0-.465-.192-.191-.191-.191-.464 0-.273.219-.492l3.445-3.445-3.445-3.5q-.219-.164-.219-.438 0-.273.191-.465.192-.191.465-.191.273 0 .492.164l3.445 3.5 3.5-3.5q.164-.164.438-.164.273 0 .465.191.191.191.191.465 0 .273-.164.492L7.93 7l3.5 3.445z" fill="#ffffff" />
            </svg>
          </button>
        </div>
        <p className="text-center" style={{ fontSize: 11, letterSpacing: "1.98px", color: "rgba(255,255,255,0.2)", fontWeight: 500 }}>
          Drag or scroll to choose
        </p>
      </div>
    </div>
  );
}
