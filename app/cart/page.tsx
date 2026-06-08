"use client";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  // 1. updateQuantity を追加で取得
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  // 数量を考慮した計算に修正
  const total = cart.reduce((sum: number, item: any) => {
    const price = typeof item.price === 'string' 
      ? parseInt(item.price.replace(/[^0-9]/g, '')) 
      : item.price;
    return sum + (price * (item.quantity || 1)); // 数量を掛ける
  }, 0);

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32">
      <h1 className="text-2xl tracking-[0.3em] mb-12 text-center">CART</h1>

      {cart.length === 0 ? (
        <p className="text-center text-zinc-300">禁域の果実はまだ選ばれていない。</p>
      ) : (
        <div className="max-w-2xl mx-auto space-y-6">
          {cart.map((item: any, index: number) => {
            const displayPrice = typeof item.price === 'string' 
              ? item.price 
              : `¥${(item.price * (item.quantity || 1)).toLocaleString()}`;
              
            return (
              <div key={index} className="flex items-center gap-6 border-b border-zinc-900 pb-4">
                <div className="w-16 h-16 bg-zinc-900 rounded-md overflow-hidden flex-shrink-0">
                  <img src={item.detailImg} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p>{item.name}</p>
                    <button 
                      onClick={() => removeFromCart(index)}
                      className="text-[10px] text-zinc-300 underline mt-1 hover:text-white transition"
                    >
                      REMOVE
                    </button>
                  </div>

                  {/* 数量変更ボタン */}
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateQuantity(item.id, -1)} className="px-2 border border-zinc-700">-</button>
                    <span>{item.quantity || 1}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className="px-2 border border-zinc-700">+</button>
                  </div>

                  <span>{displayPrice}</span>
                </div>
              </div>
            );
          })}
          
          <div className="text-right text-xl mt-8">
            TOTAL: ¥{total.toLocaleString()}
          </div>
          
            <button 
            onClick={() => router.push("/cart/checkout")} // ここを変更
            className="w-full border border-white py-3 hover:bg-white hover:text-black transition mt-8 tracking-widest"
            >
            取引開始
            </button>
        </div>
      )}
    </div>
  );
}