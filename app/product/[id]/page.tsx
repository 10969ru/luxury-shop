"use client";

import { useState, useEffect } from "react"; // useEffectを追加
import { useParams } from "next/navigation";
import { products } from "../../data/products";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useMessage } from "../../context/MessageContext";
import { supabase } from "../../lib/supabaseClient"; // インポートを追加

export default function ProductDetail() {
  const params = useParams();
  const id = Number(params.id);
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const { showMessage, MESSAGES } = useMessage();
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [quantity, setQuantity] = useState(1);

  // ログイン状態を確認
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsLoggedIn(!!user);
    };
    checkUser();
  }, []);

  // ログイン時のみ、かつリストに含まれている場合のみお気に入りとする
  const isFavorite = isLoggedIn && wishlist.includes(id);

  const product = products.find((p) => p.id === id);

  const toggleFavorite = () => {
    toggleWishlist(id);
    // toggleWishlist内で未ログイン時はメッセージが出るようになっているため、
    // ここではログイン中のみ成功メッセージを出す
    if (!isFavorite && isLoggedIn) {
      showMessage(MESSAGES.WISH_ADD);
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, quantity); 
    // カート側でログインチェックをしている前提ですが、
    // 未ログイン時はメッセージがそこで出ます
  };

  if (!product) return <div className="p-20 text-center">商品が見つかりません</div>;

  return (
    <div className="min-h-screen bg-black text-white p-6 pt-32 flex flex-col items-center">
      <div className="max-w-2xl w-full">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="aspect-[4/5] bg-zinc-900 rounded-2xl overflow-hidden max-w-sm mx-auto">
            <img src={product.detailImg} alt={product.name} className="w-full h-full object-cover" />
          </div>
          
          <div>
            <h1 className="text-3xl font-light tracking-[0.2em] mb-4">{product.name}</h1>
            <p className="text-lg text-zinc-300 mb-6">{product.price}</p>
            <p className="text-zinc-400 leading-loose mb-8">{product.desc}</p>
            
            {product.id === 2 && (
              <div className="mb-6">
                <label className="text-[10px] text-zinc-300 tracking-[0.2em] mb-2 block">QUANTITY</label>
                <div className="flex items-center gap-4">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-8 h-8 border border-zinc-700 hover:border-white transition">-</button>
                  <span className="w-8 text-center font-light">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-8 h-8 border border-zinc-700 hover:border-white transition">+</button>
                </div>
              </div>
            )}

            <div className="flex gap-4 mb-8">
              <button 
                onClick={toggleFavorite}
                className={`w-16 border border-zinc-700 flex items-center justify-center transition ${
                  isFavorite ? "text-pink-500 border-pink-500" : "hover:border-pink-500 hover:text-pink-500"
                }`}
              >
                {isFavorite ? "♥" : "♡"}
              </button>
              
              <button 
                onClick={handleAddToCart}
                className="flex-1 border border-white py-4 hover:bg-white hover:text-black transition uppercase tracking-[0.3em] text-sm"
              >
                {product.id === 2 ? `Add to Cart (${quantity})` : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}