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

  const handleMoveToCart = (product: any) => {
    addToCart(product, 1);
    toggleWishlist(product.id);
    showMessage(MESSAGES.CART_ADD);
  };

  const handleRemove = (id: number) => {
    toggleWishlist(id);
    showMessage(MESSAGES.REMOVE);
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32 pb-24">
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
                className="w-20 h-20 object-cover cursor-pointer flex-shrink-0"
                onClick={() => setSelectedProduct(product)}
              />
              
              <div className="flex-1 min-w-0">
                <h3 className="text-sm cursor-pointer truncate" onClick={() => setSelectedProduct(product)}>
                  {product.name}
                </h3>
                <p className="text-xs text-zinc-500 mb-2">{product.price}</p>
                
                {/* ★ここを調整：REMOVEボタンとカートボタンを同じ行に配置 */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="text-[10px] text-zinc-500 underline hover:text-white transition"
                  >
                    REMOVE
                  </button>
                  
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className="text-white hover:text-zinc-400 transition"
                    aria-label="Add to cart"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => { /* 一括追加のロジック */ }}
            className="w-full border border-zinc-500 py-4 mt-8 hover:bg-white hover:text-black transition tracking-[0.2em] text-sm"
          >
            全てをカートに積載する
          </button>
          {/* 商品詳細モーダル */}
      {selectedProduct && (
        <div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50" 
          onClick={() => setSelectedProduct(null)}
        >
          <div 
            className="bg-black p-8 max-w-sm w-full border border-zinc-700 relative" 
            onClick={(e) => e.stopPropagation()} // モーダル内クリックで閉じないようにする
          >
            {/* 右上の×ボタン */}
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 商品詳細内容 */}
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
      )}
    </div>
  );
}