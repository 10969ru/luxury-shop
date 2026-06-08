"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { useMessage } from "../context/MessageContext"; // インポート追加

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("menu");
  const [orders, setOrders] = useState<any[]>([]);
  const [displayName, setDisplayName] = useState("名もなき者");
  const [balance, setBalance] = useState(0);
  const router = useRouter();
  const { showMessage, MESSAGES } = useMessage(); // 共通メッセージ機能

useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
console.log("現在ログイン中のユーザーID:", user?.id); // これを追加
      if (!user) {
        router.push("/login");
        return;
      }

      // 取得結果を確認
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('display_name, balance')
        .eq('id', user.id)
        .single();
      
      // デバッグ用ログ
      console.log("DBから取得したプロフィール:", profile);
      console.log("エラー:", error);
        
      if (profile) {
        // null の場合も考慮しつつ、空文字なら初期値へ
        setDisplayName(profile.display_name && profile.display_name.trim() !== "" ? profile.display_name : "名もなき者");
        setBalance(profile.balance ?? 0);
      } else {
        // profile が取れなかった場合
        setDisplayName("名もなき者");
      }
    };
    fetchUserData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    showMessage(MESSAGES.LOGOUT); // ログアウト時メッセージ
    setTimeout(() => router.push("/"), 1500); // メッセージを読んでから遷移
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32 text-center">
    <h1 className="text-xl tracking-[0.3em] mb-4">
      WELCOME,<br />
      {displayName.toUpperCase()}
    </h1>

      <div className="flex justify-center gap-8 mb-12 border-b border-zinc-800 pb-4 max-w-md mx-auto">
        <button 
          onClick={() => setActiveTab("menu")}
          className={`tracking-[0.2em] transition ${activeTab === "menu" ? "text-white border-b border-white" : "text-zinc-600"}`}
        >
          MENU
        </button>
        <button 
          onClick={() => setActiveTab("history")}
          className={`tracking-[0.2em] transition ${activeTab === "history" ? "text-white border-b border-white" : "text-zinc-600"}`}
        >
          ORDERS
        </button>
      </div>

      {activeTab === "menu" ? (
        <div className="max-w-xs mx-auto space-y-4">
          <button onClick={() => router.push('/wallet')} className="w-full py-4 border border-zinc-800 hover:border-white transition tracking-[0.2em]">WALLET</button>
          <button onClick={handleSignOut} className="w-full py-4 border border-zinc-800 text-zinc-500 hover:text-red-500 transition tracking-[0.2em]">SIGN OUT</button>
        </div>
      ) : (
        <div className="max-w-md mx-auto text-left space-y-4">
          {orders.length === 0 ? (
            <p className="text-zinc-500 text-center mt-10">取引記録はまだない。</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border border-zinc-800 p-4 rounded-sm flex items-center gap-4">
                {order.image_url && (
                  <img src={order.image_url} alt={order.item_name} className="w-16 h-16 object-cover" />
                )}
                <div>
                  <p className="text-sm">{order.item_name}</p>
                  <p className="text-lg">¥{order.amount?.toLocaleString()}</p>
                  <p className="text-xs text-zinc-500">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}