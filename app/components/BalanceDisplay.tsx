"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function BalanceDisplay() {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();
      
      if (data) setBalance(data.balance);
    }
  };

  return <div>¥{balance.toLocaleString()}</div>;
}