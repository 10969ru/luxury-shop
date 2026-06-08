"use client";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { useMessage } from "../context/MessageContext"; 
import { products } from "../data/products";
import { useState } from "react";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, removeFromWishlist } = useWishlist();
  const { addToCart, addMultipleToCart } = useCart();
  const { showMessage, MESSAGES } = useMessage(); 
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  
  const wishItems = products.filter((p) => wishlist.includes(p.id));

  // 個別追加：メッセージを表示
  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    toggleWishlist(product.id);
    showMessage(MESSAGES.CART_ADD); 
  };

  // 一括追加：メッセージを表示
  const handleMoveAllToCart = () => {
    if (wishItems.length === 0) return;

    addMultipleToCart(wishItems);
    const idsToRemove = wishItems.map(p => p.id);
    removeFromWishlist(idsToRemove);
    showMessage(MESSAGES.CART_ADD_MULTIPLE); 
  };

  // REMOVE時のメッセージも追加しておくと親切です
  const handleRemove = (id: number) => {
    toggleWishlist(id);
    showMessage(MESSAGES.REMOVE); 
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32">
      <h1 className="text-2xl tracking-[0.3em] mb-12 text-center">FAVORITES</h1>
      
      {wishItems.length === 0 ? (
        <p className="text-center text-zinc-300">禁域にはまだ、何もない。</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {wishItems.map((product) => (
            <div key={product.id} className="border border-zinc-800 p-4 flex gap-4 items-center">
              <img 
                src={product.detailImg} 
                alt={product.name} 
                className="w-20 h-20 object-cover cursor-pointer" 
                onClick={() => setSelectedProduct(product)} 
              />
              <div className="flex-1">
                <h3 className="text-sm cursor-pointer" onClick={() => setSelectedProduct(product)}>{product.name}</h3>
                <p className="text-xs text-zinc-500">{product.price}</p>
                <button 
                  onClick={() => handleRemove(product.id)}
                  className="mt-2 text-[10px] text-zinc-500 underline hover:text-white"
                >
                  REMOVE
                </button>
              </div>

              <button 
                onClick={() => handleMoveToCart(product)}
                className="border border-white px-4 py-2 text-xs hover:bg-white hover:text-black transition"
              >
                ADD TO CART
              </button>
            </div>
          ))}

          <button 
            onClick={handleMoveAllToCart}
            className="w-full border border-zinc-500 py-4 mt-8 hover:bg-white hover:text-black transition tracking-[0.2em] text-sm"
          >
            全てをカートに積載する
          </button>
        </div>
      )}

      {/* モーダル部分は変更なし */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedProduct(null)}>
          <div className="bg-zinc-900 p-8 max-w-sm w-full border border-zinc-700" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl mb-4">{selectedProduct.name}</h2>
            <p className="text-sm text-zinc-400 mb-6">{selectedProduct.desc}</p>
            <button onClick={() => setSelectedProduct(null)} className="text-xs text-zinc-300 underline">CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}