"use client";
import { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext<any>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("wishlist");
    if (saved) setWishlist(JSON.parse(saved));
  }, []);

  const toggleWishlist = (id: number) => {
    const next = wishlist.includes(id) ? wishlist.filter(i => i !== id) : [...wishlist, id];
    setWishlist(next);
    localStorage.setItem("wishlist", JSON.stringify(next));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

// ここで1回だけエクスポートします
export const useWishlist = () => useContext(WishlistContext);