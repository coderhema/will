"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

const ITEM_HEIGHT = 70;
const VISIBLE_RANGE = 4;

interface SlotConfig {
  opacity: number;
  fontSize: number;
  xOffset: number;
  blur: number;
  rotate: number;
}

function getSlotConfig(absDist: number): SlotConfig {
  const configs: SlotConfig[] = [
    { opacity: 1.0,  fontSize: 50, xOffset: 0,  blur: 0,    rotate: 0  },
    { opacity: 0.72, fontSize: 49, xOffset: 0,  blur: 0.75, rotate: 4  },
    { opacity: 0.45, fontSize: 48, xOffset: 0,  blur: 2,    rotate: 9  },
    { opacity: 0.22, fontSize: 46, xOffset: 0,  blur: 4,    rotate: 14 },
    { opacity: 0.09, fontSize: 44, xOffset: 0,  blur: 7,    rotate: 19 },
  ];
  return configs[Math.min(absDist, configs.length - 1)];
}

interface HomeScreenProps {
  onSelectTask: (task: string) => void;
}

export default function HomeScreen({ onSelectTask }: HomeScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartIndex = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Wheel scroll
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (e.deltaY > 5) {
        setSelectedIndex((i) => (i + 1) % TASKS.length);
      } else if (e.deltaY < -5) {
        setSelectedIndex((i) => (i - 1 + TASKS.length) % TASKS.length);
      }
    },
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  // Touch / pointer drag
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
    const newIndex = (dragStartIndex.current + steps + TASKS.length * 10) % TASKS.length;
    setSelectedIndex(newIndex);
  };
  const onPointerUp = () => setIsDragging(false);

  // Build visible items
  const visibleItems = TASKS.map((task, index) => {
    let distance = index - selectedIndex;
    if (distance > TASKS.length / 2) distance -= TASKS.length;
    if (distance < -TASKS.length / 2) distance += TASKS.length;
    return { task, index, distance };
  }).filter(({ distance }) => Math.abs(distance) <= VISIBLE_RANGE);

  return (
    <div className="w-full h-full flex flex-col items-center bg-black overflow-hidden" style={{ padding: "44px 0 48px" }}>
      {/* Header logo */}
      <WillLogo label="READY" />

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
        {/* Task words */}
        {visibleItems.map(({ task, distance }) => {
          const absDist = Math.abs(distance);
          const cfg = getSlotConfig(absDist);
          const isSelected = distance === 0;
          const sign = distance === 0 ? 0 : distance > 0 ? 1 : -1;

          // Center Y of the scroll area
          const centerY = "50%";
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
                transition: isDragging ? "none" : "transform 0.18s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.18s ease, font-size 0.18s ease",
              }}
            >
              {task}
            </div>
          );
        })}

        {/* Arrow indicator for selected */}
        <div
          className="absolute flex items-center pointer-events-none"
          style={{
            top: "50%",
            left: 0,
            transform: "translateY(-50%)",
            width: 40,
            justifyContent: "center",
            color: "#ffffff",
            fontSize: 22,
            fontWeight: 700,
            transition: "none",
          }}
        >
          →
        </div>

        {/* Top gradient fade */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: "40%",
            background: "linear-gradient(180deg, #000000 0%, rgba(0,0,0,0.9) 50%, transparent 100%)",
            zIndex: 10,
          }}
        />
        {/* Bottom gradient fade */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "40%",
            background: "linear-gradient(0deg, #000000 0%, rgba(0,0,0,0.9) 50%, transparent 100%)",
            zIndex: 10,
          }}
        />

        {/* Highlight bar */}
        <div
          className="absolute inset-x-0 pointer-events-none"
          style={{
            top: "50%",
            transform: `translateY(-50%)`,
            height: ITEM_HEIGHT,
            background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.05) 0%, transparent 70%)",
            borderTop: "1px solid rgba(255,255,255,0.055)",
            borderBottom: "1px solid rgba(255,255,255,0.055)",
            zIndex: 5,
          }}
        />
      </div>

      {/* Bottom CTA */}
      <div className="w-full flex flex-col items-center gap-4">
        <button
          onClick={() => onSelectTask(TASKS[selectedIndex])}
          className="flex flex-row items-center gap-2 bg-white text-black font-bold rounded-full cursor-pointer select-none"
          style={{ padding: "15px 60px", fontSize: 15, letterSpacing: 0.15 }}
        >
          <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg" style={{ width: 16, height: 16, flexShrink: 0 }}>
            <path
              d="M11.43 7.875q0 .273-.165.492-.164.219-.437.328l-2.844 1.04-1.04 2.843q-.109.273-.328.438-.219.164-.492.164-.273 0-.492-.164-.219-.164-.328-.438l-1.04-2.843-2.843-1.04q-.273-.109-.438-.328Q1 7.148 1 6.875q0-.273.164-.492.165-.219.438-.328l2.843-1.04 1.04-2.843q.109-.273.328-.438Q6.03 1.57 6.125 1.57q.273 0 .492.164.219.164.328.438L8.985 5.015l2.843 1.04q.273.11.438.328.164.22.164.492z"
              fill="#000"
            />
          </svg>
          Start Creating
        </button>
        <p
          className="text-center"
          style={{ fontSize: 11, letterSpacing: "1.98px", color: "rgba(255,255,255,0.2)", fontWeight: 500 }}
        >
          Drag or scroll to choose
        </p>
      </div>
    </div>
  );
}
