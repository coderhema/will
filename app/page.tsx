"use client";

import { useCallback, useEffect, useState } from "react";
import SplashScreen from "@/components/screens/splash-screen";
import HomeScreen from "@/components/screens/home-screen";
import AgentWorkingScreen from "@/components/screens/agent-working-screen";
import AgentProgressScreen from "@/components/screens/agent-progress-screen";
import AgentDesignScreen from "@/components/screens/agent-design-screen";

type Screen =
  | "splash"
  | "home"
  | "agent-working"
  | "agent-progress"
  | "agent-design";

export default function WillApp() {
  const [screen, setScreen] = useState<Screen>("splash");
  const [selectedTask, setSelectedTask] = useState("Design");
  const [taskDetail, setTaskDetail] = useState("Ad copy");

  // Auto-advance from splash
  useEffect(() => {
    if (screen === "splash") {
      const t = setTimeout(() => setScreen("home"), 2200);
      return () => clearTimeout(t);
    }
  }, [screen]);

  const handleSelectTask = useCallback((task: string) => {
    setSelectedTask(task);
    setScreen("home-action");
  }, []);

  const handleStart = useCallback((task: string, detail: string) => {
    setSelectedTask(task);
    setTaskDetail(detail);
    setScreen("agent-working");
  }, []);

  const handleWorkingDone = useCallback(() => {
    setScreen("agent-progress");
  }, []);

  const handleViewResults = useCallback(() => {
    setScreen("agent-design");
  }, []);

  const handleApprove = useCallback(() => {
    // Reset back to home for demo loop
    setScreen("home");
  }, []);

  const handleBack = useCallback(() => {
    setScreen("agent-progress");
  }, []);

  const screenContent = (
    <>
      {screen === "splash" && (
        <SplashScreen onDone={() => setScreen("home")} />
      )}
      {screen === "home" && (
        <HomeScreen onSelectTask={handleSelectTask} />
      )}
      {screen === "agent-working" && (
        <AgentWorkingScreen
          task={selectedTask}
          detail={taskDetail}
          onDone={handleWorkingDone}
        />
      )}
      {screen === "agent-progress" && (
        <AgentProgressScreen
          task={selectedTask}
          detail={taskDetail}
          onViewResults={handleViewResults}
        />
      )}
      {screen === "agent-design" && (
        <AgentDesignScreen
          task={selectedTask}
          detail={taskDetail}
          onApprove={handleApprove}
          onBack={handleBack}
        />
      )}
    </>
  );

  return (
    <main className="bg-black">
      {/* ── Mobile: full-viewport, no frame ── */}
      <div className="block md:hidden w-full h-[100dvh] relative overflow-hidden">
        {screenContent}
        {/* Home indicator */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full z-50"
          style={{ width: 120, height: 4, background: "rgba(255,255,255,0.2)" }}
        />
      </div>

      {/* ── Desktop: full-screen row-reverse two-column layout ── */}
      <div className="hidden md:flex flex-row-reverse items-stretch min-h-screen bg-black">
        {/* Left column — task wheel (fills remaining width) */}
        <div className="flex-1 relative overflow-hidden">
          {screenContent}
        </div>
        {/* Right column — branding / info panel */}
        <div
          className="flex flex-col items-start justify-center shrink-0 gap-6"
          style={{ width: 360, padding: "60px 48px", borderRight: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div>
            <p className="text-white/30 text-xs font-semibold tracking-[3px] uppercase mb-3">WILL</p>
            <h1 className="text-white font-bold leading-tight" style={{ fontSize: 38 }}>
              Your AI creative<br />agent
            </h1>
          </div>
          <p className="text-white/40 text-sm leading-relaxed" style={{ maxWidth: 260 }}>
            Drag or scroll to choose a task, then let WILL handle the rest — from research to finished output.
          </p>
          {/* Streaming ticker — endless vertical scroll */}
          <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                animation: "will-ticker 12s linear infinite",
              }}
            >
              {[
                "Design", "Marketing", "Strategy", "Write", "Analyze",
                "Research", "Branding", "Content", "Growth", "Code",
                "Campaigns", "Copy", "Pitch", "Plan", "Optimize",
                // duplicate for seamless loop
                "Design", "Marketing", "Strategy", "Write", "Analyze",
                "Research", "Branding", "Content", "Growth", "Code",
                "Campaigns", "Copy", "Pitch", "Plan", "Optimize",
              ].map((t, i) => (
                <span
                  key={i}
                  className="text-xs font-semibold tracking-[2.5px] uppercase"
                  style={{ color: i % 5 === 0 ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.18)" }}
                >
                  {t}
                </span>
              ))}
            </div>
            {/* fade edges */}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, #000 0%, transparent 18%, transparent 82%, #000 100%)", pointerEvents: "none" }} />
          </div>
        </div>
      </div>
    </main>
  );
}
