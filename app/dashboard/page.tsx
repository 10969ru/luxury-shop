"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function DashboardPage() {
  const [balance, setBalance] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      
      // 残高を取得
      const { data } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .single();
      
      if (data) setBalance(data.balance);
    };
    checkUser();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl mb-8">VOID ASSETS</h1>
      <div className="p-6 border border-zinc-700 bg-zinc-900 rounded-lg">
        <p className="text-zinc-400">保有残高</p>
        <p className="text-4xl font-bold">¥{balance?.toLocaleString() ?? "Loading..."}</p>
      </div>
      <button 
        onClick={() => { supabase.auth.signOut(); router.push('/login'); }}
        className="mt-8 text-zinc-500 hover:text-white"
      >
        ログアウト
      </button>
    </div>
  );
}