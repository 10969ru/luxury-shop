"use client";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import { supabase } from "./../../lib/supabaseClient";
import { products } from "../../data/products";

export default function CheckoutPage() {
  const { cart, setCart } = useCart();
  const router = useRouter();

  const total = cart.reduce((sum: number, item: any) => {
    const price = typeof item.price === 'string' ? parseInt(item.price.replace(/[^0-9]/g, '')) : item.price;
    return sum + (price * (item.quantity || 1));
  }, 0);

const handlePurchase = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return alert("ログインしてください");

    // 1. 残高取得
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.error("ユーザー情報取得失敗:", profileError);
      return alert("ユーザー情報の取得に失敗しました");
    }

    // 残高チェック
    if (profile.balance < total) {
      return alert("残高が足りない。禁域の果実は高価だ。");
    }

    // 2. 残高更新
    const { error: balanceError } = await supabase
      .from('profiles')
      .update({ balance: profile.balance - total })
      .eq('id', user.id);

    if (balanceError) return alert("決済失敗: " + balanceError.message);

    // 3. 履歴データ作成（ここが重要）
// app/cart/checkout/page.tsx 内の handlePurchase
const historyItems = cart.map((item: any) => {
  // itemにdetailImgが入っていればそれを使う。なければproducts.tsから補完する。
  const productData = products.find((p) => p.name === item.name);
  
  return {
    user_id: user.id,
    item_name: item.name,
    amount: (typeof item.price === 'string' ? parseInt(item.price.replace(/[^0-9]/g, '')) : item.price) * (item.quantity || 1),
    // ここで detailImg を優先的に使用する
    image_url: item.detailImg || productData?.detailImg || ""
  };
});

  // 4. 履歴保存
  const { error: historyError } = await supabase.from('purchase_history').insert(historyItems);
  if (historyError) return alert("履歴の保存に失敗しました");

  // 5. 完了処理：メッセージを出してからリダイレクト
  setCart([]);
  localStorage.removeItem("cart");
  alert("購入が完了しました。禁域の果実が手に入った。"); 
  window.location.href = "/wallet";
};

return (
    <div className="min-h-screen bg-black text-white p-6 pt-32 text-center">
      <h1 className="text-xl tracking-[0.3em] mb-12">取引を確認する</h1>
      <div className="max-w-md mx-auto space-y-4 mb-12">
        {cart.map((item: any, i: number) => (
          <div key={i} className="flex justify-between text-sm">
            <span>{item.name} × {item.quantity}</span>
          </div>
        ))}
        <div className="border-t border-zinc-800 pt-4 text-xl">合計: ¥{total.toLocaleString()}</div>
      </div>
      <div className="flex justify-center gap-8">
        <button onClick={() => router.back()} className="px-8 py-3 border border-zinc-500 text-zinc-500">NO</button>
        <button onClick={handlePurchase} className="px-8 py-3 border border-white hover:bg-white hover:text-black transition">YES</button>
      </div>
    </div>
  );
  
}