"use client";
import { useEffect, useState } from "react";
import { products } from "./data/products";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export default function HomePage() {
  const [showMsg, setShowMsg] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // スライドショーのタイマー
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // 決済完了のフラグ確認
    if (localStorage.getItem("purchaseComplete") === "true") {
      setShowMsg(true);
      localStorage.removeItem("purchaseComplete");
      setTimeout(() => setShowMsg(false), 3000);
    }
  }, []);

  return (
    <main>
      {/* メッセージ表示 */}
      {showMsg && (
        <div className="fixed top-20 w-full z-50 text-center pointer-events-none">
          <div className="bg-white text-black inline-block px-8 py-4 shadow-2xl tracking-[0.2em]">
            取引完了。禁域の果実が貴方のものとなった。
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="flex flex-col min-h-screen bg-black text-white">
        <main className="flex-grow p-4 pb-24 pt-24 flex flex-col items-center">
          {/* スライドショー */}
          <div className="relative w-full max-w-md h-80 overflow-hidden rounded-3xl bg-zinc-900 mt-8 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="absolute w-full h-full"
              >
                <img src={products[index].listImg} alt={products[index].name} className="w-full h-full object-cover" />
              </motion.div>
            </AnimatePresence>
          </div>

          <h2 className="mt-16 mb-8 text-lg tracking-[0.5em] text-zinc-400">禁断の供物</h2>

          {/* 商品一覧 */}
          <div className="w-full max-w-4xl mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
            {products.map((product) => (
              <Link href={`/product/${product.id}`} key={product.id} className="group block">
                <div className="w-full aspect-video overflow-hidden rounded-xl bg-zinc-900 mb-4">
                  <img
                    src={product.listImg}
                    alt={product.name}
                    className="w-full h-full object-contain transition duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-sm tracking-widest">{product.name}</h3>
                <p className="text-xs text-zinc-500">{product.price}</p>
              </Link>
            ))}
          </div>

          <div className="mt-24 text-zinc-600 font-mono tracking-widest uppercase text-sm">
            Coming soon...
          </div>
        </main>
      </div>
    </main>
  );
}