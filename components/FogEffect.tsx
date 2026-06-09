"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function FogEffect() {
  const [shouldShow, setShouldShow] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // サイト訪問時、もしくはログイン後に遷移したときに実行
    if (pathname === "/" && !sessionStorage.getItem("hasVisited")) {
      setShouldShow(true);
      setIsFading(false);

// 霧が晴れ始める時間: 3秒後
const fadeTimer = setTimeout(() => setIsFading(true), 3000);

// 完全に消える時間: 8秒後 (duration-[5000ms]と合わせる)
const endTimer = setTimeout(() => {
  setShouldShow(false);
  sessionStorage.setItem("hasVisited", "true");
}, 8000);


      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(endTimer);
      };
    }
  }, [pathname]);

  if (!shouldShow) return null;

return (
    <div className={`fixed inset-0 z-[999999] bg-black flex flex-col items-center justify-center transition-opacity duration-[5000ms] ${isFading ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
      <p className="text-zinc-300 tracking-[0.5em] animate-pulse">禁域の霧が晴れる...</p>
    </div>
  );}