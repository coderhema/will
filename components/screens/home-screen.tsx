"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WillLogo from "@/components/will-logo";

// Matches the reference design exactly — items positioned at absolute Y offsets
// Each slot = 68px apart; center slot (dist=0) anchored at top:320
const TASKS = [
  "Marketing",
  "Design",
  "Strategy",
  "Write",
  "Analyze",
  "Profit",
  "Growth",
  "Code",
  "Plan",
  "Research",
];

const SLOT_HEIGHT = 68; // px between each item
const CENTER_Y = 320;   // top of selected item in the 632px scroll area

interface SlotStyle {
  fontSize: number;
  opacity: number;
  blur: number;    // px
  rotate: number;  // deg, applied with transform-origin top-left
}

// Distance 0 = selected, positive = below, negative = above
const SLOT_STYLES: SlotStyle[] = [
  { fontSize: 50, opacity: 1.00, blur: 0,    rotate: 0  },  // 0 (selected)
  { fontSize: 49, opacity: 0.72, blur: 0.75, rotate: 4  },  // ±1
  { fontSize: 48, opacity: 0.45, blur: 2,    rotate: 9  },  // ±2
  { fontSize: 46, opacity: 0.22, blur: 4,    rotate: 14 },  // ±3
  { fontSize: 44, opacity: 0.09, blur: 7,    rotate: 19 },  // ±4
  { fontSize: 42, opacity: 0.03, blur: 9,    rotate: 22 },  // ±5
];

function getSlotStyle(absDist: number): SlotStyle {
  return SLOT_STYLES[Math.min(absDist, SLOT_STYLES.length - 1)];
}

interface HomeScreenProps {
  onSelectTask: (task: string) => void;
}

export default function HomeScreen({ onSelectTask }: HomeScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(1); // start at "Design"
  const [isDragging, setIsDragging] = useState(false);
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
    const steps = Math.round(delta / (SLOT_HEIGHT * 0.55));
    const raw = dragStartIndex.current + steps;
    setSelectedIndex(((raw % TASKS.length) + TASKS.length) % TASKS.length);
  };

  const onPointerUp = () => setIsDragging(false);

  // Build visible items: show ±5 slots from selected
  const visibleItems = TASKS.map((task, index) => {
    let dist = index - selectedIndex;
    if (dist > TASKS.length / 2) dist -= TASKS.length;
    if (dist < -TASKS.length / 2) dist += TASKS.length;
    return { task, dist };
  }).filter(({ dist }) => Math.abs(dist) <= 5);

  return (
    <div
      className="w-full h-full flex flex-col items-center bg-black overflow-hidden"
      style={{ padding: "44px 0 48px" }}
    >
      {/* Header logo */}
      <WillLogo variant="home" label="READY" />

      {/* Scroll section — fixed 340×632 */}
      <div
        ref={containerRef}
        className="relative shrink-0 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ width: 340, height: 632, background: "#000000", touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {visibleItems.map(({ task, dist }) => {
          const absDist = Math.abs(dist);
          const s = getSlotStyle(absDist);
          const topY = CENTER_Y + dist * SLOT_HEIGHT;
          const sign = dist > 0 ? 1 : dist < 0 ? -1 : 0;

          return (
            <div
              key={task}
              className="absolute select-none pointer-events-none"
              style={{
                left: 36,
                top: topY,
                fontSize: s.fontSize,
                lineHeight: `${s.fontSize}px`,
                fontWeight: 700,
                color: "#ffffff",
                opacity: s.opacity,
                filter: s.blur > 0 ? `blur(${s.blur}px)` : "none",
                transform: sign !== 0 ? `rotate(${sign * s.rotate}deg)` : "none",
                transformOrigin: "top left",
                whiteSpace: "nowrap",
                transition: isDragging ? "none" : "top 0.18s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.18s ease",
                willChange: "transform",
              }}
            >
              {task}
            </div>
          );
        })}

        {/* Arrow indicator — anchored at selected slot */}
        <svg
          viewBox="0 0 14 14"
          preserveAspectRatio="xMidYMid meet"
          xmlns="http://www.w3.org/2000/svg"
          className="absolute pointer-events-none"
          style={{ width: 24, height: 24, left: 0, top: CENTER_Y + 13 }}
        >
          <path
            d="M6.9 2.352q-.181.027-.321.167-.113.113-.147.28-.034.167.02.321.027.085.26.325.232.236 1.364 1.371 1.582 1.582 1.582 1.596 0 .014-3.456.014l-3.445 0-.085.041q-.222.113-.301.338-.075.222.007.434.058.096.14.181.085.082.167.12.085.034.533.034l3.011 0q3.428 0 3.428.014 0 .014-1.582 1.596-1.132 1.135-1.364 1.374-.232.236-.26.321-.055.154-.02.321.034.167.147.28.181.181.42.181h.041q.113 0 .198-.055.14-.099.516-.465l1.682-1.678q2.112-2.102 2.153-2.184.072-.126.072-.28 0-.154-.072-.28-.041-.082-2.15-2.181-2.105-2.102-2.177-2.136-.068-.038-.236-.065-.041 0-.126.014z"
            fill="#ffffff"
          />
        </svg>

        {/* Top gradient */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: 228,
            background: "linear-gradient(180deg, #000000 0%, rgba(0,0,0,0.9) 45%, transparent 100%)",
            zIndex: 10,
          }}
        />
        {/* Bottom gradient */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: 185,
            background: "linear-gradient(0deg, #000000 0%, rgba(0,0,0,0.9) 55%, transparent 100%)",
            zIndex: 11,
          }}
        />
      </div>

      {/* Bottom CTA */}
      <div className="w-full flex flex-col items-center gap-4">
        <button
          onClick={() => onSelectTask(TASKS[selectedIndex])}
          className="flex flex-row items-center gap-2 bg-white text-black font-bold rounded-full cursor-pointer select-none shrink-0"
          style={{ padding: "15px 60px", fontSize: 15, letterSpacing: 0.15 }}
        >
          {/* Sparkle icon */}
          <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: 16, flexShrink: 0 }}>
            <path
              d="M11.43 7.875q0 .273-.165.492-.164.219-.437.328l-2.844 1.04-1.04 2.843q-.109.273-.328.438-.219.164-.492.164-.273 0-.492-.164-.219-.164-.328-.438l-1.04-2.843-2.843-1.04q-.273-.109-.438-.328Q1 7.148 1 6.875q0-.273.164-.492.165-.219.438-.328l2.843-1.04 1.04-2.843q.109-.273.328-.438Q6.03 1.57 6.125 1.57q.273 0 .492.164.219.164.328.438L8.985 5.015l2.843 1.04q.273.11.438.328.164.22.164.492z"
              fill="#000000"
            />
          </svg>
          Start Creating
        </button>
        <p style={{ fontSize: 11, letterSpacing: "1.98px", color: "rgba(255,255,255,0.2)", fontWeight: 500, textAlign: "center", margin: 0 }}>
          Drag or scroll to choose
        </p>
      </div>
    </div>
  );
}
