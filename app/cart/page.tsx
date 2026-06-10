"use client";
import { useState } from "react"; // useStateを追加
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { useMessage } from "../context/MessageContext";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();
  const { showMessage } = useMessage();
  // ★モーダル用の状態を追加
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const total = cart.reduce((sum: number, item: any) => {
    const price = typeof item.price === 'string' 
      ? parseInt(item.price.replace(/[^0-9]/g, '')) 
      : item.price;
    return sum + (price * (item.quantity || 1));
  }, 0);

  const handleCheckout = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      showMessage("取引を開始するには契約が必要だ。\n");
      router.push("/login");
      return;
    }
    router.push("/cart/checkout");
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32 pb-24">
      <h1 className="text-2xl tracking-[0.3em] mb-12 text-center">CART</h1>

      {cart.length === 0 ? (
        <p className="text-center text-zinc-300">禁忌具はまだ選ばれていない。</p>
      ) : (
        <div className="max-w-md mx-auto space-y-8">
          {cart.map((item: any, index: number) => {
            const unitPrice = typeof item.price === 'string' 
              ? parseInt(item.price.replace(/[^0-9]/g, '')) 
              : item.price;
            const subtotal = unitPrice * (item.quantity || 1);

            return (
              <div key={index} className="flex gap-4 border-b border-zinc-900 pb-6">
                {/* ★画像クリックでモーダル表示 */}
                <div 
                  className="w-20 h-20 bg-zinc-900 rounded-sm overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={() => setSelectedProduct(item)}
                >
                  <img src={item.detailImg} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  {/* ★商品名クリックでモーダル表示 */}
                  <p 
                    className="text-sm truncate cursor-pointer hover:text-zinc-400"
                    onClick={() => setSelectedProduct(item)}
                  >
                    {item.name}
                  </p>
                  
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-zinc-800">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-0.5 hover:bg-zinc-800 text-xs">-</button>
                        <span className="text-xs w-6 text-center">{item.quantity || 1}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-0.5 hover:bg-zinc-800 text-xs">+</button>
                      </div>
                      <button onClick={() => removeFromCart(index)} className="text-[10px] text-zinc-500 underline hover:text-white transition">
                        REMOVE
                      </button>
                    </div>
                  </div>
                  
                  <div className="text-sm text-right mt-1 font-mono">
                    ¥{subtotal.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
          
          <div className="text-right text-xl mt-8 pt-4 border-t border-zinc-900">
            TOTAL: ¥{total.toLocaleString()}
          </div>
          
          <button onClick={handleCheckout} className="w-full border border-white py-3 hover:bg-white hover:text-black transition mt-8 tracking-widest">
            取引開始
          </button>
        </div>
      )}

      {/* ★モーダルコンポーネント */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50" 
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-black p-8 max-w-sm w-full border border-zinc-700 relative" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <h2 className="text-xl tracking-[0.2em] mb-6 border-b border-zinc-800 pb-4">
              {selectedProduct.name}
            </h2>
            <p className="text-sm text-zinc-300 leading-relaxed">
              {selectedProduct.desc}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}