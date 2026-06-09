"use client";
import { useCart } from "../../context/CartContext";
import { useRouter } from "next/navigation";
import { supabase } from "./../../lib/supabaseClient";
import { products } from "../../data/products";
import { useMessage } from "../../context/MessageContext"; // インポート追加

export default function CheckoutPage() {
  const { cart, setCart } = useCart();
  const router = useRouter();
  const { showMessage, MESSAGES } = useMessage(); // 共通機能の呼び出し

  const total = cart.reduce((sum: number, item: any) => {
    const price = typeof item.price === 'string' ? parseInt(item.price.replace(/[^0-9]/g, '')) : item.price;
    return sum + (price * (item.quantity || 1));
  }, 0);

  const handlePurchase = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showMessage("ログインが必要だ。");
      return;
    }

    // 1. 残高取得
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('balance')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      showMessage("ユーザー情報の取得に失敗した。");
      return;
    }

    // 残高チェック
    if (profile.balance < total) {
      showMessage(MESSAGES.PURCHASE_FAILED_FUNDS);
      return;
    }

    // 2. 残高更新
    const { error: balanceError } = await supabase
      .from('profiles')
      .update({ balance: profile.balance - total })
      .eq('id', user.id);

    if (balanceError) {
      showMessage(`決済失敗：${balanceError.message}`);
      return;
    }

    // 3. 履歴データ作成
    const historyItems = cart.map((item: any) => {
      const productData = products.find((p) => p.name === item.name);
      return {
        user_id: user.id,
        item_name: item.name,
        amount: (typeof item.price === 'string' ? parseInt(item.price.replace(/[^0-9]/g, '')) : item.price) * (item.quantity || 1),
        image_url: item.detailImg || productData?.detailImg || ""
      };
    });

// 4. 履歴保存のデバッグ用
console.log("保存しようとしているデータ:", historyItems);
const { error: historyError } = await supabase.from('purchase_history').insert(historyItems);
if (historyError) {
  console.error("履歴エラー詳細:", historyError); // ここに具体的な理由が出る
  return;
}


    // 5. 完了処理：メッセージを出してからリダイレクト
    setCart([]);
    localStorage.removeItem("cart");
    
    // 購入完了フラグを立てる（HomePageで表示するためのもの）
    localStorage.setItem("purchaseComplete", "true");
    
    showMessage(MESSAGES.PURCHASE_SUCCESS);
    
    // メッセージが読めるよう、少し待ってから移動
    setTimeout(() => {
      window.location.href = "/wallet";
    }, 2000);
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