"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useMessage } from "./MessageContext";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const { showMessage } = useMessage();

  const getStorageKey = (userId: string | null) => {
    return userId ? `cart_${userId}` : "cart_guest";
  };

  const readLocalCart = (userId: string | null): any[] => {
    try {
      const saved = localStorage.getItem(getStorageKey(userId));
      if (!saved) return [];

      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];

      return parsed;
    } catch {
      return [];
    }
  };

  const loadCart = async (userId: string | null) => {
    setIsLoaded(false);
    setCurrentUserId(userId);

    const localCart = readLocalCart(userId);

    if (!userId) {
      setCart(localCart);
      setIsLoaded(true);
      return;
    }

    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      setCart(localCart);
      setIsLoaded(true);
      return;
    }

    const dbCart = data || [];

    setCart(dbCart);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(dbCart));
    setIsLoaded(true);
  };

  useEffect(() => {
    const initCart = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await loadCart(user?.id ?? null);
    };

    initCart();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadCart(session?.user?.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const syncCart = async () => {
      localStorage.setItem(getStorageKey(currentUserId), JSON.stringify(cart));

      if (!currentUserId) return;

      await supabase.from("cart").delete().eq("user_id", currentUserId);

      if (cart.length > 0) {
        const itemsToInsert = cart.map((item) => ({
          ...item,
          user_id: currentUserId,
        }));

        await supabase.from("cart").insert(itemsToInsert);
      }
    };

    syncCart();
  }, [cart, isLoaded, currentUserId]);

  const addToCart = async (product: any, quantity: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      showMessage("祭壇へ移すには\n契約(SIGN IN)が必要だ。\n直ちに契約せよ。");
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);

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
      data: { user },
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
          updatedCart[existingIndex].quantity =
            (updatedCart[existingIndex].quantity || 1) + 1;
        } else {
          updatedCart.push({ ...product, quantity: 1 });
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
              quantity: Math.max(1, (item.quantity || 1) + delta),
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
        updateQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);