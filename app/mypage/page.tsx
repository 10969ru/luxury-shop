"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("menu");
  const [orders, setOrders] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // 修正：テーブル名を 'purchase_history' にし、条件を 'user_id' に変更
      const { data } = await supabase
        .from('purchase_history')
        .select('*')
        .eq('user_id', user.id) // <--- ここを修正
        .order('created_at', { ascending: false });
      
      setOrders(data || []);
    };
    if (activeTab === "history") fetchOrders();
  }, [activeTab]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32 text-center">
      <h1 className="text-xl tracking-[0.3em] mb-12">MY ACCOUNT</h1>

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
// OrdersPage の map 内を以下のように修正
orders.map((order) => (
  <div key={order.id} className="border border-zinc-800 p-4 rounded-sm flex items-center gap-4">
    {/* 画像を表示 */}
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