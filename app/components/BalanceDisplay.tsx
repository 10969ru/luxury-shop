"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function BalanceDisplay() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const fetchBalance = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from("profiles").select("balance").eq("id", user.id).single();
        if (data) setBalance(data.balance);
      }
    };
    fetchBalance();
  }, []);

  return (
    <div className="p-4 border border-zinc-700 bg-black text-white font-mono">
      Current Assets: ¥{balance.toLocaleString()}
    </div>
  );
}