"use client";
import { useEffect, useState } from "react";
import { useConsent } from "@/context/ConsentContext";

export default function FogEffect() {
  const [shouldShow, setShouldShow] = useState(false);
  const [isFading, setIsFading] = useState(false);
  
  // ConsentContextから制御フックを取得
  const { isAgreed, showFog, setShowFog } = useConsent();

  useEffect(() => {
    // 霧の起動条件:
    // 1. 同意済みであること
    // 2. showFog が true であること (ログイン/同意後の予約)
    if (isAgreed && showFog) {
      setShouldShow(true);
      setIsFading(false);

      // 霧が薄まり始める (3秒後)
      const fadeTimer = setTimeout(() => setIsFading(true), 3000);
      
      // 霧が完全に終了する (8秒後)
      const endTimer = setTimeout(() => {
        setShouldShow(false);
        setShowFog(false); // ★重要: 予約をリセットして再発動を防止
      }, 8000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(endTimer);
      };
    }
  }, [isAgreed, showFog, setShowFog]);

  if (!shouldShow) return null;

  return (
    <div className={`fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center transition-opacity duration-[5000ms] ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <p className="text-zinc-300 tracking-[0.5em] animate-pulse">禁域の霧が晴れる...</p>
    </div>
  );
}