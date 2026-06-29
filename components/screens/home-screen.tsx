"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Sparkle, ArrowUpRight, X } from "@phosphor-icons/react";
import WillLogo from "@/components/will-logo";

// Task structure with action names and icon URLs from svgl.app
interface Task {
  name: string;
  action: string;
  icon: string;
}

const TASKS: Task[] = [
  { name: "Marketing", action: "Create", icon: "https://cdn.svgl.app/logos/mailchimp.svg" },
  { name: "Design", action: "Design", icon: "https://cdn.svgl.app/logos/figma.svg" },
  { name: "Strategy", action: "Plan", icon: "https://cdn.svgl.app/logos/miro.svg" },
  { name: "Write", action: "Write", icon: "https://cdn.svgl.app/logos/notion.svg" },
  { name: "Analyze", action: "Analyze", icon: "https://cdn.svgl.app/logos/google-analytics.svg" },
  { name: "Profit", action: "Monetize", icon: "https://cdn.svgl.app/logos/stripe.svg" },
  { name: "Growth", action: "Grow", icon: "https://cdn.svgl.app/logos/databox.svg" },
  { name: "Code", action: "Code", icon: "https://cdn.svgl.app/logos/github.svg" },
  { name: "Plan", action: "Organize", icon: "https://cdn.svgl.app/logos/asana.svg" },
  { name: "Research", action: "Gather", icon: "https://cdn.svgl.app/logos/typeform.svg" },
];

const SUGGESTIONS: Record<string, string[]> = {
  "Create": ["Social ads", "Email blast", "Brand story", "Ad copy"],
  "Design":    ["UI kit", "Brand identity", "Ad creative", "Landing page"],
  "Write":     ["Blog post", "Product copy", "Email blast", "Brand story"],
  "Analyze":   ["Market data", "User research", "Competitor", "A/B test"],
  "Plan":  ["Go-to-market", "Positioning", "Roadmap", "SWOT"],
  default:   ["Social ads", "Email blast", "Brand story", "Ad copy"],
};

const SLOT_HEIGHT = 72;
const VISIBLE_RANGE = 4; // items shown above/below center

// Per-distance visual properties
const SLOT_STYLES = [
  { fontSize: 52, opacity: 1.00, blur: 0,   rotate: 0  }, // 0 selected
  { fontSize: 50, opacity: 0.68, blur: 0.6, rotate: 3.5 }, // ±1
  { fontSize: 48, opacity: 0.38, blur: 1.8, rotate: 8  }, // ±2
  { fontSize: 46, opacity: 0.18, blur: 3.5, rotate: 13 }, // ±3
  { fontSize: 44, opacity: 0.07, blur: 6,   rotate: 17 }, // ±4
  { fontSize: 42, opacity: 0.02, blur: 9,   rotate: 21 }, // ±5
];

function getStyle(absDist: number) {
  return SLOT_STYLES[Math.min(absDist, SLOT_STYLES.length - 1)];
}

interface HomeScreenProps {
  onSelectTask: (task: string) => void;
}

export default function HomeScreen({ onSelectTask }: HomeScreenProps) {
  const [selectedIndex, setSelectedIndex] = useState(1); // "Design"
  const [isDragging, setIsDragging] = useState(false);
  // Smooth float offset: 0 = perfectly snapped, non-zero = mid-drag interpolation
  const [smoothOffset, setSmoothOffset] = useState(0);
  // pill mode: false = normal CTA, true = pill input expanded
  const [pillOpen, setPillOpen] = useState(false);
  const [pillValue, setPillValue] = useState("");
  const [pillMounted, setPillMounted] = useState(false); // for entry animation

  const dragStartY = useRef(0);
  const dragStartIndex = useRef(0);
  const dragRawOffset = useRef(0); // tracks sub-step drag offset
  const rafRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const pillInputRef = useRef<HTMLInputElement>(null);

  // Lerp smoothOffset → 0 after release
  useEffect(() => {
    if (!isDragging && Math.abs(smoothOffset) > 0.005) {
      const lerp = () => {
        setSmoothOffset((prev) => {
          const next = prev * 0.72;
          if (Math.abs(next) < 0.005) return 0;
          rafRef.current = requestAnimationFrame(lerp);
          return next;
        });
      };
      rafRef.current = requestAnimationFrame(lerp);
      return () => cancelAnimationFrame(rafRef.current);
    }
  }, [isDragging, smoothOffset]);

  const wheelTimeoutRef = useRef<NodeJS.Timeout>();
  
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    // Smooth delta accumulation for fluid scrolling
    const delta = Math.max(-1, Math.min(1, e.deltaY / 120));
    const step = delta > 0.1 ? 1 : delta < -0.1 ? -1 : 0;
    
    if (step !== 0) {
      // Clear any pending timeout to prevent queue buildup
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
      
      setSelectedIndex((i) => ((i + step) % TASKS.length + TASKS.length) % TASKS.length);
      // Smooth easing offset with dampening
      setSmoothOffset(step * 0.25);
      
      // Auto-damp the smooth offset over time for fluid feel
      wheelTimeoutRef.current = setTimeout(() => {
        setSmoothOffset((prev) => prev * 0.5);
      }, 80);
    }
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  }, [handleWheel]);

  const onPointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartY.current = e.clientY;
    dragStartIndex.current = selectedIndex;
    dragRawOffset.current = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const delta = dragStartY.current - e.clientY;
    const rawSteps = delta / (SLOT_HEIGHT * 0.5); // responsive drag sensitivity
    const steps = Math.round(rawSteps);
    const subStep = rawSteps - steps; // fractional remainder for smooth feel
    const raw = dragStartIndex.current + steps;
    setSelectedIndex(((raw % TASKS.length) + TASKS.length) % TASKS.length);
    setSmoothOffset(subStep * 0.35); // slightly damped for fluid feel
    dragRawOffset.current = rawSteps;
  };

  const onPointerUp = () => {
    setIsDragging(false);
    // spring back sub-step offset
    setSmoothOffset((prev) => prev * 0.3);
  };

  // Open pill with mount animation
  const openPill = () => {
    setPillOpen(true);
    setPillMounted(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setPillMounted(true));
    });
    setTimeout(() => pillInputRef.current?.focus(), 120);
  };

  const closePill = () => {
    setPillMounted(false);
    setTimeout(() => {
      setPillOpen(false);
      setPillValue("");
    }, 280);
  };

  const handleSubmit = () => {
    const task = TASKS[selectedIndex];
    const suggestions = SUGGESTIONS[task.action] ?? SUGGESTIONS.default;
    onSelectTask(task.name);
  };

  const handlePillSubmit = () => {
    const task = TASKS[selectedIndex];
    onSelectTask(task.name);
  };

  const currentTask = TASKS[selectedIndex];
  const suggestions = SUGGESTIONS[currentTask.action] ?? SUGGESTIONS.default;

  // Build visible items
  const visibleItems = TASKS.map((task, index) => {
    let dist = index - selectedIndex;
    if (dist > TASKS.length / 2) dist -= TASKS.length;
    if (dist < -TASKS.length / 2) dist += TASKS.length;
    return { task, dist };
  }).filter(({ dist }) => Math.abs(dist) <= VISIBLE_RANGE + 1);

  const CENTER_Y = 195; // vertical anchor for selected item inside 420px container

  return (
    <div
      className="w-full h-full flex flex-col items-center bg-black overflow-hidden"
      style={{ padding: "44px 0 0" }}
    >
      {/* Header logo */}
      <WillLogo variant="home" label="READY" />

      {/* Center wrapper */}
      <div className="flex-1 flex items-center justify-center w-full">
        {/* Scroll wheel */}
        <div
          ref={containerRef}
          className="relative overflow-hidden cursor-grab active:cursor-grabbing"
          style={{ width: 340, height: 420, background: "#000000", touchAction: "none" }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {visibleItems.map(({ task, dist }) => {
            const absDist = Math.abs(dist);
            const s = getStyle(absDist);
            // Apply smooth sub-step offset to give continuous scroll feel
            const floatDist = dist + smoothOffset;
            const topY = CENTER_Y + floatDist * SLOT_HEIGHT;
            const sign = dist > 0 ? 1 : dist < 0 ? -1 : 0;
            const isSelected = dist === 0;

            // When pill is open, selected item compresses/fades to make room
            const pillShrink = isSelected && pillOpen;
            const contentOpacity = pillShrink ? 0 : s.opacity;
            const contentScale = pillShrink ? 0.7 : 1;

            return (
              <div
                key={task.name}
                className="absolute select-none pointer-events-none flex items-center gap-2"
                style={{
                  left: 36,
                  top: topY,
                  fontSize: s.fontSize,
                  lineHeight: `${s.fontSize}px`,
                  fontWeight: 700,
                  color: "#ffffff",
                  opacity: contentOpacity,
                  filter: s.blur > 0 ? `blur(${s.blur}px)` : "none",
                  transform: [
                    sign !== 0 ? `rotate(${sign * s.rotate}deg)` : "",
                    pillShrink ? `scale(${contentScale}) translateX(-20px)` : "",
                  ].filter(Boolean).join(" ") || "none",
                  transformOrigin: "top left",
                  whiteSpace: "nowrap",
                  transition: isDragging
                    ? "none"
                    : "top 0.22s cubic-bezier(0.34,1.2,0.64,1), opacity 0.22s ease, filter 0.22s ease, transform 0.28s cubic-bezier(0.34,1.2,0.64,1)",
                  willChange: "transform, top, opacity",
                }}
              >
                {/* Icon from svgl */}
                <img
                  src={task.icon}
                  alt={task.name}
                  style={{
                    width: Math.max(s.fontSize * 0.7, 24),
                    height: Math.max(s.fontSize * 0.7, 24),
                    flexShrink: 0,
                  }}
                  onError={(e) => {
                    // fallback: hide if icon doesn't load
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Action text instead of task name */}
                {task.action}
              </div>
            );
          })}

          {/* Inline pill input — mounted over selected word */}
          {pillOpen && (
            <div
              className="absolute pointer-events-auto"
              style={{
                left: 36,
                top: CENTER_Y - 2,
                width: 260,
                height: 52,
                zIndex: 20,
                opacity: pillMounted ? 1 : 0,
                transform: pillMounted ? "scale(1) translateY(0px)" : "scale(0.88) translateY(8px)",
                transition: "opacity 0.28s cubic-bezier(0.34,1.2,0.64,1), transform 0.28s cubic-bezier(0.34,1.2,0.64,1)",
                transformOrigin: "left center",
              }}
            >
              <div
                className="flex flex-row items-center gap-2 w-full h-full"
                style={{
                  background: "#161616",
                  border: "1.5px solid rgba(255,255,255,0.22)",
                  borderRadius: 14,
                  padding: "6px 8px 6px 16px",
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 32px rgba(0,0,0,0.5)",
                }}
              >
                <input
                  ref={pillInputRef}
                  value={pillValue}
                  onChange={(e) => setPillValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) handlePillSubmit();
                    if (e.key === "Escape") closePill();
                  }}
                  placeholder={suggestions[0]}
                  className="flex-1 bg-transparent outline-none text-white placeholder-white/40 min-w-0"
                  style={{ fontSize: 18, fontWeight: 600 }}
                />
                <button
                  onClick={handlePillSubmit}
                  className="flex items-center justify-center shrink-0 rounded-[10px]"
                  style={{ width: 36, height: 36, background: "#ffffff" }}
                >
                  <ArrowUpRight size={16} color="#000000" weight="bold" />
                </button>
              </div>
            </div>
          )}

          {/* Arrow indicator */}
          <div
            className="absolute pointer-events-none flex items-center"
            style={{
              left: 0,
              top: CENTER_Y + 14,
              transition: "opacity 0.22s ease",
              opacity: pillOpen ? 0 : 1,
            }}
          >
            <ArrowRight size={24} color="#ffffff" weight="bold" />
          </div>

          {/* Top gradient */}
          <div
            className="absolute inset-x-0 top-0 pointer-events-none"
            style={{
              height: 160,
              background: "linear-gradient(180deg, #000000 0%, rgba(0,0,0,0.85) 50%, transparent 100%)",
              zIndex: 10,
            }}
          />
          {/* Bottom gradient */}
          <div
            className="absolute inset-x-0 bottom-0 pointer-events-none"
            style={{
              height: 160,
              background: "linear-gradient(0deg, #000000 0%, rgba(0,0,0,0.85) 50%, transparent 100%)",
              zIndex: 10,
            }}
          />
        </div>
      </div>

      {/* Bottom CTA */}
      <div
        className="w-full flex flex-col items-center gap-2 shrink-0 px-4"
        style={{ paddingBottom: 28, paddingTop: 4 }}
      >
        {/* Suggestion pills — appear when pill is open */}
        {pillOpen && (
          <div
            className="flex flex-row gap-2 flex-wrap justify-center"
            style={{
              maxWidth: 320,
              opacity: pillMounted ? 1 : 0,
              transform: pillMounted ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.24s ease 0.06s, transform 0.24s ease 0.06s",
            }}
          >
            {suggestions.map((s, i) => (
              <button
                key={s}
                onClick={() => { setPillValue(s); pillInputRef.current?.focus(); }}
                className="rounded-full"
                style={{
                  height: 30,
                  padding: "0 14px",
                  fontSize: 12,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.7)",
                  background: i === suggestions.length - 1 ? "#272727" : "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                  transition: "background 0.15s ease",
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Main CTA button — morphs when pillOpen */}
        {!pillOpen ? (
          <button
            onClick={openPill}
            className="flex flex-row items-center gap-2 bg-white text-black font-bold rounded-full cursor-pointer select-none"
            style={{
              padding: "13px 48px",
              fontSize: 15,
              letterSpacing: 0.15,
              justifyContent: "center",
              animation: "will-pill-in 0.32s cubic-bezier(0.34,1.2,0.64,1) both",
            }}
          >
            <Sparkle size={16} weight="fill" color="#000000" />
            Start Creating
          </button>
        ) : (
          <button
            onClick={closePill}
            className="flex flex-row items-center gap-2 font-bold rounded-full cursor-pointer select-none"
            style={{
              padding: "13px 44px",
              fontSize: 15,
              letterSpacing: 0.15,
              justifyContent: "center",
              background: "#1a1a1a",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#ffffff",
              animation: "will-pill-in 0.28s cubic-bezier(0.34,1.2,0.64,1) both",
            }}
          >
            <X size={16} color="#ffffff" weight="bold" />
            Cancel
          </button>
        )}

        <p style={{ fontSize: 10, letterSpacing: "1.5px", color: "rgba(255,255,255,0.15)", fontWeight: 500, textAlign: "center", margin: 0 }}>
          Drag or scroll to choose
        </p>
      </div>
    </div>
  );
}
