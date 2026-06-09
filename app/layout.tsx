import { Header } from "./components/Header";
import { WishlistProvider } from "./context/WishlistContext";
import { CartProvider } from "./context/CartContext";
import { MessageProvider } from "./context/MessageContext";
import FogEffect from "../components/FogEffect"; // FogEffectのインポート
import "./globals.css";
import ConsentModal from "./components/ConsentModal";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="bg-black text-white min-h-screen flex flex-col">
        <ConsentModal /> {/* bodyの直下に移動 */}
        <FogEffect /> 
        <MessageProvider>
          <WishlistProvider>
            <CartProvider>
              <Header />
              <main className="flex-grow">
                {children}
              </main>
              {/* フッターは CartProvider の外側（あるいは内側でもOKですが、通常は外側） */}
              <footer className="mt-20 pb-10 text-center">
                <div className="text-[9px] text-zinc-600 font-mono tracking-widest uppercase opacity-60 leading-tight px-4 mb-4">
                  Disclaimers: All items listed on this site are purely fictional. No real goods will be delivered. All in-site assets have no real-world monetary value.
                </div>
                <a href="/terms" className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest transition">
                  Terms of Service
                </a>
              </footer>
            </CartProvider>
          </WishlistProvider>
        </MessageProvider>
      </body>
    </html>
  );
}