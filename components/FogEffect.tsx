"use client";

import { useEffect, useState } from "react";
import { useConsent } from "@/context/ConsentContext";

export default function FogEffect() {
  const [shouldShow, setShouldShow] = useState(false);
  const [isFading, setIsFading] = useState(false);

  const {
    isAgreed,
    showFog,
    setShowFog,
    logoutFog
  } = useConsent();

  useEffect(() => {
    if (isAgreed && showFog) {
      setShouldShow(true);
      setIsFading(false);

      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, 3000);

      const endTimer = setTimeout(() => {
        setShouldShow(false);
        setShowFog(false);
      }, 8000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(endTimer);
      };
    }
  }, [isAgreed, showFog, setShowFog]);

  // ログアウト演出
  if (logoutFog) {
    return (
      <div className="fixed inset-0 z-[999999] bg-black flex items-center justify-center animate-fadeToBlack">
        <p className="text-white tracking-[0.5em] text-center animate-pulse">
          扉は閉ざされた。
          <br />
          またの入館を待つ。
        </p>
      </div>
    );
  }

  // ログイン演出
  if (!shouldShow) return null;

  return (
    <div
      className={`fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center transition-opacity duration-[5000ms] ${
        isFading
          ? "opacity-0 pointer-events-none"
          : "opacity-100"
      }`}
    >
      <p className="text-zinc-300 tracking-[0.5em] animate-pulse">
        禁域の霧が晴れる...
      </p>
    </div>
  );
}