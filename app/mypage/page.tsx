"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { useMessage } from "../context/MessageContext";

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("menu");
  const [orders, setOrders] = useState<any[]>([]);
  const [displayName, setDisplayName] = useState("名もなき者");
  const router = useRouter();
  const { showMessage, MESSAGES } = useMessage();

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // 1. プロフィール取得
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', user.id)
        .single();
      
      if (profile) {
        setDisplayName(profile.display_name?.trim() || "名もなき者");
      }

      // 2. 購入履歴取得（写真データを含む）
      const { data: orderData } = await supabase
        .from('purchase_history')
        .select('id, item_name, amount, created_at, image_url')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (orderData) {
        setOrders(orderData);
      }
    };
    fetchData();
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    showMessage(MESSAGES.LOGOUT);
    setTimeout(() => router.push("/"), 1500);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32 text-center">
      <h1 className="text-xl tracking-[0.3em] mb-4">WELCOME,<br />{displayName.toUpperCase()}</h1>

      <div className="flex justify-center gap-8 mb-12 border-b border-zinc-800 pb-4 max-w-md mx-auto">
        <button onClick={() => setActiveTab("menu")} className={`tracking-[0.2em] transition ${activeTab === "menu" ? "text-white border-b border-white" : "text-zinc-600"}`}>MENU</button>
        <button onClick={() => setActiveTab("history")} className={`tracking-[0.2em] transition ${activeTab === "history" ? "text-white border-b border-white" : "text-zinc-600"}`}>ORDERS</button>
      </div>

      {activeTab === "menu" ? (
        <div className="max-w-xs mx-auto space-y-4">
          <button onClick={() => router.push('/wallet')} className="w-full py-4 border border-zinc-800 hover:border-white transition tracking-[0.2em]">WALLET</button>
          <button 
          onClick={() => router.push('/request')} 
          className="w-full py-4 border border-zinc-800 hover:border-white transition tracking-[0.2em]"
        >
          REQUEST ITEM
        </button>
          <button onClick={handleSignOut} className="w-full py-4 border border-zinc-800 text-zinc-500 hover:text-red-500 transition tracking-[0.2em]">SIGN OUT</button>
          <a 
        href="/terms" 
        className="text-[10px] text-zinc-400 hover:text-white transition tracking-[0.2em] underline decoration-zinc-800 hover:decoration-white"
      >
        TERMS OF SERVICE
      </a>
        </div>
      ) : (
        <div className="max-w-md mx-auto text-left space-y-4">
          {orders.length === 0 ? (
            <p className="text-zinc-500 text-center mt-10">取引記録はまだない。</p>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="border border-zinc-800 p-4 rounded-sm flex items-center gap-4">
                {order.image_url && (
                  <img src={order.image_url} alt={order.item_name} className="w-16 h-16 object-cover bg-zinc-900" />
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