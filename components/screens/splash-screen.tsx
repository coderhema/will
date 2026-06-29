"use client";

import WillLogo from "@/components/will-logo";

interface SplashScreenProps {
  onDone: () => void;
}

export default function SplashScreen({ onDone }: SplashScreenProps) {
  return (
    <div
      className="w-full h-full flex items-center justify-center bg-black cursor-pointer select-none"
      onClick={onDone}
    >
      <WillLogo variant="splash" label="WILL" />
    </div>
  );
}
