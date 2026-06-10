"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function WalletPage() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // ページにアクセスするたびに最新の残高をデータベースから取得する
    const fetchProfile = async () => {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push("/login");
        return;
      }

      // データベースから最新のbalanceを取得
      const { data, error } = await supabase
        .from("profiles")
        .select("balance")
        .eq("id", user.id)
        .maybeSingle(); // 確実にレコードを取得
          
      if (error) {
        console.error("残高取得エラー:", error);
      } else if (data) {
        setBalance(data.balance);
      }
      setLoading(false);
    };

    fetchProfile();
  }, [router]); // routerが変化した時（ページ遷移時）に再実行

  const nextBonus = Math.floor(balance * 0.00001);

  if (loading) return <div className="text-center pt-24 text-zinc-500">禁域の情報を照会中...</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-24">
      <h1 className="text-2xl tracking-[0.3em] mb-16 text-center font-bold">MY ASSETS</h1>
      
      <div className="max-w-md mx-auto bg-zinc-900 p-8 rounded-lg border border-zinc-800 space-y-8">
        
        {/* Current Balance */}
        <div className="overflow-hidden">
          <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Current Balance</p>
          <p 
            className="font-light tracking-wider"
            style={{ 
              fontSize: 'clamp(1rem, 5vw, 2.2rem)',
              whiteSpace: 'nowrap'
            }}
          >
            ¥{balance.toLocaleString()}
          </p>
        </div>
        
        {/* Next Bonus */}
        <div className="pt-8 border-t border-zinc-800 overflow-hidden">
          <p className="text-zinc-500 text-xs tracking-widest uppercase mb-2">Next Bonus (0.001%)</p>
          <p 
            className="font-light text-zinc-300"
            style={{ 
              fontSize: 'clamp(0.8rem, 4vw, 1.5rem)',
              whiteSpace: 'nowrap'
            }}
          >
            ¥{nextBonus.toLocaleString()}
          </p>
        </div>

      </div>
      
      <div className="mt-12 text-center">
      </div>
    </div>
  );
}