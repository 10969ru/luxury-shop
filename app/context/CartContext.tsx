"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);

  // ローカルストレージからロード
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const addToCart = (product: any) => {
    setCart((prev) => {
      const next = [...prev, product];
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  };

  // ★removeFromCartをここ（Providerの中）に移動しました
  const removeFromCart = (index: number) => {
    setCart((prev) => {
      const next = prev.filter((_, i) => i !== index);
      localStorage.setItem("cart", JSON.stringify(next));
      return next;
    });
  };

  return (
    // ★valueに removeFromCart を追加
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);