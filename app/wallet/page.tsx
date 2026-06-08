"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function WalletPage() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // ここで一度だけ変数を定義し、取得する
      const { data, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("データ取得エラー:", error);
      } else if (data) {
        console.log("取得できたデータ:", data);
        setBalance(data.balance);
      }
      
      setLoading(false);
    };
    
    fetchProfile();
  }, []);

  const nextBonus = Math.floor(balance * 0.00001);

  if (loading) return <div className="text-center pt-24 text-zinc-500">禁域の情報を照会中...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-10 pt-24">
      <h1 className="text-2xl tracking-[0.3em] mb-16 text-center font-bold">MY ASSETS</h1>
      
      <div className="max-w-md mx-auto bg-zinc-900 p-8 rounded-lg border border-zinc-800 space-y-8">
        <div>
          <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Current Balance</p>
          <p className="text-4xl font-light tracking-wider">¥{balance.toLocaleString()}</p>
        </div>
        
        <div className="pt-8 border-t border-zinc-800">
          <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Next Bonus (0.001%)</p>
          <p className="text-2xl font-light text-zinc-300">¥{nextBonus.toLocaleString()}</p>
        </div>
      </div>
      
    </div>
  );
}