"use client";
import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext<any>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([]);

  // マウント時にストレージから読み込み
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

  // 状態変更時にストレージへ保存
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // 個別切り替え用
  const toggleWishlist = (id: number) => {
    setWishlist((prev) => 
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // ★追加：一括削除用の関数
  const removeFromWishlist = (ids: number[]) => {
    setWishlist((prev) => prev.filter((id) => !ids.includes(id)));
  };

// app/context/WishlistContext.tsx 内の戻り値
return (
  <WishlistContext.Provider value={{ wishlist, toggleWishlist, removeFromWishlist }}>
    {children}
  </WishlistContext.Provider>
);}

export const useWishlist = () => useContext(WishlistContext);