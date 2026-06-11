"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useMessage } from "./MessageContext";

const WishlistContext = createContext<any>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { showMessage, MESSAGES } = useMessage();

  const getStorageKey = (userId: string | null) =>
    userId ? `wishlist_${userId}` : "wishlist_guest";

  const saveWishlist = async (userId: string, nextWishlist: number[]) => {
    localStorage.setItem(getStorageKey(userId), JSON.stringify(nextWishlist));

    const { data: profile } = await supabase
      .from("profiles")
      .select("username, display_name")
      .eq("id", userId) // profiles が id で紐づくならここを .eq("id", userId) に変更
      .maybeSingle();

    const { error: deleteError } = await supabase
      .from("wishlist")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      console.error("wishlist delete error:", deleteError);
      return;
    }

    if (nextWishlist.length === 0) return;

    const items = nextWishlist.map((id) => ({
      user_id: userId,
      product_id: id,
      username: profile?.username ?? null,
      display_name: profile?.display_name ?? null,
    }));

    const { error: insertError } = await supabase
      .from("wishlist")
      .insert(items);

    if (insertError) {
      console.error("wishlist insert error:", insertError);
      return;
    }

    console.log("wishlist saved:", items);
  };

  const loadWishlist = async (userId: string | null) => {
    setCurrentUserId(userId);

    if (!userId) {
      setWishlist([]);
      return;
    }

    const { data, error } = await supabase
      .from("wishlist")
      .select("product_id")
      .eq("user_id", userId);

    if (error) {
      console.error("wishlist load error:", error);
      return;
    }

    const dbWishlist = data
      ? data
          .map((item) => Number(item.product_id))
          .filter((id) => Number.isFinite(id))
      : [];

    console.log("wishlist loaded:", dbWishlist);

    setWishlist(dbWishlist);
    localStorage.setItem(getStorageKey(userId), JSON.stringify(dbWishlist));
  };

  useEffect(() => {
    const initWishlist = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await loadWishlist(user?.id ?? null);
    };

    initWishlist();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      loadWishlist(session?.user?.id ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const toggleWishlist = async (id: number) => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      showMessage(
        "欲望の書に記すには、\n契約(SIGN IN)が必要だ。\n直ちに契約せよ。"
      );
      return;
    }

    setWishlist((prev) => {
      const isExists = prev.includes(id);
      const nextWishlist = isExists
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];

      saveWishlist(user.id, nextWishlist);

      if (!isExists) {
        showMessage(MESSAGES.WISH_ADD);
      }

      return nextWishlist;
    });
  };

  const removeFromWishlist = (ids: number[]) => {
    if (!currentUserId) return;

    setWishlist((prev) => {
      const nextWishlist = prev.filter((id) => !ids.includes(id));
      saveWishlist(currentUserId, nextWishlist);
      return nextWishlist;
    });
  };

  return (
    <WishlistContext.Provider
      value={{ wishlist, toggleWishlist, removeFromWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);