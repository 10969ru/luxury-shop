"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useMessage } from "./MessageContext";

const CartContext = createContext<any>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { showMessage } = useMessage();

  const getStorageKey = (userId: string | null) =>
    userId ? `cart_${userId}` : "cart_guest";

  const saveCart = async (userId: string, nextCart: any[]) => {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(nextCart));

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("username, display_name")
      .eq("id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("cart profile fetch error:", profileError);
    }

    const { error: deleteError } = await supabase
      .from("cart")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      console.error("cart delete error:", deleteError);
      return;
    }

    if (nextCart.length === 0) return;

    const itemsToInsert = nextCart.map((item) => ({
      user_id: userId,
      product_id: Number(item.product_id ?? item.id),
      quantity: item.quantity || 1,
      username: profile?.username ?? "",
      display_name: profile?.display_name ?? "",
      product_name: item.product_name ?? item.name ?? "",
      price: item.price ?? "0",
      detail_img: item.detail_img ?? item.detailImg ?? null,
    }));

    const { error: insertError } = await supabase
      .from("cart")
      .insert(itemsToInsert);

    if (insertError) {
      console.error("cart insert error:", JSON.stringify(insertError, null, 2));
      return;
    }

    console.log("cart saved:", itemsToInsert);
  };

  const loadCart = async (userId: string | null) => {
    setCurrentUserId(userId);

    if (!userId) {
      setCart([]);
      return;
    }

    const { data, error } = await supabase
      .from("cart")
      .select("*")
      .eq("user_id", userId);

    if (error) {
      console.error("cart load error:", error);
      return;
    }

    const dbCart =
      data?.map((item) => ({
        ...item,
        id: Number(item.product_id),
        product_id: Number(item.product_id),
        name: item.product_name,
        price: item.price,
        detailImg: item.detail_img,
        detail_img: item.detail_img,
        quantity: item.quantity || 1,
      })) || [];

      

    console.log("cart loaded:", dbCart);

    setCart(dbCart);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(dbCart));
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

  const addToCart = async (product: any, quantity: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      showMessage("祭壇へ移すには\n契約(SIGN IN)が必要だ。\n直ちに契約せよ。");
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => Number(item.id) === Number(product.id)
      );

      const nextCart = [...prevCart];

      if (existingIndex > -1) {
        nextCart[existingIndex] = {
          ...nextCart[existingIndex],
          quantity: (nextCart[existingIndex].quantity || 1) + quantity,
        };
      } else {
        nextCart.push({
          ...product,
          id: Number(product.id),
          product_id: Number(product.id),
          quantity,
        });
      }

      saveCart(user.id, nextCart);
      return nextCart;
    });

    showMessage("禁忌具を祭壇へ移した。");
  };

const addMultipleToCart = async (products: any[], silent = false) => {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    showMessage("祭壇へ移すには\n契約(SIGN IN)が必要だ。\n");
    return;
  }

  setCart((prevCart) => {
    const nextCart = [...prevCart];

    products.forEach((product) => {
      const existingIndex = nextCart.findIndex(
        (item) => Number(item.id) === Number(product.id)
      );

      if (existingIndex > -1) {
        nextCart[existingIndex] = {
          ...nextCart[existingIndex],
          quantity: (nextCart[existingIndex].quantity || 1) + 1,
        };
      } else {
        nextCart.push({
          ...product,
          id: Number(product.id),
          product_id: Number(product.id),
          quantity: 1,
        });
      }
    });

    saveCart(user.id, nextCart);
    return nextCart;
  });

  if (!silent) {
    showMessage("禁忌具を祭壇へ移した。");
  }
};

  const removeFromCart = (index: number) => {
    if (!currentUserId) return;

    setCart((prev) => {
      const nextCart = prev.filter((_, i) => i !== index);
      saveCart(currentUserId, nextCart);
      return nextCart;
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    if (!currentUserId) return;

    setCart((prev) => {
      const nextCart = prev.map((item) =>
        Number(item.id) === Number(id)
          ? {
              ...item,
              quantity: Math.max(1, (item.quantity || 1) + delta),
            }
          : item
      );

      saveCart(currentUserId, nextCart);
      return nextCart;
    });
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