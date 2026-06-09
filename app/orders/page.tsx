"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
// app/orders/page.tsx の useEffect 内に追記
const { data: { user } } = await supabase.auth.getUser();
console.log("ログイン中のユーザーID:", user?.id); // これを追加
      if (!user) return;
      
      // ここを 'user_id' に修正してください
      const { data, error } = await supabase
        .from('purchase_history')
        .select('*')
        .eq('user_id', user.id); // <--- ここが重要です！

      if (error) {
        console.error("履歴取得エラー:", error);
      } else {
        console.log("取得した履歴データ:", data);
        setOrders(data || []);
        // app/mypage/page.tsx (ORDERS部分)
orders.map((order) => (
  <div key={order.id} className="border border-zinc-800 p-4 rounded-sm flex items-center gap-4">
    {/* 画像パスがある場合のみ表示。なければデフォルト画像などを表示 */}
    {order.image_url ? (
      <img src={order.image_url} alt={order.item_name} className="w-20 h-20 object-cover" />
    ) : (
      <div className="w-20 h-20 bg-zinc-900 flex items-center justify-center text-[10px]">No Image</div>
    )}
    <div>
      <p className="text-sm">{order.item_name}</p>
      <p className="text-lg">¥{order.amount?.toLocaleString()}</p>
      <p className="text-xs text-zinc-500">{new Date(order.created_at).toLocaleDateString()}</p>
    </div>
  </div>
))
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32">
      <h1 className="text-2xl text-center mb-12">購入履歴</h1>
      {orders.length === 0 ? (
        <p className="text-center text-zinc-500">取引記録はまだない。</p>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="border-b border-zinc-800 py-4 max-w-md mx-auto flex justify-between">
            <span>{order.item_name}</span>
            <span>¥{order.amount?.toLocaleString()}</span>
            <span className="text-zinc-500 text-sm">
              {new Date(order.created_at).toLocaleDateString()}
            </span>
          </div>
        ))
      )}
    </div>
  );
}