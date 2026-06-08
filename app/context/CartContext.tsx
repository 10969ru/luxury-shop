"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);

  // 1. マウント時にローカルストレージからロード
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCart(JSON.parse(saved));
      } catch (e) {
        console.error("カートデータの読み込みに失敗しました");
      }
    }
  }, []);

  // 2. カート変更時に自動で保存する仕組み（副作用）
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 3. 追加処理（数量指定可能に修正）
// CartContext 内の addToCart のイメージ
const addToCart = (product: any, quantity: number) => {
  setCart((prevCart: any[]) => {
    // 既存のカートに同じIDの商品があるか確認
    const existingIndex = prevCart.findIndex((item) => item.id === product.id);
    if (existingIndex > -1) {
      const newCart = [...prevCart];
      newCart[existingIndex].quantity += quantity;
      return newCart;
    }
    // ここで product 全体を保存するため、id も detailImg も含まれる
// addToCart関数内での保存方法を確認してください
return [...prevCart, { ...product, quantity }]; // product 全体を渡す
});
};

const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) => 
      prev.map((item) => 
        item.id === id ? { ...item, quantity: Math.max(1, (item.quantity || 1) + delta) } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);