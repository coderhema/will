"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ArrowRight, ArrowUpRight, X } from "@phosphor-icons/react";
import WillLogo from "@/components/will-logo";

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

const SUGGESTIONS: Record<string, string[]> = {
  Marketing: ["Social ads", "Email blast", "Brand story", "Ad copy"],
  Design:    ["Social ads", "Email blast", "Brand story", "Ad copy"],
  Write:     ["Blog post", "Product copy", "Email blast", "Brand story"],
  Analyze:   ["Market data", "User research", "Competitor", "A/B test"],
  default:   ["Social ads", "Email blast", "Brand story", "Ad copy"],
};

const SLOT_HEIGHT = 68;
const CENTER_Y = 320;

interface SlotStyle {
  fontSize: number;
  opacity: number;
  blur: number;
  rotate: number;
}

const SLOT_STYLES: SlotStyle[] = [
  { fontSize: 50, opacity: 1.00, blur: 0,    rotate: 0  },
  { fontSize: 49, opacity: 0.72, blur: 0.75, rotate: 4  },
  { fontSize: 48, opacity: 0.45, blur: 2,    rotate: 9  },
  { fontSize: 46, opacity: 0.22, blur: 4,    rotate: 14 },
  { fontSize: 44, opacity: 0.09, blur: 7,    rotate: 19 },
  { fontSize: 42, opacity: 0.03, blur: 9,    rotate: 22 },
];

function getSlotStyle(absDist: number): SlotStyle {
  return SLOT_STYLES[Math.min(absDist, SLOT_STYLES.length - 1)];
}

interface HomeActionScreenProps {
  initialTask: string;
  onCancel: () => void;
  onStart: (task: string, detail: string) => void;
}

export default function HomeActionScreen({ initialTask, onCancel, onStart }: HomeActionScreenProps) {
  const initIdx = TASKS.indexOf(initialTask);
  const [selectedIndex, setSelectedIndex] = useState(initIdx >= 0 ? initIdx : 1);
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
    const steps = Math.round(delta / (SLOT_HEIGHT * 0.55));
    const raw = dragStartIndex.current + steps;
    setSelectedIndex(((raw % TASKS.length) + TASKS.length) % TASKS.length);
  };

  const onPointerUp = () => setIsDragging(false);

  const currentTask = TASKS[selectedIndex];
  const suggestions = SUGGESTIONS[currentTask] ?? SUGGESTIONS.default;

  const handleSubmit = () => {
    onStart(currentTask, inlineValue.trim() || suggestions[suggestions.length - 1]);
  };

  const visibleItems = TASKS.map((task, index) => {
    let dist = index - selectedIndex;
    if (dist > TASKS.length / 2) dist -= TASKS.length;
    if (dist < -TASKS.length / 2) dist += TASKS.length;
    return { task, dist };
  }).filter(({ dist }) => Math.abs(dist) <= 5);

  return (
    <div
      className="w-full h-full flex flex-col items-center bg-black overflow-hidden relative"
      style={{ padding: "44px 0 48px" }}
    >
      {/* Header logo — THINKING state (two + symbols inside ring) */}
      <WillLogo variant="thinking" label="THINKING" />

      {/* Scroll section — fixed 340×600 */}
      <div
        ref={containerRef}
        className="relative shrink-0 overflow-hidden cursor-grab active:cursor-grabbing"
        style={{ width: 340, height: 600, background: "#000000", touchAction: "none" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* Task words */}
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

        {/* Arrow indicator */}
        <div
          className="absolute pointer-events-none flex items-center"
          style={{ left: 0, top: CENTER_Y + 13 }}
        >
          <ArrowRight size={24} color="#ffffff" weight="bold" />
        </div>

        {/* Top gradient */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: 228,
            background: "linear-gradient(180deg, #000000 0%, rgba(0,0,0,0.9) 45%, transparent 100%)",
            zIndex: 11,
          }}
        />
        {/* Bottom gradient */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: 228,
            background: "linear-gradient(0deg, #000000 0%, rgba(0,0,0,0.9) 55%, transparent 100%)",
            zIndex: 12,
          }}
        />
      </div>

      {/* Inline input — absolutely positioned over the scroll area, outside pointer-capture zone */}
      {/* Outer padding-top=44, logo+gap≈48px, so scroll top ≈ 92px. CENTER_Y=320 → total ≈ 412px */}
      <div
        className="absolute pointer-events-none"
        style={{ left: 0, right: 0, top: 0, bottom: 0, zIndex: 20 }}
      >
        <div
          className="absolute"
          style={{
            left: "calc(50% - 170px + 214px)",  // center of 340px scroll (calc: (390-340)/2 = 25px margin, so left=25+214=239px)
            top: 413,
            width: 118,
            height: 52,
            pointerEvents: "auto",
          }}
        >
          <div
            className="flex flex-row items-center gap-2 w-full h-full"
            style={{
              background: "#1a1a1a",
              border: "1.5px solid rgba(255,255,255,0.30)",
              borderRadius: 10,
              padding: "6px 10px 6px 14px",
            }}
          >
            <input
              value={inlineValue}
              onChange={(e) => setInlineValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) handleSubmit();
              }}
              placeholder="Ad copy"
              className="flex-1 bg-transparent outline-none text-white placeholder-white/50 italic min-w-0"
              style={{ fontSize: 13 }}
            />
            <button
              data-testid="inline-submit"
              onClick={handleSubmit}
              className="flex items-center justify-center shrink-0 rounded-[6px]"
              style={{ width: 31, height: 29, background: "#272727" }}
            >
              <ArrowUpRight size={15} color="#ffffff" weight="bold" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="w-full flex flex-col items-center gap-4 bg-black" style={{ paddingTop: 0 }}>
        {/* Suggestion pills */}
        <div className="flex flex-row gap-2 items-center flex-wrap justify-center" style={{ padding: "0 5px" }}>
          {suggestions.map((s) => {
            const isActive = s === suggestions[suggestions.length - 1];
            return (
              <button
                key={s}
                onClick={() => setInlineValue(s)}
                className="shrink-0 rounded-full"
                style={{
                  height: 35,
                  padding: "6px 14px",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.75)",
                  background: isActive ? "#272727" : "rgba(255,255,255,0.078)",
                  border: "none",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* Cancel CTA — matches reference exactly */}
        <button
          onClick={onCancel}
          className="flex flex-row items-center gap-2 font-bold rounded-full shrink-0"
          style={{
            padding: "15px 60px",
            fontSize: 15,
            letterSpacing: 0.15,
            background: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.15)",
            color: "#ffffff",
            cursor: "pointer",
          }}
        >
          <X size={16} color="#ffffff" weight="bold" />
          Cancel
        </button>

        <p style={{ fontSize: 11, letterSpacing: "1.98px", color: "rgba(255,255,255,0.2)", fontWeight: 500, textAlign: "center", margin: 0 }}>
          Drag or scroll to choose
        </p>
      </div>
    </div>
  );
}
