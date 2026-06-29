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

  return (
    <main className="flex items-center justify-center min-h-screen bg-[#111] p-4">
      {/* Mobile phone frame */}
      <div
        className="relative overflow-hidden"
        style={{
          width: 390,
          height: 844,
          borderRadius: 44,
          background: "#000",
          boxShadow: "0 0 0 1px rgba(255,255,255,0.08), 0 32px 80px rgba(0,0,0,0.7), 0 0 0 10px #0a0a0a",
          flexShrink: 0,
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 z-50"
          style={{
            width: 120,
            height: 34,
            background: "#000",
            borderRadius: "0 0 20px 20px",
          }}
        />

        {/* Screens */}
        <div className="absolute inset-0" style={{ paddingTop: 0 }}>
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
        </div>

        {/* Home indicator */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full z-50"
          style={{ width: 120, height: 4, background: "rgba(255,255,255,0.2)" }}
        />
      </div>

      {/* Screen label below the phone */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center"
        style={{ color: "rgba(255,255,255,0.3)", fontSize: 11, letterSpacing: 2, fontWeight: 500 }}
      >
        {screen.toUpperCase().replace(/-/g, " ")}
      </div>
    </main>
  );
}
