"use client";

import { useCallback, useEffect, useState } from "react";
import SplashScreen from "@/components/screens/splash-screen";
import HomeScreen from "@/components/screens/home-screen";
import HomeActionScreen from "@/components/screens/home-action-screen";
import AgentWorkingScreen from "@/components/screens/agent-working-screen";
import AgentProgressScreen from "@/components/screens/agent-progress-screen";
import AgentDesignScreen from "@/components/screens/agent-design-screen";

type Screen =
  | "splash"
  | "home"
  | "home-action"
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
      {screen === "home-action" && (
        <HomeActionScreen
          initialTask={selectedTask}
          onCancel={() => setScreen("home")}
          onStart={handleStart}
        />
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

      {/* ── Desktop: centered panel, no phone chrome ── */}
      <div className="hidden md:flex items-center justify-center min-h-screen bg-[#111]">
        <div
          className="relative overflow-hidden"
          style={{
            width: 390,
            height: 844,
            borderRadius: 16,
            background: "#000",
            flexShrink: 0,
          }}
        >
          <div className="absolute inset-0">
            {screenContent}
          </div>
          {/* Home indicator */}
          <div
            className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full z-50"
            style={{ width: 120, height: 4, background: "rgba(255,255,255,0.2)" }}
          />
        </div>
      </div>
    </main>
  );
}
