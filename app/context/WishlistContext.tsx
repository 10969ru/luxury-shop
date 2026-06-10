"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient"; // 追加
import { useMessage } from "./MessageContext";    // 追加

const WishlistContext = createContext<any>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const { showMessage, MESSAGES } = useMessage(); // 追加

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) {
      try {
        setWishlist(JSON.parse(saved));
      } catch (e) {
        console.error("ウィッシュリストの読み込みに失敗しました");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // ★修正：トグル関数を async にし、ログインチェックを追加
  const toggleWishlist = async (id: number) => {
    const { data: { user } } = await supabase.auth.getUser();

    // 未ログイン時のガード処理
    if (!user) {
      showMessage("欲望の書に記すには、\n契約(SIGN IN)が必要だ。\n直ちに契約せよ。");
      return;
    }

    setWishlist((prev) => {
      const isExists = prev.includes(id);
      if (!isExists) {
        showMessage(MESSAGES.WISH_ADD); // 追加成功時にメッセージ
      }
      return isExists ? prev.filter((i) => i !== id) : [...prev, id];
    });
  };

  const removeFromWishlist = (ids: number[]) => {
    setWishlist((prev) => prev.filter((id) => !ids.includes(id)));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);