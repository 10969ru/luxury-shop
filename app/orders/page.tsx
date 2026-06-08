// app/orders/page.tsx
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      // select('*') をあえて明示的なカラム名にすると反映されやすいです
      const { data, error } = await supabase
        .from('purchase_history')
        .select('id, item_name, amount, created_at, image_url') // 追加したカラムを含める
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("履歴取得エラー:", error);
      } else {
        console.log("取得した履歴:", data); // コンソールで image_url が入っているか見てください
        setOrders(data || []);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32">
      <h1 className="text-2xl text-center mb-12">購入履歴</h1>
      <div className="max-w-md mx-auto space-y-4">
        {orders.length === 0 ? (
          <p className="text-center text-zinc-500">取引記録はまだない。</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="border border-zinc-800 p-4 rounded-sm flex items-center gap-4">
              {/* image_url が取得できているかここで判断 */}
              {order.image_url ? (
                <img src={order.image_url} alt={order.item_name} className="w-20 h-20 object-cover" />
              ) : (
                <div className="w-20 h-20 bg-zinc-900 flex items-center justify-center text-[10px]">No Data</div>
              )}
              <div>
                <p className="text-sm">{order.item_name}</p>
                <p className="text-lg">¥{order.amount?.toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}