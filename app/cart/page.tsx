"use client";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { useMessage } from "../context/MessageContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();
  const { showMessage } = useMessage();

  // 合計金額の計算
  const total = cart.reduce((sum: number, item: any) => {
    const price = typeof item.price === 'string' 
      ? parseInt(item.price.replace(/[^0-9]/g, '')) 
      : item.price;
    return sum + (price * (item.quantity || 1));
  }, 0);

  // 取引開始（チェックアウト）前の認証チェック
  const handleCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      showMessage("取引を開始するにはログインが必要です。");
      router.push("/login");
      return;
    }
    
    router.push("/cart/checkout");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32">
      <h1 className="text-2xl tracking-[0.3em] mb-12 text-center">CART</h1>

      {cart.length === 0 ? (
        <p className="text-center text-zinc-300">禁域の果実はまだ選ばれていない。</p>
      ) : (
        <div className="max-w-md mx-auto space-y-6">
          {cart.map((item: any, index: number) => {
            const unitPrice = typeof item.price === 'string' 
              ? parseInt(item.price.replace(/[^0-9]/g, '')) 
              : item.price;
            const subtotal = unitPrice * (item.quantity || 1);

            return (
              <div key={index} className="flex gap-4 border-b border-zinc-900 pb-4">
                <div className="w-20 h-20 bg-zinc-900 rounded-sm overflow-hidden flex-shrink-0">
                  <img src={item.detailImg} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <p className="text-sm truncate">{item.name}</p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-2 border border-zinc-800 w-fit">
                    <button 
                        onClick={() => updateQuantity(item.id, -1)} 
                        className="px-2 py-0.5 hover:bg-zinc-800 text-xs"
                    >
                        -
                    </button>
                    <span className="text-xs w-6 text-center">{item.quantity || 1}</span>
                    <button 
                        onClick={() => updateQuantity(item.id, 1)} 
                        className="px-2 py-0.5 hover:bg-zinc-800 text-xs"
                    >
                        +
                    </button>
                      </div>  
                    <span className="text-sm">¥{subtotal.toLocaleString()}</span>
                  </div>

                  <button 
                    onClick={() => removeFromCart(index)}
                    className="text-[10px] text-zinc-500 underline w-fit hover:text-white transition"
                  >
                    REMOVE
                  </button>
                </div>
              </div>
            );
          })}
          
          <div className="text-right text-xl mt-8 pt-4 border-t border-zinc-900">
            TOTAL: ¥{total.toLocaleString()}
          </div>
          
          <button 
            onClick={handleCheckout}
            className="w-full border border-white py-3 hover:bg-white hover:text-black transition mt-8 tracking-widest"
          >
            取引開始
          </button>
        </div>
      )}
    </div>
  );
}