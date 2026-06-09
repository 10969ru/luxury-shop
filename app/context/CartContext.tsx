"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient"; // supabaseクライアントをインポート
import { useMessage } from "./MessageContext"; // メッセージ表示用のフック

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const { showMessage } = useMessage(); // メッセージ表示用

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

  // 認証チェックとカート追加を行う関数
  const addToCart = async (product: any, quantity: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    // ① ログインガード：ユーザーがいなければメッセージを出して中断
    if (!user) {
      showMessage("カートに追加するにはログインが必要です。");
      return;
    }

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

  const addMultipleToCart = async (products: any[]) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      showMessage("ログインが必要です。");
      return;
    }

    setCart((prevCart) => {
      const updatedCart = [...prevCart];
      products.forEach((product) => {
        const existingIndex = updatedCart.findIndex((item) => item.id === product.id);
        if (existingIndex > -1) {
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity: (updatedCart[existingIndex].quantity || 1) + 1
          };
        } else {
          updatedCart.push({ ...product, quantity: 1 });
        }
      });
      return updatedCart;
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