"use client";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext"; // カート機能の追加
import { products } from "../data/products";
import { useState } from "react"; // ⑤の簡易詳細用

export default function WishlistPage() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [selectedProduct, setSelectedProduct] = useState<any>(null); // ⑤簡易詳細用
  
  const wishItems = products.filter((p) => wishlist.includes(p.id));

  // ④ 簡易カート追加ロジック
  const handleAddToCart = (product: any) => {
    addToCart({ ...product, quantity: 1 });
    toggleWishlist(product.id); // 削除も兼ねる
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32">
      <h1 className="text-2xl tracking-[0.3em] mb-12 text-center">FAVORITES</h1>
      
      {wishItems.length === 0 ? (
        <p className="text-center text-zinc-300">禁域にはまだ、何もない。</p>
      ) : (
        <div className="max-w-4xl mx-auto space-y-6">
          {wishItems.map((product) => (
            <div key={product.id} className="border border-zinc-800 p-4 flex gap-4 items-center hover:border-zinc-500 transition">
              <img src={product.detailImg} alt={product.name} className="w-20 h-20 object-cover cursor-pointer" onClick={() => setSelectedProduct(product)} />              
              <div className="flex-1" onClick={() => setSelectedProduct(product)}>
                <h3 className="text-sm cursor-pointer">{product.name}</h3>
                <p className="text-xs text-zinc-500">{product.price}</p>
              <button 
        onClick={(e) => {
          e.stopPropagation(); // 詳細ページが開くのを防ぐ
          toggleWishlist(product.id);
        }}
        className="mt-2 text-[10px] text-zinc-500 underline hover:text-white"
      >
        REMOVE
      </button>
              </div>

              {/* ③ 各商品ごとのカートボタン */}
              <button onClick={() => handleAddToCart(product)} className="border border-white px-4 py-2 text-xs hover:bg-white hover:text-black">
                ADD TO CART
              </button>
            </div>
          ))}

          {/* ② 全部カートに入れるボタン */}
          <button onClick={() => wishItems.forEach(handleAddToCart)} className="w-full border border-zinc-500 py-4 mt-8 hover:border-white transition">
            全てをカートに積載する
          </button>
        </div>
      )}

      {/* ⑤ 簡易詳細モーダル */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedProduct(null)}>
          <div className="bg-zinc-900 p-8 max-w-sm w-full border border-zinc-700">
            <h2 className="text-xl mb-4">{selectedProduct.name}</h2>
            <p className="text-zinc-400 mb-6">{selectedProduct.desc}</p>
            <button onClick={() => setSelectedProduct(null)} className="text-xs text-zinc-300">CLOSE</button>
          </div>
        </div>
      )}
    </div>
  );
}