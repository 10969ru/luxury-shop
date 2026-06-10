"use client";
// 以下の書き方に修正してみてください
import { useConsent } from "@/context/ConsentContext";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function FogEffect() {
  const [shouldShow, setShouldShow] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const pathname = usePathname();
  const { isAgreed } = useConsent(); // 同意状態を取得

  useEffect(() => {
    // 1. 同意していない場合は、霧の演出を開始しない
    if (!isAgreed) {
      setShouldShow(false);
      return;
    }

    // 2. 同意済みであれば、霧の演出を開始
    // (トップページかつ未訪問の場合のみ)
    if (pathname === "/" && !sessionStorage.getItem("hasVisited")) {
      setShouldShow(true);
      setIsFading(false);

      // 霧が晴れ始める時間: 3秒後
      const fadeTimer = setTimeout(() => setIsFading(true), 3000);

      // 完全に消える時間: 8秒後
      const endTimer = setTimeout(() => {
        setShouldShow(false);
        sessionStorage.setItem("hasVisited", "true");
      }, 8000);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(endTimer);
      };
    }
  }, [pathname, isAgreed]); // isAgreed が変わるたびに再判定

  if (!shouldShow) return null;

  return (
    <div className={`fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center transition-opacity duration-[5000ms] ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <p className="text-zinc-300 tracking-[0.5em] animate-pulse">禁域の霧が晴れる...</p>
    </div>
  );
}