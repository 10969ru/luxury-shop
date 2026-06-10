"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useMessage } from "./MessageContext";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const { showMessage } = useMessage();

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

  const addToCart = async (product: any, quantity: number) => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      showMessage("祭壇へ移すには\n契約(SIGN IN)が必要だ。\n直ちに契約せよ。");
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingIndex > -1) {
        const newCart = [...prevCart];

        newCart[existingIndex].quantity =
          (newCart[existingIndex].quantity || 1) + quantity;

        return newCart;
      }

      return [...prevCart, { ...product, quantity }];
    });

    showMessage("禁忌具を祭壇へ移した。");
  };

  const addMultipleToCart = async (products: any[]) => {
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      showMessage("祭壇へ移すには\n契約(SIGN IN)が必要だ。\n");
      return;
    }

    setCart((prevCart) => {
      const updatedCart = [...prevCart];

      products.forEach((product) => {
        const existingIndex = updatedCart.findIndex(
          (item) => item.id === product.id
        );

        if (existingIndex > -1) {
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity:
              (updatedCart[existingIndex].quantity || 1) + 1
          };
        } else {
          updatedCart.push({
            ...product,
            quantity: 1
          });
        }
      });

      return updatedCart;
    });

    showMessage("禁忌具を祭壇へ移した。");
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(
                1,
                (item.quantity || 1) + delta
              )
            }
          : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        addMultipleToCart,
        removeFromCart,
        updateQuantity
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);