"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter, usePathname } from "next/navigation";

export function Header() {
  const [user, setUser] = useState<any>(null);
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => {
      if (typeof window !== "undefined") {
        if (window.scrollY > lastScrollY && window.scrollY > 100) {
          setShow(false);
        } else {
          setShow(true);
        }
        setLastScrollY(window.scrollY);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      subscription.unsubscribe();
    };
  }, [lastScrollY]);

  // トップページ以外ならBACKボタンを表示
  const showBackButton = pathname !== "/";

  return (
    <header 
      className={`fixed w-full grid grid-cols-3 items-center p-6 bg-black border-b border-zinc-900 z-50 text-white transition-transform duration-500 ${
        show ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* 左側：Backボタン */}
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

      {/* 真ん中：ロゴ */}
      <div className="flex justify-center">
        <h1 
          onClick={() => router.push('/')} 
          className="cursor-pointer text-2xl font-bold tracking-[0.4em] text-white"
        >
          VOID
        </h1>
      </div>

      {/* 右側：アイコン ＋ ボタン */}
      <div className="flex justify-end items-center gap-6">
        {user && (
          <div className="flex gap-4 text-lg items-center">
            <button 
              onClick={() => router.push('/wishlist')} 
              className="hover:text-zinc-400 transition"
            >
              ♡
            </button>
            <button 
            onClick={() => router.push('/cart')} // ここを追加！
            className="hover:text-zinc-400 transition"
            >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            </button>
          </div>
        )}
        
        {user ? (
          <button 
            onClick={() => router.push('/wallet')} 
            className="text-[10px] border border-white px-3 py-1 text-white hover:bg-white hover:text-black transition tracking-tighter"
          >
            MY PAGE
          </button>
        ) : (
          <button 
            onClick={() => router.push('/login')} 
            className="text-[10px] border border-white px-3 py-1 text-white hover:bg-white hover:text-black transition tracking-tighter"
          >
            SIGN IN
          </button>
        )}
      </div>
    </header>
  );
}