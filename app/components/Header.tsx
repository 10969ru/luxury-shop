"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";
import { User } from "@supabase/supabase-js"; // 型を追加

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // マウント時のセッション取得
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };
    getSession();

    // 認証状態の変更監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    // スクロール処理
    const handleScroll = () => {
      if (typeof window !== "undefined") {
        const currentScrollY = window.scrollY;
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setShow(false);
        } else {
          setShow(true);
        }
        setLastScrollY(currentScrollY);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, [lastScrollY]);

  const showBackButton = pathname !== "/";

  return (
    <header 
      className={`fixed top-0 w-full grid grid-cols-[1fr_auto_1fr] items-center p-4 bg-black border-b border-zinc-900 z-50 text-white transition-transform duration-500 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="flex justify-start">
        {showBackButton && (
          <button 
            onClick={() => router.back()} 
            className="text-[10px] tracking-widest text-zinc-300 hover:text-white transition"
          >
            ← BACK
          </button>
        )}
      </div>

      <div className="flex justify-center">
        <h1 
          onClick={() => router.push('/')} 
          className="cursor-pointer text-xl font-bold tracking-[0.3em] text-white"
        >
          VOID
        </h1>
      </div>

      <div className="flex justify-end items-center gap-3">
        {user ? (
          <>
            <button onClick={() => router.push('/wishlist')} className="hover:text-zinc-400">♡</button>
            <button onClick={() => router.push('/cart')} className="hover:text-zinc-400">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
            </button>
            <button 
              onClick={() => router.push('/mypage')} 
              className="text-[10px] border border-white px-2 py-1 hover:bg-white hover:text-black transition"
            >
              MY PAGE
            </button>
          </>
        ) : (
          <button 
            onClick={() => router.push('/login')} 
            className="text-[10px] border border-white px-2 py-1 hover:bg-white hover:text-black transition"
          >
            SIGN IN
          </button>
        )}
      </div>
    </header>
  );
}