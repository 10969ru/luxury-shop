"use client";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  // 1. removeFromCart を取得
  const { cart, removeFromCart } = useCart();
  const router = useRouter();

  const total = cart.reduce((sum: number, item: any) => {
    const price = typeof item.price === 'string' 
      ? parseInt(item.price.replace(/[^0-9]/g, '')) 
      : item.price;
    return sum + (price || 0);
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
              : `¥${item.price.toLocaleString()}`;
              
            return (
              <div key={index} className="flex items-center gap-6 border-b border-zinc-900 pb-4">
                <div className="w-16 h-16 bg-zinc-900 rounded-md overflow-hidden flex-shrink-0">
                  <img src={item.detailImg} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                {/* 商品情報と削除ボタン */}
                <div className="flex-1 flex justify-between items-center">
                  <div>
                    <p>{item.name}</p>
                    {/* 2. REMOVEボタンを追加 */}
                    <button 
                      onClick={() => removeFromCart(index)}
                      className="text-[10px] text-zinc-300 underline mt-1 hover:text-white transition"
                    >
                      REMOVE
                    </button>
                  </div>
                  <span>{displayPrice}</span>
                </div>
              </div>
            );
          })}
          
          <div className="text-right text-xl mt-8">
            TOTAL: ¥{total.toLocaleString()}
          </div>
          
          <button className="w-full border border-white py-3 hover:bg-white hover:text-black transition mt-8 tracking-widest">
            取引開始
          </button>
        </div>
      )}
    </div>
  );
}