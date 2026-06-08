"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);

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

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // 1個ずつ追加する関数
  const addToCart = (product: any, quantity: number) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingIndex].quantity = (newCart[existingIndex].quantity || 1) + quantity;
        return newCart;
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // まとめて追加する関数
const addMultipleToCart = (products: any[]) => {
    setCart((prevCart) => {
      // 既存のカートをベースにする
      const updatedCart = [...prevCart];

      products.forEach((product) => {
        const existingIndex = updatedCart.findIndex((item) => item.id === product.id);
        
        if (existingIndex > -1) {
          // すでにある場合は数量を足す
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity: (updatedCart[existingIndex].quantity || 1) + 1
          };
        } else {
          // ない場合は新しく追加する
          updatedCart.push({ ...product, quantity: 1 });
        }
      });
      
      return updatedCart; // 最後にまとめて更新された配列を返す
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
    <CartContext.Provider value={{ cart, setCart, addToCart, addMultipleToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);